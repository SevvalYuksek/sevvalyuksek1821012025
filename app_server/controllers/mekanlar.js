//var express = require('express');
//var router = express.Router();
var footer="Sevval Yuksek 2020"
//ana sayfayı yöneten metot
const anaSayfa=function(req, res, next) {
	res.render('mekanlar-liste',
	 { 'baslik' : 'Anasayfa',
	   'footer': footer,
	   'sayfaBaslik' : {
	   	  'siteAd':'Mekan32',
	   	  'aciklama': 'Isparta civarındaki mekanları keşfedin!'
	   },
	   'mekanlar' : [
	   {
	   	    'ad':'Starbucks',
	   	    'adres':'Centrum Garden AVM',
	   	    'puan':'4',
	   	    'imkanlar':['kahve','kek','pasta'],
	   	    'mesafe':'10km'
	   },
	   {
	   	    'ad':'Gloria Jeans',
	   	    'adres':'İyaş Bulvar',
	   	    'puan':'3',
	   	    'imkanlar':['kahve','çay','tatlı'],
	   	    'mesafe':'30km'
	   },
	   {
	   	    'ad':'Osmanlı Kahvecisi',
	   	    'adres':'Isparta',
	   	    'puan':'3',
	   	    'imkanlar':['türk kahvesi','çay','kahve','çikolata'],
	   	    'mesafe':'5km'
	   },
	   {
	   	    'ad':'Alcatraz',
	   	    'adres':'İyaş Park AVM',
	   	    'puan':'5',
	   	    'imkanlar':['waffle','kahve','limonata'],
	   	    'mesafe':'20km'
	   },
	   {
	   	    'ad':'Sokak Cafe',
	   	    'adres':'Isparta',
	   	    'puan':'2',
	   	    'imkanlar':['kahve','çay','tost'],
	   	    'mesafe':'10km'
	   },
	   ]
	  }
	);
}

const mekanBilgisi=function(req, res, next){
	res.render('mekan-detay',{
	   'baslik' : 'Mekan Bilgisi',
	   'footer': footer,
	   'sayfaBaslik' : 'Starbucks',
	   'mekanBilgisi' :{
	        'ad':'Starbucks',
	   	    'adres':'Centrum Garden AVM',
	   	    'puan':'4',
	   	    'imkanlar':['kahve','kek','pasta'],
	   	    'koordinatlar' :{
	   	    	'enlem':37.781885,
	   	    	'boylam':30.56634
	   	    },
	        'saatler' : [
	            {
	   	          'gunler':'Pazartesi-Cuma',
	   	          'acilis':'7:00',
	   	          'kapanis':'23:00',
	   	          'kapali':false
	            },
	            {
	   	          'gunler':'Cumartesi',
	   	          'acilis':'9:00',
	   	          'kapanis':'22:30',
	   	          'kapali':false
	            },
	            {
	   	          'gunler':'Pazar',
	   	          'kapali':true
	            },
	        ],
	        'yorumlar':[
                {
	   	          'yorumYapan':'Asım Sinan Yüksel',
	   	          'puan':3,
	   	          'tarih':'18 Ekim 2017',
	   	          'yorumMetni':'Kahveleri çok güzel'
	            }
	        ]
	    }
	});        
}
const yorumEkle=function(req, res, next){
	res.render('yorum-ekle',{title : 'Yorum Ekle'});
}

module.exports = {
anaSayfa,
mekanBilgisi,
yorumEkle
}
