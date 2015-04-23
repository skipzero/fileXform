/* global require, _ */
'use strict';
var fs			= require('fs')
	, _ 		= require('underscore')
	, chalk 	= require('chalk')
	, path		= __dirname + '/../../Desktop/NGL_ELT-GREX1/OPS/skip/'
	, left 		= /\bleft?\b:\s*[0-9]*.*/gmi
	, right 	= /\bright?\b:/gmi
	, top 		= /\btop?\b:/gmi
	, bottom 	= /\bbottom\b:/gmi
	, height 	= /\bheight\b:/gmi
	, float 	= /\bfloat\b:/gmi
	, dec 		= /(?:\d*\.)?\d+/g;

readCssFiles(process.argv[2]);

function readCssFiles(times) {
console.log(process.argv)
	fs.readdir (path, function(err, files) {
		if (err) {
			console.log('Error reading dir:', err);
		} else {
			_.each(files, function(file) {
				console.log(path + file);
				try {
					var data = fs.readFileSync(path + file, 'utf8');
				} catch (err) {
					console.log('Error reading file:', err);
				}

				if (data.match(left)) {
					var showLeft 	= data.match(left);
					console.log('===>=================================================================================================================')
					console.log(data.match(left))
					// _.each(showLeft, function(showLeft) {
					// 	var ltNum = showLeft.match(dec);
					// 	ltNum = Number.parseFloat((ltNum * times).toFixed(2));
					// 	showLeft = 'left:' + ltNum + 'px;';
					// 	console.log(showLeft)
					// 	//fs.writeFileSync(path + file, data);
					// })
					// console.log(showLeft)
				}
			})
		}
	});
}