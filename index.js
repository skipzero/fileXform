/* global require, _ */
'use strict';
var fs			= require('fs')
	, _ 		= require('underscore')
	, chalk 	= require('chalk')
	, path		= __dirname + '/../../Desktop/NGL_ELT-GREX1/OPS/styles/'
	, red 		= chalk.red
	, blue 		= chalk.blue
	, grn 		= chalk.green
	, ylw 		= chalk.yellow;

	//  TODO: Check transforms are all in %, font-size, line-height, letter-spacing, word-spacing, margin, padding

				console.log(chalk.magenta(process.argv))

readCssFiles(process.argv[2]);

function readCssFiles(times) {

	//  Object containing all properties we're concerned with
	var css = {
		'top' 		: /\btop?\b:\s*[0-9]*.*/gmi,
		'right' 	: /\bright?\b:\s*[0-9]*.*/gmi,
		'bottom' 	: /\bbottom\b:\s*[0-9]*.*/gmi,
		'left' 		: /\bleft?\b:\s*[0-9]*.*/gmi,
		'height' 	: /\bheight\b:\s*[0-9]*.*/gmi,
		'width' 	: /\bwidth\b:\s*[0-9]*.*/gmi,
		'dec' 		: /(?:\d*\.)?\d+/gmi,
		'per' 		: /%/gm
	}

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

				if ( data.match(css.top) || data.match(css.right) || data.match(css.bottom) ||data.match(css.left) ) {

					var tmp = data;
					//console.log(chalk.bgBlue(data))

					if (tmp.match(css.top)) {
					tmp = tmp.split('\n')
					console.log(tmp)
						var showTop 	= data.match(css.top);
						if (data.match(css.per)) {
							console.log(chalk.bgGreen('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
						}
						console.log(grn('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', showTop));

					}

					if (data.match(css.right)) {
						var showRt = data.match(css.right);
						if (data.match(css.per)) {
							console.log(chalk.bgRed('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
						}
						console.log(red('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', showRt));

					} 

					if (data.match(css.bottom)) {
						var showBtm = data.match(css.bottom);
						if (data.match(css.per)) {
							console.log(chalk.bgYellow('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
						}
						console.log(ylw('++++++++++++++++++++++++++++++++++++++++++++++++++', showBtm));

					} 

					if (data.match(css.left)) {
						var showLeft 	= data.match(css.left);

						if (data.match(css.per)) {
							console.log(chalk.bgBlue('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
						}

						console.log(blue('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', data.match(css.left)))
						_.each(showLeft, function(showLeft) {
							var ltNum = showLeft.match(css.dec);
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