var jsonfile = require('jsonfile');
var util = require('util');
var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var tika=require('tika');
var byline = require('byline');
var math=require('mathjs');
var stream = byline.createStream(process.stdin);
var docs=[];
var streamFinished = false;
var pendingRequests=0;
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

comp = 'tika_compatibility_' + docid + '.json';
jsonfile.readFile(comp, function (err, data) {
	if (!data)
		data={};
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var datatype = N3Util.getLiteralType(docobj);
                        if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(N3Util.getLiteralValue(docobj))){
				pendingRequests++;
                                if (N3Util.getLiteralLanguage(docobj)){ //Defined
					tika.language(N3Util.getLiteralValue(docobj), function(err, language, reasonablyCertain) {
						var newdoc={};

						var langtag=N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase();

						var wordlog = parseInt(math.log(N3Util.getLiteralValue(docobj).split(' ').length, 2), 10);
						if (!err && language){
							var compatible = (language==langtag);
							if (compatible){
								c="c";
							} else{
								c="i";
							}
							var wlogstr = wordlog.toString();
							if (data[langtag] && data[langtag][wlogstr] && data[langtag][wlogstr][c])
							{
								data[langtag][wlogstr][c]++;
							} else{
								if (data[langtag] && data[langtag][wlogstr]){
									data[langtag][wlogstr][c]=1;
								} else if (data[langtag]){
									data[langtag][wlogstr]={};
									data[langtag][wlogstr][c]=1;
								} else{
									data[langtag]={};
									data[langtag][wlogstr]={};
									data[langtag][wlogstr][c]=1;
								}
							}
							pendingRequests--;
                                                        if (streamFinished && pendingRequests == 0) {
                                				jsonfile.writeFile(comp, data, function (err) {
                                				})
							}
						}
					});
				} else {
					pendingRequests--;
					if (streamFinished && pendingRequests == 0) {
						jsonfile.writeFile(comp, data, function (err) {
						})
					}
				}
			} 
		} else {
			streamFinished=true;
			if (pendingRequests==0) {
				jsonfile.writeFile(comp, data, function (err) {
				})
			}
		}
	});
})
