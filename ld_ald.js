var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();

var java = require('java');
java.classpath.push("langdetect-03-03-2014/lib/langdetect.jar");//Needs to be on the same path as of .js file
java.classpath.push("langdetect-03-03-2014/lib/jsonic-1.2.0.jar");

var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
//var cld=require('cld');
//var tika=require('tika');
var streamFinished = false;
var regex = /^[-\.,0-9]*$/;
var nums=0;
var pendingRequests = 0;
var def=0, undef=0;
var allLines=0;
var undef_solved=0, undef_unsolved=0, def_unsolved=0, def_solved_good=0, def_solved_bad=0;
docid=process.argv[2];
var DetectorFactory = java.import('com.cybozu.labs.langdetect.DetectorFactory')

DetectorFactory.loadProfile("langdetect-03-03-2014/profiles.sm", function(err, result){

	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var litvalue=N3Util.getLiteralValue(docobj);
			allLines++;

			if (litvalue.match(regex)) {
				nums++;
			} else { 
				pendingRequests++;
				if (N3Util.getLiteralLanguage(docobj)){ //Defined

					def++;
					DetectorFactory.create(function(err, detector){
						if (err) console.log(err);
						detector.append(N3Util.getLiteralValue(docobj), function(err, o){
							detector.detect(function(err, r){
								pendingRequests--;
								if (err || !r) def_unsolved++;
								else{
									if (r.substring(0,2).toLowerCase()==N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase()) def_solved_good++;
									else def_solved_bad++;
								}
								if (streamFinished && pendingRequests == 0) writeLog();
							});
						});
					});
				} else {

					undef++;
						
					DetectorFactory.create(function(err, detector){
                                                detector.append(N3Util.getLiteralValue(docobj), function(err, o){
                                                        detector.detect(function(err, r){
                                                                pendingRequests--;
                                                                if (err || !r) undef_unsolved++;
                                                                else undef_solved++;
                                                                if (streamFinished && pendingRequests == 0) writeLog();
                                                        });
                                                });
                                        });
		
				}
			}
		} else{
			streamFinished=true;
			if (pendingRequests == 0) writeLog();
		//	console.log("End of file: Solved, unsolved, defined...");
		//	console.log(solved);
		//	console.log(unsolved);
		//	console.log(defined);
		}
	});
});

var writeLog = function(){
	fs.appendFile('ld_lang_logs.txt', def.toString() + "\t" + def_solved_good.toString() + "\t" + def_solved_bad.toString() + "\t" + def_unsolved.toString() + "\t" + undef.toString() + "\t" + undef_solved.toString() + "\t" + undef_unsolved.toString() + "\t" + nums.toString() + "\t" + allLines.toString() + "\t" + docid + "\n", function (err){
	});

}

console.log(docid);

//cld.detect('', function(err, result) {
//  console.log(result);
//});
