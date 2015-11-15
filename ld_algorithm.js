var jsonfile = require('jsonfile');
var util = require('util');
var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();
var fs = require('fs');
var java = require('java');
java.classpath.push("langdetect-03-03-2014/lib/langdetect.jar");//Needs to be on the same path as of .js file
java.classpath.push("langdetect-03-03-2014/lib/jsonic-1.2.0.jar");
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


comp = 'ld_compatibility_' + docid + '.json';
var DetectorFactory = java.import('com.cybozu.labs.langdetect.DetectorFactory')
DetectorFactory.loadProfile("langdetect-03-03-2014/profiles.sm", function(err, rslt){
	jsonfile.readFile(comp, function (err, data) {
		if (!data)
	                data={"tagged":{}, "untagged": {}};
		parser.parse(stream, function(){
			if (arguments['1']) {
				var doc = arguments['1'];
				var docobj=doc["object"];
	                        var litvalue = N3Util.getLiteralValue(docobj);
				var datatype = N3Util.getLiteralType(docobj);
                        	if ((datatype=="http://www.w3.org/2001/XMLSchema#string" || datatype=="http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") && isNLS(litvalue)){
					pendingRequests++;
					if (N3Util.getLiteralLanguage(docobj)){ //Defined
                                                DetectorFactory.create(function(err, detector){
                                                        if (err) console.log(err);
                                                        detector.append(litvalue, function(err, o){
                                                                detector.detect(function(err, r){

									var newdoc={};

									var langtag=N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase();

									var wordlog = parseInt(math.log(N3Util.getLiteralValue(docobj).split(' ').length, 2), 10);

                                                                	if (!err && r) {
										var compatible = (r.substring(0,2).toLowerCase()==langtag);
										if (compatible){
											c="c";
										} else{
											c="i";
										}
										var wlogstr = wordlog.toString();
										 if (data["tagged"][langtag] && data["tagged"][langtag][wlogstr] && data["tagged"][langtag][wlogstr][c])
										{
											data["tagged"][langtag][wlogstr][c]++;
										} else{
											if (data["tagged"][langtag] && data["tagged"][langtag][wlogstr]){
												data["tagged"][langtag][wlogstr][c]=1;
											} else if (data["tagged"][langtag]){
												data["tagged"][langtag][wlogstr]={};
												data["tagged"][langtag][wlogstr][c]=1;
											} else{
												data["tagged"][langtag]={};
												data["tagged"][langtag][wlogstr]={};
												data["tagged"][langtag][wlogstr][c]=1;
											}
										}

									}
									pendingRequests--;
									if (streamFinished && pendingRequests == 0) {
										jsonfile.writeFile(comp, data, function (err) {
										})
									}
								});

							});
						});
					} else {
                                                DetectorFactory.create(function(err, detector){
                                                        if (err) console.log(err);
                                                        detector.append(litvalue, function(err, o){
                                                                detector.detect(function(err, r){
									var wordlog_s = math.min(20, parseInt(math.log(litvalue.split(' ').length, 2), 10)).toString();
									if (!err && r) {
										if (data["untagged"][wordlog_s])
											data["untagged"][wordlog_s]++;
										else
											data["untagged"][wordlog_s]=1;
									}

									pendingRequests--;
									if (streamFinished && pendingRequests == 0) {
										jsonfile.writeFile(comp, data, function (err) {
										})
									}  
								});
							});
						});
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
});
