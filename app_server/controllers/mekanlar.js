var express =require("express");
var request = require('postman-request');
var apiSecenekleri = {
	sunucu: "http://localhost:3000",
	apiYolu: '/api/mekanlar/'
}
var istekSecenekleri
var footer="Sevval Yuksek 2021"
var mesafeyiFormatla = function(mesafe) {
	var yeniMesafe, birim;
	if(mesafe> 1000){
		yeniMesafe= parseFloat(mesafe/1000).toFixed(1);
		birim=' km';
	}else{
		yeniMesafe=parseFloat(mesafe).toFixed(1);
		birim=' m';
	}
	return yeniMesafe + birim;
}

var anaSayfaOlustur = function(req,res,cevap,mekanListesi){
	var mesaj;
	//gelen mekanlistesi eğer dizi tipinde değilse hata ver
	if(!(mekanListesi instanceof Array)){
		mesaj="API HATASI : Bir şeyler ters gitti";
		mekanListesi=[];
	}
	else{
		//eğer belirlenen mesafe içinde mekan bulunamadıysa bilgilendir
		if(!mekanListesi.length){
			mesaj = "Civarda herhangi bir mekan bulunamadı";
		}
	}
	res.render('mekanlar-liste',
	{
		baslik:'MekanBul-Yakınındaki Mekanları Bul',
		sayfaBaslik:{
			siteAd:'MekanBul',
			aciklama:'Yakınınızda Restorant ve Kafeleri bulun'
		},
		footer:footer,
		mekanlar:mekanListesi,
		mesaj:mesaj,
		cevap:cevap
	});
}
const anaSayfa=function(req,res){
	istekSecenekleri={ //tam yol
		url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu, 
		method:"GET", //Veri çekmek için get metodu 
		json:{},//dönen veri json formatında
		qs:{
			enlem:req.query.enlem,
			boylam:req.query.boylam
		}
	};//istekte bulun
	request(
		istekSecenekleri,
		//geri dönüş metodu
		function(hata,cevap,mekanlar){
			var i , gelenMekanlar;
			gelenMekanlar = mekanlar;
			//sadece 200 durum kodunda ve mekanlar doluysa işlem yap
			if(!hata && gelenMekanlar.length){
				for(i=0;i<gelenMekanlar.length;i++){
					gelenMekanlar[i].mesafe = 
					mesafeyiFormatla(gelenMekanlar[i].mesafe);
				}
			}
			anaSayfaOlustur(req,res,cevap,gelenMekanlar);
		}
		);
}


var detaySayfasiOlustur = function(req,res,mekanDetaylari){
	res.render('mekan-detay',
	{
		baslik:mekanDetaylari.ad,
		footer:footer,
		sayfaBaslik:mekanDetaylari.ad,
		mekanBilgisi:mekanDetaylari
	});
}

var hataGoster = function(req,res,durum){
	var baslik,icerik;
	if(durum==404){
		baslik="404, Sayfa Bulunamadı!";
		icerik="Sayfayı Bulamadık";
	}
	else{
		baslik=durum+", birşeyler ters gitti";
		icerik="Ters giden birşey var!";
	}
	res.status(durum);
	res.render('error',{
		baslik:baslik,
		icerik:icerik
	});
}

var mekanBilgisiGetir=function(req,res,callback){
	//istek seçenekleri ayarla
	istekSecenekleri={
		url:apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid, 
		method:"GET", 
		json:{},
	};
	request(
		istekSecenekleri,
		function(hata,cevap,mekanDetaylari){
			var gelenMekan=mekanDetaylari;
			//enlem,boylam bir dizi şeklinde bunu ayır ilk enlem
			if(cevap.statusCode==200){
			gelenMekan.koordinatlar={
				enlem:mekanDetaylari.koordinatlar[0],
				boylam:mekanDetaylari.koordinatlar[1]
			};
			callback(req,res,gelenMekan);
		}else{
			hataGoster(req,res,cevap.statusCode);
		}
		});
}
const mekanBilgisi=function(req,res,callback){
	mekanBilgisiGetir(req,res,function(req,res,cevap){
		detaySayfasiOlustur(req,res,cevap);
	});
};
var yorumSayfasiOlustur=function(req,res,mekanBilgisi){
	res.render('yorum-ekle',{baslik:mekanBilgisi.ad+' Mekanına Yorum Ekle',
		sayfaBaslik:mekanBilgisi.ad+' Mekanına Yorum Ekle',
		hata:req.query.hata,
		footer:footer
});
};

const yorumEkle=function(req,res,next){
	mekanBilgisiGetir(req,res,function(req,res,cevap){
		yorumSayfasiOlustur(req,res,cevap);
	});
}
const yorumumuEkle=function(req,res){
	var gonderilenYorum,mekanid;
	mekanid=req.params.mekanid;
	gonderilenYorum={
		yorumYapan:req.body.name,
		puan:parseInt(req.body.rating ,10),
		yorumMetni:req.body.review
	};
	istekSecenekleri={
		url:apiSecenekleri.sunucu+apiSecenekleri.apiYolu+mekanid+'/yorumlar',
		method:"POST",
		json:gonderilenYorum
	};
	if(!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni){
		res.redirect('/mekan/'+mekanid+'/yorum/yeni?hata=evet');
	}else{
		request(
			istekSecenekleri,
			function(hata,cevap,body){
				if(cevap.statusCode==201){
					res.redirect('/mekan/'+mekanid);
				}else if(cevap.statusCode==400 && body.name && body.name=="ValidationError"){
					res.redirect('/mekan/'+mekanid+'/yorum/yeni?hata=evet');
				}else{
					hataGoster(req,res,cevap.statusCode);
				}

			});
	}
};

/*//var express = require('express');
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
*/
module.exports = {
anaSayfa,
mekanBilgisi,
yorumEkle,
yorumumuEkle
}
