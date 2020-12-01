var express = require('express');
var router = express.Router();

//ana sayfayı yöneten metot
module.exports.index=function(req, res, next) {
	res.render('index', { title: 'Sevval' });
};