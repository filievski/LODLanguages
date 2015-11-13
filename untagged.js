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
var nums=0;
var pendingRequests=0;


var initArray(){
	var arr={};
        for (var i=0; i<=20; i++){
                arr[i.toString()]=0;
        }
	return arr;
}
var cld_undef_solved=initArray(), ld_undef_solved=initArray(), tika_undef_solved=initArray();
docid=process.argv[2];

var category = require('unicode-7.0.0/categories');
var isNLS = function(s){
        var consecutive=0
        if (s.length<2) return false;
        for (var i = 0, len=s.length; i<len; i++) {
                if(category[ s.charCodeAt(i) ][0]=="L") {
                        if (++consecutive==2) return true;
                } else {
                        consecutive=0;
                }
                if (i==len-1) return false;
        }
}


var DetectorFactory = java.import('com.cybozu.labs.langdetect.DetectorFactory')
DetectorFactory.loadProfile("langdetect-03-03-2014/profiles.sm", function(err, rslt){
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var litvalue=N3Util.getLiteralValue(docobj);
                        var datatype = N3Util.getLiteralType(docobj);
                        if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
				nums++;
			else { 
				if (!N3Util.getLiteralLanguage(docobj)){ //Defined
					pendingRequests++;
					cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
				                var wordlog_s = math.min(20, parseInt(math.log(litvalue.split(' ').length, 2), 10)).toString();
						if (result && result["languages"][0]) cld_undef_solved[wordlog_s]++;
						DetectorFactory.create(function(err, detector){
							detector.append(N3Util.getLiteralValue(docobj), function(err, o){
								detector.detect(function(err, r){
									if (!err && r) ld_undef_solved[wordlog_s]++;
									tika.language(N3Util.getLiteralValue(docobj), function(err, language, reasonablyCertain) {
										pendingRequests--;
										if (!err && language){
											tika_undef_solved[wordlog_s]++;
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

var printArray = function(arr, fn){
	var toPrint="";
	for (var i=0; i<=20; i++){
		toPrint += arr[i.toString()] + "\t";
	}
	toPrint += "\n";
	fs.appendFile(fn, toPrint, function(err){
                fs.appendFile("write_errors.log", docid + "\n", function(err){});
	})
}

var writeLog = function(){
	printArray(cld_undef_solved, 'cld_untagged.csv');
	printArray(ld_undef_solved, 'ld_untagged.csv');
	printArray(tika_undef_solved, 'tika_untagged.csv');
}

console.log(docid);

//cld.detect('', function(err, result) {
//  console.log(result);
//});
