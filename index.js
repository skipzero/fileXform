#!/usr/bin/env node
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
	, args 		= process.argv

	// Arguments passed in by user...
	, mTop 		= process.argv[2]
	, mRight 	= process.argv[3]?process.argv[3]:mTop
	, mBottom 	= process.argv[4]?process.argv[4]:mTop
	, mLeft 	= process.argv[5]?process.argv[5]:mTop;

if (process.argv.length > 3 && process.argv.length < 12) {
	console.log(chalk.red.bold('\nPlease rerun with only one argument or one for each of the following:'))
	console.log(chalk.red.bold('top, right, bottom, left, height, width, font-size, line-height, letter-spacing, word-spacing, margin, padding\n'))
	return;
}

readCssFiles(mTop, mRight, mBottom, mLeft);

	//  TODO: Check transforms are all in %, font-size, line-height, letter-spacing, word-spacing, margin, padding
function readCssFiles(mTop,mRight,mBottom,mLeft) {

	var valTop 		= ''
		, valRight 	= ''
		, valBottom = ''
		, valLeft 	= '';

	console.log(process.argv);

	//  Object containing all properties we're concerned with
	var css = {
		'top' 				: /\btop?\b:\s*[0-9]*.*/gmi
		, 'right' 			: /\bright\b:\s[0-9]*.*/gmi
		, 'bottom' 			: /\bbottom?\b:\s*[0-9]*.*/gmi
		, 'left' 			: /\bleft?\b:\s*[0-9]*.*/gmi
		, 'height' 			: /\bheight?\b:\s*[0-9]*.*/gmi
		, 'width' 			: /\bwidth\b:\s*[0-9]*.*/gmi
		, 'fontSize' 		: /\bfont-size\b:\s*[0-9]*.*/gmi
		, 'lineHeight' 		: /\bline-height\b:\s*[0-9]*.*/gmi
		, 'letterSpacing' 	: /\bletter-spacing\b:\s*[0-9]*.*/gmi
		, 'wordSpacing' 	: /\bword-spacing\b:\s*[0-9]*.*/gmi
		, 'margin' 			: /\bmargin\b:\s*[0-9]*.*/gmi
		, 'dec' 			: /(?:\d*\.)?\d+/gmi
		, 'per' 			: /%/gm
		, 'px' 				: /px/gm
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

				var tmp = data.split('\n');

				console.log(chalk.bgGreen.bold(tmp))

				_.map(tmp, function(line) {	
					if (line.match(css.top)) {
						multiplier(line, mTop);
					}

					if (line.match(css.right)) {
						multiplier(line, mRight);
					}

					if (line.match(css.bottom)) {
						multiplier(line, mBottom);
					}

					if (line.match(css.left)) {
						multiplier(line, mLeft);
					}
				})

				function multiplier(line, mult) {
					if (line.match(css.per)){
						return line;
					
					} else {
						var lnVal = line.match(css.dec)
							, newVal = lnVal * mult
							, newLine = line.replace(css.dec, newVal);

						console.log(chalk.inverse(line, '\n', newLine) )
						return newLine;
					}
				}

				function saveFile(tmp) {
					tmp.join()
				}

				console.log(chalk.bgRed.bold(tmp))
				
// 						console.log(blue('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', data.match(css.left)))
// 						_.each(showLeft, function(showLeft) {
// 							var ltNum = showLeft.match(css.dec);
// 							//ltNum = Number.parseFloat((ltNum * times).toFixed(2));
// 							showLeft = 'left:' + ltNum + 'px;';
// 							//console.log(chalk.bgCyan(ltNum, showLeft))
// 							//fs.writeFileSync(path + file, data);
// 						})
// 					} 
// 				}
			})
		}
	});
}