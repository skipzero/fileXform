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
	, mRight 	= process.argv[3]
	, mBottom 	= process.argv[4]
	, mLeft 	= process.argv[5]

	, valTop 	= ''
	, valRight 	= ''
	, valBottom = ''
	, valLeft 	= '';


readCssFiles(mTop, mRight, mBottom, mLeft);
	//  TODO: Check transforms are all in %, font-size, line-height, letter-spacing, word-spacing, margin, padding
function readCssFiles(mTop,mRight,mBottom,mLeft) {

	console.log(process.argv)

	//  Object containing all properties we're concerned with
	var css = {
		'top' 				: /\bt?\b:\s*[0-9]*.*/gmi
		, 'bottom' 			: /\bbottom\b:\s*[0-9]*.*/gmi
		, 'left' 			: /\bleft?\b:\s*[0-9]*.*/gmi
		, 'height' 			: /\bheight\b:\s*[0-9]*.*/gmi
		, 'width' 			: /\bwidth\b:\s*[0-9]*.*/gmi
		, 'fontSize' 		: /\bfont-size\b:\s*[0-9]*.*/gmi
		, 'lineHeight' 		: /\bline-height\b:\s*[0-9]*.*/gmi
		, 'letterSpacing' 	: /\bletter-spacing\b:\s*[0-9]*.*/gmi
		, 'wordSpacing' 	: /\bword-spacing\b:\s*[0-9]*.*/gmi
		, 'margin' 			: /\bmargin\b:\s*[0-9]*.*/gmi
		, 'dec' 			: /(?:\d*\.)?\d+/gmi
		, 'per' 			: /%/gm
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


				var tmp = data;

				tmp = tmp.split('\n');

//				console.log(tmp)
				_.each(tmp, function(line) {
					if (line.match(css.top)) {
						valTop = line.match(css.dec);
						console.log(chalk.bgRed(valTop), valTop * mTop);
						return;
					}

					if (line.match(css.right)) {
						valRight = line.match(css.dec);
						console.log(chalk.bgGreen(valRight));
					}

					if (line.match(css.bottom)) {
						valBottom = line.match(css.dec);
						console.log(chalk.bgBlue(valBottom));
					}

					if (line.match(css.left)) {
						valLeft = line.match(css.dec);
						console.log(chalk.bgYellow(valLeft));
					}
				})
// 				if ( data.match(css.top) || data.match(css.right) || data.match(css.bottom) ||data.match(css.left) ) {
// 					if (data.match(css.letterSpacing)) {
// 						console.log(data.match(css.letterSpacing))
// 					}
// 					var tmp = data;
// 					//console.log(chalk.bgBlue(data))

// 					if (tmp.match(css.top)) {
// 					tmp = tmp.split('\n')
// 						var showTop 	= data.match(css.top);

// //						console.log(tmp)
// 						if (data.match(css.per)) {
// 							console.log(chalk.bgGreen('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
// 						}
// 						console.log(grn('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', showTop));

// 					}

// 					if (data.match(css.right)) {
// 						var showRt = data.match(css.right);
// 						if (data.match(css.per)) {
// 							console.log(chalk.bgRed('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
// 						}
// 						console.log(red('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', showRt));

// 					} 

// 					if (data.match(css.bottom)) {
// 						var showBtm = data.match(css.bottom);
// 						if (data.match(css.per)) {
// 							console.log(chalk.bgYellow('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
// 						}
// 						console.log(ylw('++++++++++++++++++++++++++++++++++++++++++++++++++', showBtm));

// 					} 

// 					if (data.match(css.left)) {
// 						var showLeft 	= data.match(css.left);

// 						if (data.match(css.per)) {
// 							console.log(chalk.bgBlue('BANGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH'))
// 						}

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