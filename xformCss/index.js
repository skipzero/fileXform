#!/usr/bin/env node
/* global require, _ */


'use strict';
var fs				= require('fs')
	, _ 			= require('underscore')
	, chalk 		= require('chalk')
	, spawn 	 	= require('child_process').spawnSync

	// Define colours for ease of use...
	, red 			= chalk.red
	, blue 			= chalk.blue
	, grn 			= chalk.green
	, ylw 			= chalk.yellow
	, errRed 		= red.bold

	// Arguments passed in by user. if only one given, scale accordingly...
	, path			= process.argv[2]
	, mTop 			= process.argv[3]
	, mRight 		= process.argv[3]?process.argv[3]:mTop
	, mBottom 		= process.argv[4]?process.argv[4]:mTop
	, mLeft 		= process.argv[5]?process.argv[5]:mTop
	, mHeight 		= process.argv[6]?process.argv[6]:mTop
	, mWidth 		= process.argv[7]?process.argv[7]:mTop
	, mFontSize 	= process.argv[8]?process.argv[8]:mTop

	//unless specified, make the secondary optional. (line-height, letter-spacing, word-spacing, margin, & padding)
	, mLineHeight 	= process.argv[9]?process.argv[9]:1
	, mLetterSpace 	= process.argv[10]?process.argv[10]:1
	, mWordSpace 	= process.argv[11]?process.argv[11]:1
	, mMargin 		= process.argv[12]?process.argv[12]:1
	, mPadding		= process.argv[13]?process.argv[13]:1;

if (process.argv.length > 4 && process.argv.length < 9) {
	console.log(errRed('\nPlease rerun with only one argument to scale by that percentage or one for each of the following:'))
	console.log(errRed('top, right, bottom, left, height, width, and font-size\n'))
	return;
}

readCssFiles(path, mTop, mRight, mBottom, mLeft, mHeight, mWidth, mFontSize, mLineHeight, mLetterSpace, mWordSpace, mMargin, mPadding);

//  TODO: Check transforms are all in %, font-size, line-height, letter-spacing, word-spacing, margin, padding
function readCssFiles(path,mTop,mRight,mBottom,mLeft,mHeight,mWidth, mFontSize, mLineHeight, mLetterSpace, mWordSpace, mMargin, mPadding) {

	var readPath = path + '/OPS/styles/'
		, htmlPath 	= path + '/OPS/text/';

	if (process.argv.length < 3) {
		console.log(errRed('[ERROR]: Please rerun with a full path to the ePub.'));
		return;
	}

	if (process.argv.length < 4){
		console.log(errRed('[ERROR]: Please enter at least one multiplier'));
		return;
	};

	var newLine 	= ''
		, valTop 	= ''
		, valRight 	= ''
		, valBottom = ''
		, valLeft 	= '';

	//  Object containing all properties we're concerned with, for ease
	var css = {
		'transform' 		: /\btransform\b/gmi
		, 'top' 			: /^\s*\btop?\b:\s*[0-9]*.*$/gmi
		, 'right' 			: /^\s*\bright\b:\s*[0-9]*.*$/gmi
		, 'bottom' 			: /^\s*\bbottom?\b:\s*[0-9]*.*$/gmi
		, 'left' 			: /^\s*\bleft?\b:\s*[0-9]*.*$/gmi
		, 'height' 			: /^\s*\bheight?\b:\s*[0-9]*.*$/gmi
		, 'width' 			: /^\s*\bwidth\b:\s*[0-9]*.*$/gmi
		, 'fontSize' 		: /^\s*\bfont-size\b:\s*[0-9]*.*$/gmi
		, 'lineHeight' 		: /^\s*\bline-height\b:\s*[0-9]*.*$/gmi
		, 'letterSpacing' 	: /^\s*\bletter-spacing\b:\s*[0-9]*.*$/gmi
		, 'wordSpacing' 	: /^\s*\bword-spacing\b:\s*[0-9]*.*$/gmi
		, 'margin' 			: /^\s*\bmargin\b:\s*[0-9]*.*$/gmi
		, 'padding' 		: /^\s*\bpadding\b:\s*[0-9]*.*$/gmi
		, 'dec' 			: /(?:\d*\.)?\d+/gmi
		, 'per' 			: /%/g
		, 'inline' 			: /"width:*\s*[0-9]*px;\s*height:[0-9]*px;"/g
		, 'actionImg' 		: /\{\s*top:*\s*[0-9]*px;\s*left:\s*[0-9]*px;*\s\}/gmi
	}

	// fromEpub(path);

	//  Fix the HTML first
	fs.readdir (htmlPath, function(err, files){
		if (err) {
			console.log(errRed('[ERROR]:', err))
		} else {
			_.each(files, function(file){
				console.log(htmlPath + file);
				try {
					var data = fs.readFileSync(htmlPath + file, 'utf8');
				} catch (err) {
					console.log(errRed('[ERROR]:', err));
				}

				//  To Arr to iterate over...
				var temp = data.split('\n');

				temp = _.map(temp, function(line) {
					if (line.match(css.inline)){
						var inLine 			= line.match(css.inline).toString()
							, inLineVal 	= inLine.match(css.dec);

						inLine 				= inLine.replace(css.dec, (inLineVal[0] * mTop));
						line 				= line.replace(css.inline, inLine);

						console.log(blue.bold(line, '==', inLine, inLineVal, inLineVal[0] * mTop, '--------------------------->>'))
					}
					return line;
				})
				saveFile(htmlPath, file, temp);
			})
		}
	})

	fs.readdir (readPath, function(err, files) {

		if (err) {
			console.log(errRed('[ERROR]:', err));
			console.log(errRed(readPath, 'does not seem to be a valid path.'));

		} else {
			_.each(files, function(file) {
				console.log(readPath + file);

				findTemp(readPath, file); //  adding css to temp that's removed from HTML
				
				try {
					var data = fs.readFileSync(readPath + file, 'utf8');
				} catch (err) {
					console.log('Error reading file:', err);
				}

				var tmp = data.split('\n');

				tmp = _.map(tmp, function(line) {
					if (line.match(css.transform)) {  // making sure all transforms will scale naturally... checked manually
						// chalk.bgBlue(console.log('[TRANSFORM]:', line))
					}

					if (line.match(css.actionImg)) { 
						newLine = line.match(css.actionImg).toString();
						newLine = multiplier(newLine, mTop);
						line = line.replace(css.actionImg, newLine)
						console.log(line, '\n', newLine, '++++++++++++++++++++++++');
					} else

					//match our styles
					if (line.match(css.top)) {
						line = multiplier(line, mTop);

					} else if (line.match(css.right)) {
						line = multiplier(line, mRight);

					} else if (line.match(css.bottom)) {
						line =  multiplier(line, mBottom);

					} else if (line.match(css.left)) {
						line =  multiplier(line, mLeft);

					}  else if (line.match(css.height)) {
						line =  multiplier(line, mHeight);

					} else if (line.match(css.width)) {
						line =  multiplier(line, mWidth);

					} else if (line.match(css.fontSize)) {
						line =  multiplier(line, mFontSize);

					} 
					return line;
				})

				saveFile(readPath, file, tmp); //  save the changes

			})
		}
	});

	function findTemp (path, file) {  
		if (file === 'template.css'){

			//  Multiply by original value (25px);
			var hImg = 25 * mTop
			,	wImg = 25 * mTop
			,	imgDimensions = '.vsm-ngl-act-icon img,\n.vsm-ngl-audio-icon img {\n\twidth:'+ wImg + 'px;\n\theight:'+ hImg +'px;\n}\n'

			fs.appendFile(path + file, imgDimensions, function(err) {
				if (err) {
					console.log(errRed('[ERROR]:', err));
				}
			})
		}
	}

	function getFile(path) {
		fileName = path.replace(/^.*[\\\/]/, '');
		console.log(chalk.bgYellow.bold(fileName))
	    return fileName;
	}

	function multiplier(line, mult) { 
		//  If the line contains a %, it should automatically scale... (do nothing)
		if (line.match(css.per)){
			return line;		
		} else {
			line = getVal(line, mult);
			return line;
		}
	}

	function getVal(line, mult) {


		//find the value of the style...
		var lnVal = line.match(css.dec);
		if (lnVal != null && lnVal.length === 2  ) {
			for (var val in lnVal) {
				return val;
			}

			console.log(lnVal, '&&', val, '==========================================???'); return;
		}
		var newVal 	= (lnVal * mult).toFixed(2).replace(/\.0+$/,'') //  Only to the hundredth, remove zeros...
			, newLine 	= line.replace(css.dec, newVal); //  Swap values
		return newLine;
	}

	function saveFile(path, file, tmp) {

		//  Turn the Arr back to a string for saving...
		tmp = tmp.join('\n')

		//  Save file to original...
		console.log('Saving file....', file)
		fs.writeFileSync(path + file, tmp);
	}

	function fromEpub(path) {
		//spawn('zip', ['-rx', '*.DS_Store', path+'book.zip', path]);  //  the zipping...
		spawn('unzip', ['-d', path, path]);
	}
}





