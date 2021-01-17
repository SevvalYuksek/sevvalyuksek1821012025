var express = require('express');
var router = express.Router();

var ctrlMekanlar = require('../controllers/mekanlar');

var ctrlDigerleri=require('../controllers/digerleri');

//anasayfa rotası
router.get('/', ctrlMekanlar.anaSayfa);
//mekan bilgisi rotası
router.get('/mekan/:mekanid', ctrlMekanlar.mekanBilgisi);
//yeni yorum rotası
router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
router.post('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumumuEkle);
//hakkında rotası
router.get('/hakkinda', ctrlDigerleri.hakkinda);

module.exports = router;
