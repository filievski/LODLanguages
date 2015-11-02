#!/usr/bin/env node

var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var byline = require('byline');
var cld=require('cld');
var url=require('url');
var stream = byline.createStream(process.stdin);
var docs=[];

var c=0;
var s=0;
var nums=0;

var regex = /^[-\.,0-9]*$/;


var logIncompatible = function(s, alt, ult){
	fs.appendFile('incompatible.txt', s + '\t' + alt + '\t' + ult + '\n', function(err){
	});
}


docid=process.argv[2];

parser.parse(stream, function(){
	if (arguments['1']) {
		var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		if (litvalue.match(regex))
			nums++;	
		else {
			if (N3Util.getLiteralLanguage(docobj)){
				cld.detect(N3Util.getLiteralValue(docobj), function(err, result) {
					if (result && result["languages"]["0"] && result["languages"]["0"]["code"] && result["languages"][0]["code"]!=N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase()){
						logIncompatible(N3Util.getLiteralValue(docobj), result["languages"][0]["code"], N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase());
					} 				
				});
			}
		}
	} 
});
