var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
var math=require('mathjs');
var nums=0;
var processFinished=false;
var pendingRequests=0;

var initArray = function(){
	var arr={};
        for (var i=0; i<=20; i++){
                arr[i.toString()]=0;
        }
	return arr;
}
var all_undef=initArray();

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


parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		var datatype = N3Util.getLiteralType(docobj);
		if ((datatype!="http://www.w3.org/2001/XMLSchema#string" && datatype!="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") || !isNLS(litvalue)){
			pendingRequests++;
			if (!N3Util.getLiteralLanguage(docobj)){ //Defined
				var wordlog_s = math.min(20, parseInt(math.log(litvalue.split(' ').length, 2), 10)).toString();
				all_undef[wordlog_s]++;
				pendingRequests--;
				if (pendingRequests==0 && processFinished) writeLog();
			}
		} else nums++;
	} else{
		processFinished=true;
		if (pendingRequests==0) writeLog();
	}
});

var writeLog = function(){
	var toPrint="";
	for (var i=0; i<=20; i++){
		toPrint += all_undef[i.toString()] + "\t";
	}
	toPrint += nums + "\n";
	fs.appendFile('all_untagged.csv', toPrint, function(err){
		if (err)
                	fs.appendFile("write_errors.log", "Error\n", function(err){});
	})
}


//cld.detect('', function(err, result) {
//  console.log(result);
//});
