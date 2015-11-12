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
var regex = /^[-\.,0-9]*$/;
var nums=0;
var pendingRequests=0;
var allLines=0;
docid=process.argv[2];

comp = 'tika_compatibility_' + docid + '.json';
jsonfile.readFile(comp, function (err, data) {
	if (!data)
		data={};
	parser.parse(stream, function(){
		if (arguments['1']) {
			var doc = arguments['1'];
			var docobj=doc["object"];
			var datatype = N3Util.getLiteralType(docobj);
			allLines++;
                        if (!N3Util.getLiteralValue(docobj).match(regex)){
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
