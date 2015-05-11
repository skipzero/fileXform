#!/usr/bin/env node
/* global require, _ */


'use strict';
var fs				= require('fs')
	, _ 			= require('underscore')
	, chalk 		= require('chalk')
	, spawn 	 	= require('child_process').spawnSync

	// Define colours for ease of use...
	, okGrn 		= chalk.green.bold
	, errRed 		= chalk.red.bold

	// Arguments passed in by user. if only one given, scale accordingly...
	, path			= process.argv[2]
	, mTop 			= process.argv[3]  //  First two are required...
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
	, mTopPadding 	= process.argv[12]?process.argv[12]:1
	, mRightPadding = process.argv[13]?process.argv[13]:1
	, mBtmPadding 	= process.argv[14]?process.argv[14]:1
	, mLeftPadding 	= process.argv[15]?process.argv[15]:1
	, mTopMargin 	= process.argv[16]?process.argv[16]:1
	, mRightMargin 	= process.argv[17]?process.argv[17]:1
	, mBtmMargin 	= process.argv[18]?process.argv[18]:1
	, mLeftMargin 	= process.argv[19]?process.argv[19]:mTop;

if (process.argv.length > 4 && process.argv.length < 9) {
	throwError('\nPlease rerun with only one argument to scale by that percentage or one for each of the following:');
	throwError('top, right, bottom, left, height, width, font-size, padding\n');
	throwError('\n You can enter separate properties for the following, in this order:');
	throwError('top, right, bottom, left, height, width, font-size, line-height, letter-spacing, word-spacing, padding-top, padding-right, padding-bottom, padding-left, margin-top\n');
	throwError('margin-right, margin-bottom, margin-left\n');
	return;
}

readCssFiles(path, mTop, mRight, mBottom, mLeft, mHeight, mWidth, mFontSize, mLineHeight, mLetterSpace, mWordSpace, mTopPadding, mRightPadding, mBtmPadding, mLeftPadding, mTopMargin, mRightMargin, mBtmMargin);

//  TODO: line-height, letter-spacing, word-spacing, margin, 
function readCssFiles(path,mTop,mRight,mBottom,mLeft,mHeight,mWidth, mFontSize, mLineHeight, mLetterSpace, mWordSpace, mTopPadding, mRightPadding, mBtmPadding, mLeftPadding, mTopMargin, mRightMargin, mBtmMargin) {

	var readPath = path + '/OPS/styles/'
		, htmlPath 	= path + '/OPS/text/'
		, newLine 	= ''
		, valTop 	= ''
		, valRight 	= ''
		, valBottom = ''
		, valLeft 	= '';

	if (process.argv.length < 3) {
		throwError('Please rerun with a full path to the ePub.');
		return;
	}

	if (process.argv.length < 4){
		throwError('Please enter at least one multiplier');
		return;
	};

	//  Object containing all properties we're concerned with, for ease
	var prop = {
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
		, 'margin' 			: /\bmargin\b/gi
		, 'padding' 		: /\bpadding\b/gi
		, 'dLeft'		 	: /left/gi
		, 'dTop'			: /top/gi
		, 'dRight'			: /right/gi
		, 'dBottom'			: /bottom/gi
		, 'dec' 			: /(?:\d*\.)?\d+/g
		, 'px'				: /px/gi
		, 'per' 			: /%/g
		, 'bang'			: /!/g
		, 'inline' 			: /"width:*\s*[0-9]*px;\s*height:[0-9]*px;"/g
		, 'actionImg' 		: /\{\s*top:*\s*[0-9]*px;\s*left:\s*[0-9]*px;*\s\}/gmi
		, 'com' 			: /,+/g
	}

	// fromEpub(path);  //  TODO: Unzip the ePub...

	//  This fixes the HTML
	fs.readdir (htmlPath, function(err, files){
		if (err) {
			throwError(err);
		} else {
			_.each(files, function(file){
				console.log(htmlPath + file);
				try {
					var data = fs.readFileSync(htmlPath + file, 'utf8');
				} catch (err) {
					throwError(err);
				}

				//  To Arr to iterate over...
				var temp = data.split('\n');

				temp = _.map(temp, function(line) {
					if (line.match(prop.inline)){
						var inLine 			= line.match(prop.inline).toString()
							, inLineVal 	= inLine.match(prop.dec);

						inLine 				= inLine.replace(prop.dec, (inLineVal[0] * mTop));
						line 				= line.replace(prop.inline, inLine);
					}
					return line;
				})
				saveFile(htmlPath, file, temp);
			})
		}
	})

	fs.readdir (readPath, function(err, files) {  //  This takes care of the prop...

		if (err) {
			throwError(err);
			
		} else {
			_.each(files, function(file) {
				console.log(readPath + file);
				
				try {
					var data = fs.readFileSync(readPath + file, 'utf8');
				} catch (err) {
					throwError(err);
				}

				var tmp = data.split('\n');

				tmp = _.map(tmp, function(line) {
					if (line.match(prop.transform)) {  // making sure all transforms will scale naturally... checked manually
						// chalk.bgBlue(console.log('[TRANSFORM]:', line))
					}

					if (line.match(prop.actionImg)) { 
						line = actionImages(line, mTop);
						return line;
					}

					//match our styles
					 if (line.match(prop.padding)) {   //  Use multi val stepper to handle margin and padding
						line = multiVal(line, mTopPadding, mRightPadding, mBtmPadding, mLeftPadding);

					} else if (line.match(prop.margin)) {
					 	console.log('margin:', line )
						line = multiVal(line, mTopMargin, mRightMargin, mBtmMargin, mLeftMargin);

					} else if (line.match(prop.top)) {
						line = multiplier(line, mTop);

					} else if (line.match(prop.right)) {
						line = multiplier(line, mRight);

					} else if (line.match(prop.bottom)) {
						line =  multiplier(line, mBottom);

					} else if (line.match(prop.left)) {
						line =  multiplier(line, mLeft);

					}  else if (line.match(prop.height)) {
						line =  multiplier(line, mHeight);

					} else if (line.match(prop.width)) {
						line =  multiplier(line, mWidth);

					} else if (line.match(prop.fontSize)) {
						line =  multiplier(line, mFontSize);

					}

					return line;
				})

				saveFile(readPath, file, tmp); //  save the changes

			})
		}
	});

	//Function for the two values  on one line...
	function actionImages(line, mult) {

		var newLine = line.match(prop.actionImg);
		newLine = newLine.toString();
		newLine = newLine.split(';');

		for (var i = 0; i < newLine.length; i++) {
		
			if (newLine[i] != ' }') {
				var val = newLine[i].match(prop.dec);
				val = val * mult;
				val = val.toFixed(2).replace(/\.0+$/,'') //  Only to the hundredth, remove zeros...
				newLine[i] = newLine[i].replace(prop.dec, val)
				ret(newLine[i]);
			}
		
			newLine = newLine.join()
			line = line.replace(prop.actionImg, newLine);
			line = line.replace(prop.com, ';');
			return line;
		}
	}

	function multiVal(line, mTopVal, mRightVal, mBtmVal, mLeftVal) {  //  Give it the line and the m* var to multiply values.

		//  handles margins and paddings...
		if (line.match(prop.dTop)){
			line = multiplier(line, mTopVal);

		} else if (line.match(prop.dRight)) {
			line = multiplier(line, mRightVal);

		} else if (line.match(prop.dBottom)) {
			line = multiplier(line, mBtmVal);

		} else if (line.match(prop.dLeft)) {
			console.log('MARGIN-LEFT:', line)
			line = multiplier(line, mLeftVal);
			console.log('NEW MARGIN-LEFT:', line)

		} else {
			newLine = line.split(':')
			var currVal = newLine[1].split(' ');
			for(var i = 0; i <= currVal.length; i++) {
				var newVal = currVal;
				if (newVal[i] !== '') {
					if (newVal[i] === undefined || newVal[i].match(prop.per) || newVal[i].match(prop.bang) || !newVal[i].match(prop.px)) {
						return newVal[i];
					
					} else {
						newVal[i] = getVal(newVal[i], mTopVal);

					} 
					ret(newVal[i]);
				}
			}
		}
		// line =  multiplier(line, paddingLeft);
		return line;
	}

	//  Return function for loops...
	function ret(newLine){
		return newLine;
	}

	function getFile(path) {
		fileName = path.replace(/^.*[\\\/]/, '');
	    return fileName;
	}

	function multiplier(line, mult) { 
		//  If the line contains a %, it should automatically scale... (do nothing)
		if (line.match(prop.per)){
			return line;		
		} else {
			line = getVal(line, mult);
			return line;
		}
	}

	function getVal(line, mult) {
		console.log(line)
		var lnVal 		= line.match(prop.dec)
			, newVal 	= (lnVal * mult).toFixed(2).replace(/\.0+$/,'') //  Only to the hundredth, remove zeros...
			, newLine 	= line.replace(prop.dec, newVal); //  Swap values
		return newLine;
	}

	function saveFile(path, file, tmp) {

		//  Turn the Arr back to a string for saving...
		tmp = tmp.join('\n')

		//  Save file to original...
		console.log(okGrn('[SUCCESS] Saving file....', file));
		fs.writeFileSync(path + file, tmp);
	}

	function throwError(err){
		console.log(errRed('[ERROR]:', err));
	}
}
