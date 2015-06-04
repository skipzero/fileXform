#!/usr/bin/env node
/* global require, _ */

'use strict';

var fs				= require('fs')
	, _ 			= require('underscore')
	, chalk 		= require('chalk')
	, css 			= require('cssom')
	, cheer 		= require('cheerio')
	, proArg 		= process.argv

	// Define colours for ease of use...
	, okGrn 		= chalk.green.bold
	, errRed 		= chalk.red.bold;

	// Object of arguments passed in by user. if only one given, scale accordingly...

var argMult = {
	path			: proArg[2]
	, mTop 			: proArg[3]  //  First two are required...
	, mRight 		: proArg[4]
	, mBottom 		: proArg[5]
	, mLeft 		: proArg[6]
	, mHeight 		: proArg[7]
	, mWidth 		: proArg[8]
	, mFontSize 	: proArg[9]

	//unless specified, make the secondary optional. (line-height, letter-spacing, word-spacing, margin, & padding)
	, mLineHeight 		: proArg[10]
	, mLetterSpacing	: proArg[11]
	, mWordSpacing 		: proArg[12]
	, mPaddingTop 		: proArg[13]
	, mPaddingRight 	: proArg[14]
	, mPaddingBottom 	: proArg[15]
	, mPaddingLeft 		: proArg[16]
	, mMarginTop 		: proArg[17]
	, mMarginRight 		: proArg[18]
	, mMarginBottom 	: proArg[19]
	, mMarginLeft 		: proArg[20]
}


	console.log(argMult.mLeft)

readCssFiles(argMult.path, argMult.mTop, argMult.mRight, argMult.mBottom, argMult.mLeft, argMult.mHeight, argMult.mWidth, argMult.mFontSize, argMult.mLineHeight, 
	argMult.mLetterSpacing, argMult.mWordSpacing, argMult.mPaddingTop, argMult.mPaddingRight, argMult.mPaddingBottom, argMult.mPaddingLeft, argMult.mMarginTop, argMult.mMarginRight, 
	argMult.mMarginBottom, argMult.mMarginLeft);

function readCssFiles(path,mTop,mRight,mBottom,mLeft,mHeight,mWidth, mFontSize, mLineHeight, mLetterSpacing, mWordSpacing, mPaddingTop, 
	mPaddingRight, mPaddingBottom, mPaddingLeft, mMarginTop, mMarginRight, mMarginBottom) {

	var readPath = path + '/OPS/styles/'
		, htmlPath 	= path + '/OPS/text/'
		, newLine 	= '';
console.log('begin')
	if (proArg.length < 3) {
		throwError('Please rerun with a full path to the ePub.');
		return;
	}

	if (proArg.length < 4){
		throwError('Please enter at least one multiplier');
		return;
	}

	if (proArg.length > 4 && proArg.length < 9) {
		throwError('\nPlease rerun with only one argument to scale by that percentage or one for each of the following:');
		throwError('top, right, bottom, left, height, width, font-size, padding\n');
		// throwError('\n You can enter separate properties for the following, in this order:');
		// throwError('top, right, bottom, left, height, width, font-size, line-height, letter-spacing, word-spacing, padding-top, 
		// padding-right, padding-bottom, padding-left, margin-top\n');
		// throwError('margin-right, margin-bottom, margin-left\n');
		return
	}
console.log(argMult)
	for (var argProp in argMult) {
		console.log(argProp, argMult[argProp], '+++++++++++++++++++++++++++++++++++++!!')
		if (argMult[argProp] === undefined) {
			argMult[argProp] = argMult.mTop;
			console.log(argMult[argProp], argProp,'!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
		}
	}
console.log(argMult)
	//  Object containing all properties we're concerned with, for ease
	var cssProp = {
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

	//  This fixes the HTML
	fs.readdir (htmlPath, function(err, files){
		if (err) {
			throwError(err);
		} else {
			_.each(files, function(file){
				
				fs.readFile(htmlPath + file, 'utf8', function(err, data){
					if (err) {
						throwError(err);
					}
					console.log(okGrn(htmlPath + file));

					//  To Arr to iterate over...
					var $ = cheer.load(data)
						, temp;
					
					if ($('a.vsm-ngl-act-icon')) {
						temp = $('a.vsm-ngl-act-icon').children();
					} else if ($('a.vsm-ngl-audio-icon')) {
						temp = $('a.vsm-ngl-audio-icon').children();
					} 

					for (var html in temp){  //  temp: {html: {ln}}

						if (temp[html].hasOwnProperty('attribs') && temp[html].attribs.style) {
					
							//returns HTML inline width and height
							var htmlVal = temp[html].attribs.style;
							htmlVal = getVal(htmlVal, mTop);
							temp[html].attribs.style = htmlVal;
console.log(temp[html])
						}
						// return temp
					}
				});
				// saveFile(htmlPath, file, $.html());
			})
		}
	})

	fs.readdir (readPath, function(err, files) {  //  This takes care of the css prop...

		if (err) {
			throwError(err);
			
		} else {

			_.each(files, function(file) {
				fs.readFile(readPath + file, 'utf8', function(err, data){
					if(err) {
						throwError(err);
					}

					var cssObj 				= css.parse(data)
						, skipSelectors 	= ['#controls', '#controls a.button' ]  //  Skip these selectors...
						
						//  All the properties we're concerned with. we'll iterate over these to find our values...
						, propertiesArray 	= [
						'top','right','bottom','left','height','width',
						'font-size','margin-top', 'margin-right',
						'margin-bottom','margin-left', 'padding-top',
						'padding-right','padding-bottom', 'padding-left',
						'line-height', 'letter-spacing', 'word-spacing'];

					cssObj = cssObj.cssRules;

					console.log(okGrn(htmlPath + file));

					_.each(cssObj, function(prop) {
	var styleObj = makeObj(prop),
		foo 	 = getMult(styleObj, propertiesArray)

						ret(prop)
					})
				})
			})
			// saveFile(readPath, file, tmp); //  save the changes
		}
	});

	//  create our own obj...
	function makeObj(prop) {

		var styleObj = {}
		if (!prop.style) {  //  filter out objs wo styles
			console.log(chalk.red('[ERROR] :'), prop)
		} else { 
			styleObj.selector 		= prop.selectorText
			, styleObj.style 		= prop.style
			, styleObj.length 		= prop.style.length;
		}
		return styleObj;
	}

	function getMult (styleObj, propertiesArray) {

		var  styles = styleObj.style
			, mult;
		_.each(propertiesArray, function(arrProp) {
			_.each(styles, function(styleProp) {
				if (arrProp === styleProp) {
					mult = 'm' + arrProp.replace(/^[a-z]/, function(m){ //Gets first word
						return m.toUpperCase() 
					})

					if (mult.match('-')) { //Looks for hyphen to remove, and caps 2nd word is theres one

						mult = mult.replace(/-[a-z]/, function(m) {
							return m.toUpperCase()
						}).replace('-', '')
					}
					filterButtons(styleObj, mult)
				}
			})
		})
	}

	function getFile(path) {
		fileName = path.replace(/^.*[\\\/]/, '');
	    return fileName;
	}

	function filterButtons(styleObj, mult) {
		var buttonSel 		= styleObj.selector
			, buttonStyle 	= styleObj.style;

		if (buttonSel !== undefined){

			if (buttonSel.match('GrEx')) {

				for (var i = 0; i < buttonStyle.length; i++) { 
					var buttonStyleAttr = buttonStyle[i],
						returnedVal 	= getVal(buttonStyle[buttonStyleAttr], mult, 0)
	console.log(returnedVal,'>>>===>>>===')

				}
				console.log(buttonStyle, mult); 
			}

			console.log(buttonSel, '+++++++')
		}
	}

	function multiplier(line, mult) { 
		//  If the line contains a %, it should automatically scale... (do nothing)
		if (line.match(cssProp.per)){
			return line;		
		} else {
			line = getVal(line, mult);
			return line;
		}
	}

	function getVal(line, mult, offset) {
console.log(mult)
		var lnVal 		= line.match(cssProp.dec)
			, offset 	= offset ? offest : 0;

console.log(argMult[mult],'++++++++++++++++++++++++++++++++++++++++++++')
		if (lnVal != null) { 
console.log(lnVal[0], mult, offset, '*******')
debugger;
			var newVal 		= (lnVal[0] * argMult.mTop + offset).toFixed(2).replace(/\.0+$/,'') //  Only to the hundredth, remove zeros...
				, newLine 	= line.replace(cssProp.dec, newVal); //  Swap values
console.log(newLine)
			return newLine;
		}
	}





	//  UTILITIES
	//  Save file after all is done...
	function saveFile(path, file, tmp) {

		//  Turn the Arr back to a string for saving...
		// tmp = tmp.join('\n')

		//  Save file to original...
		console.log(okGrn('[SUCCESS]: Saving file....', file));
		fs.writeFileSync(path + file, tmp);
	}

	//  Throw Err func...
	function throwError(err){
		console.log(errRed('[ERROR]:', err));
		return;
	}

	//  Return function for loops...
	function ret(newLine){
		return newLine;
	}
}

