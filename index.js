/* global require, _ */
'use strict';

var fs		= require('fs')
	, _ 	= require('underscore')
	, path	= __dirname + '/../../Desktop/NGL_ELT-GREX1_v3/OPS/styles/';

function readFiles(path) {

	fs.readdir (path, function(err, files) {
		if (err) {
			console.log('Error reading dir:', err);
		} else {
			readFile(files)
		}
	});
}

function readFile(files) {
	_.each(files, function(file) {
		console.log(path + file);
		fs.readFile(path + file, 'utf8', function(err, data) {
			if (err) {
				console.log('Error reading file:', err)
			} else {
				console.log(file, data)
			}
		})
	})
}


readFiles(path)