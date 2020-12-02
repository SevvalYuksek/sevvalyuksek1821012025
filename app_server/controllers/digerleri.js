//var express = require('express');
//var router = express.Router();

//ana sayfayı yöneten metot
const hakkinda=function(req, res, next) {
	res.render('hakkinda', { title: 'Hakkında' });
}

module.exports={

	hakkinda
}