var express = require('express');
var router = express.Router();

var ctrlMekanlar = require('../controllers/mekanlar');

var ctrlDigerleri=require('../controllers/digerleri');

//anasayfa rotası
router.get('/', ctrlMekanlar.anaSayfa);
//mekan bilgisi rotası
router.get('/mekan', ctrlMekanlar.mekanBilgisi);
//yeni yorum rotası
router.get('/mekan/yorum/yeni', ctrlMekanlar.yorumEkle);
//hakkında rotası
router.get('/hakkinda', ctrlDigerleri.hakkinda);

module.exports = router;
