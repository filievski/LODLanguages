var N3 = require('n3');
var N3Util = N3.Util;
var parser = N3.Parser();

var fs = require('fs');
var byline = require('byline');
var stream = byline.createStream(process.stdin);
//var cld=require('cld');
//var tika=require('tika');
var request = require('request');

var regex = /^[-\.,0-9]*$/;
var nums=0;
var def=0, undef=0;
var undef_solved=0, undef_unsolved=0, def_unsolved=0, def_solved_good=0, def_solved_bad=0;
docid=process.argv[2];
parser.parse(stream, function(){
        if (arguments['1']) {
                var doc = arguments['1'];
		var docobj=doc["object"];
		var litvalue=N3Util.getLiteralValue(docobj);
		if (litvalue.match(regex))
			nums++;
		else { 
			if (N3Util.getLiteralLanguage(docobj)){ //Defined
                                request({url: 'http://localhost:9200/_langdetect', method: 'POST', form: {data: N3Util.getLiteralValue(docobj), profile: '/langdetect/short-text/'}}, function(err, response, body) {
					def++;
					var bodyjson = JSON.parse(body);
					if (err || !bodyjson["languages"] || !bodyjson["languages"][0] || !bodyjson["languages"][0]["language"])
						def_unsolved++;
					else{
						if (bodyjson["languages"][0]["language"]==N3Util.getLiteralLanguage(docobj).substring(0,2).toLowerCase())
							def_solved_good++;
						else
							def_solved_bad++;
					}
				});
			} else {
				request({url: 'http://localhost:9200/_langdetect', method: 'POST', form: {data: N3Util.getLiteralValue(docobj), profile: '/langdetect/short-text/'}}, function(err, response, body) {
					undef++;
				        var bodyjson = JSON.parse(body);
					if (!err && bodyjson["languages"] && bodyjson["languages"][0] && bodyjson["languages"][0]["language"]){
						undef_solved++;
					} else {
						undef_unsolved++;
					}
				});
			}
		}
	} else{
		fs.appendFile('es_lang_logs.txt', def.toString() + "\t" + def_solved_good.toString() + "\t" + def_solved_bad.toString() + "\t" + def_unsolved.toString() + "\t" + undef.toString() + "\t" + undef_solved.toString() + "\t" + undef_unsolved.toString() + "\n", function (err){
		});
	//	console.log("End of file: Solved, unsolved, defined...");
	//	console.log(solved);
	//	console.log(unsolved);
	//	console.log(defined);
	}
});

console.log(docid);

//cld.detect('', function(err, result) {
//  console.log(result);
//});
