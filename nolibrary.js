var jsonfile = require('jsonfile');
var util = require('util');
var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
docid=process.argv[2];
var def=0;
var undef=0;

var logToFiles = function() {
	fs.appendFile(comp, def.toString() + "\t" + undef.toString() + "\n", function (err){
	});
}

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

comp = 'nolib/' + docid + '.json';
parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue = N3Util.getLiteralValue(docobj);
		var datatype = N3Util.getLiteralType(docobj);
		if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
			if (N3Util.getLiteralLanguage(docobj)){ //Defined
				def++;
			} else {
				undef++;
			}
		} 
	} else {
		logToFiles();
	}
});
