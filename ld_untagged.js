var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var java = require('java');
java.classpath.push("langdetect-03-03-2014/lib/langdetect.jar");//Needs to be on the same path as of .js file
java.classpath.push("langdetect-03-03-2014/lib/jsonic-1.2.0.jar");
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var math=require('mathjs');
var streamFinished = false;
var pendingRequests=0;

var initArray = function(){
	var arr={};
        for (var i=0; i<=20; i++){
                arr[i.toString()]=0;
        }
	return arr;
}
var ld_undef_solved=initArray();

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
                        if ((datatype!="http://www.w3.org/2001/XMLSchema#string" && datatype!="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") || !isNLS(litvalue)){
				if (!N3Util.getLiteralLanguage(docobj)){ //Defined
					pendingRequests++;
					var wordlog_s = math.min(20, parseInt(math.log(litvalue.split(' ').length, 2), 10)).toString();
					DetectorFactory.create(function(err, detector){
						detector.append(litvalue, function(err, o){
							detector.detect(function(err, r){
								if (!err && r) ld_undef_solved[wordlog_s]++;
								pendingRequests--;
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
	var toPrint="";
	for (var i=0; i<=20; i++){
		toPrint += ld_undef_solved[i.toString()] + "\t";
	}
	toPrint += "\n";
	fs.appendFile('ld_untagged.csv', toPrint, function(err){
		if (err)
                	fs.appendFile("write_errors.log", "error\n", function(err){});
	})
}


//cld.detect('', function(err, result) {
//  console.log(result);
//});
