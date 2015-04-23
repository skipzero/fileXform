/* global require, _ */
'use strict';
var fs			= require('fs')
	, _ 		= require('underscore')
	, chalk 	= require('chalk')
	, path		= __dirname + '/../../Desktop/NGL_ELT-GREX1/OPS/skip/'
	, red 		= chalk.red
	, blue 		= chalk.blue
	, grn 		= chalk.green
	, ylw 		= chalk.yellow
	, left 		= /\bleft?\b:\s*[0-9]*.*/gmi
	, right 	= /\bright?\b:\s*[0-9]*.*/gmi
	, top 		= /\btop?\b:\s*[0-9]*.*/gmi
	, bottom 	= /\bbottom\b:\s*[0-9]*.*/gmi
	, height 	= /\bheight\b:\s*[0-9]*.*/gmi
	, float 	= /\bfloat\b:\s*[0-9]*.*/gmi
	, dec 		= /(?:\d*\.)?\d+/gmi;

readCssFiles(process.argv[2]);

function readCssFiles(times) {
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

				if ( data.match(top) || data.match(right) || data.match(bottom) ||data.match(left) ) {

					//console.log(chalk.bgBlue(data))

					if (data.match(top)) {
						var showTop 	= data.match(top);
						console.log(grn('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', showTop));

					}

					if (data.match(right)) {
						var showRt = data.match(right);
						console.log(red('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', showRt));

					} 

					if (data.match(bottom)) {
						var showBtm = data.match(bottom) 
						console.log(ylw('++++++++++++++++++++++++++++++++++++++++++++++++++', showBtm));

					} 

					if (data.match(left)) {
						var showLeft 	= data.match(left);

						console.log(blue('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', data.match(left)))
						_.each(showLeft, function(showLeft) {
							var ltNum = showLeft.match(dec);
							//ltNum = Number.parseFloat((ltNum * times).toFixed(2));
							showLeft = 'left:' + ltNum + 'px;';
							//console.log(chalk.bgCyan(ltNum, showLeft))
							//fs.writeFileSync(path + file, data);
						})
					} 
				}
			})
		}
	});
}