var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var java = require('java');
java.classpath.push("langdetect-03-03-2014/lib/langdetect.jar");//Needs to be on the same path as of .js file
java.classpath.push("langdetect-03-03-2014/lib/jsonic-1.2.0.jar");
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var cld=require('cld');
var tika=require('tika');
var streamFinished = false;
var regex = /^[-\.,0-9]*$/;
var nums=0;
var pendingRequests=0;
var def=0, undef=0;
var allLines=0;
var cld_undef_solved=0, ld_undef_solved=0, tika_undef_solved=0;
var cld_def_solved_good=0, ld_def_solved_good=0, tika_def_solved_good=0;
var cld_def_solved_bad=0, ld_def_solved_bad=0, tika_def_solved_bad=0;
docid=process.argv[2];
var DetectorFactory = java.import('com.cybozu.labs.langdetect.DetectorFactory')
DetectorFactory.loadProfile("langdetect-03-03-2014/profiles.sm", function(err, rslt){
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var litvalue=N3Util.getLiteralValue(docobj);
			allLines++;
			if (litvalue.match(regex))
				nums++;
			else { 
				pendingRequests++;
				if (N3Util.getLiteralLanguage(docobj)){ //Defined
					def++;
					cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
						var user_lt = N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase();	
						if (result && result["languages"]["0"]){
							if (result["languages"]["0"]["code"].substring(0,2).toLowerCase()==user_lt)
								cld_def_solved_good++;
							else
								cld_def_solved_bad++;
						}
						DetectorFactory.create(function(err, detector){
							if (err) console.log(err);
							detector.append(N3Util.getLiteralValue(docobj), function(err, o){
								detector.detect(function(err, r){
									if (!err && r) {
										if (r.substring(0,2).toLowerCase()==user_lt) ld_def_solved_good++;
										else ld_def_solved_bad++;
									}
									tika.language(N3Util.getLiteralValue(docobj), function(err, language, reasonablyCertain) {
										pendingRequests--;
										if (!err && language)
										{
											if (language==user_lt)
												tika_def_solved_good++;
											else
												tika_def_solved_bad++;
										}
										if (streamFinished && pendingRequests == 0) writeLog();
									});
								});
							});
						});
					});
				} else {
					undef++;
					cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
						if (result && result["languages"][0]) cld_undef_solved++;
						DetectorFactory.create(function(err, detector){
							detector.append(N3Util.getLiteralValue(docobj), function(err, o){
								detector.detect(function(err, r){
									if (!err && r) ld_undef_solved++;
									tika.language(N3Util.getLiteralValue(docobj), function(err, language, reasonablyCertain) {
										pendingRequests--;
										if (!err && language){
											tika_undef_solved++;
										} 
										if (streamFinished && pendingRequests == 0) writeLog();
									});

                                                        	});
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
	fs.appendFile('all_lang_logs.txt', def.toString() + "\t" + cld_def_solved_good.toString() + "\t" + cld_def_solved_bad.toString() + "\t" + ld_def_solved_good.toString() + "\t" + ld_def_solved_bad.toString() + "\t" + tika_def_solved_good.toString() + "\t" + tika_def_solved_bad.toString() + "\t" + undef.toString() + "\t" + cld_undef_solved.toString() + "\t" + ld_undef_solved.toString() + "\t" + tika_undef_solved.toString() + "\t" + nums.toString() + "\t" + allLines.toString() + "\t" + docid + "\n", function (err){
		fs.appendFile("write_errors.log", docid + "\n", function(err){});
	});
}

console.log(docid);

//cld.detect('', function(err, result) {
//  console.log(result);
//});
