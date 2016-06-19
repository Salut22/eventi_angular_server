var casper       = require('casper').create({/*{verbose: true}*/exitOnError: false});
var fs           = require('fs');



//var dataInizio ="26-maggio-2016"//il formato della data di inizio deve essere gg-mese(in italiano)-yyyy
//var dataFine   ="26-giugno-2016"//il formato della data di fine deve essere gg-mese(in italiano)-yyyy
//var luogo      ="ascoli-piceno"//il luogo deve essere tutto in minuscolo
var Name       ='virgilio/virgilio';
var FOLDER     = "../../scrape_results/virgilio/";
var EVENT_NOT_SAVE           = 'event_not_save.txt';
var nonSalvati ="";
var DataLastUpgrade;
casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});
casper.echo("Casper CLI passed args:");
require("utils").dump(casper.cli.args);
var province = [];
var lunggg   = casper.cli.args.length;
var salv;
casper.start('http://'+casper.cli.args[0]+'/eventi/',function(){});
//casper.start('http://ascoli-piceno.virgilio.it/eventi/', function(){});
//casper.start('http://'+salv+'.virgilio.it/eventi/?&page=0', function(){});
//console.log("la lunfdjs"+ lunggg);
casper.then(function(){

this.each(casper.cli.args, function(self, salv){
//for (t=0; t<lunggg/*MaxNum*/; t++)
//{
//    salv       = casper.cli.args[t];
    self.thenOpen('http://'+salv+'.virgilio.it/eventi/?&page=0', function() {
    console.log("*****"+salv);
    var eventi=[];
    var MaxNum;

/* ========================================
 CLICCO IL BOTTONE PER CALCOLARE LE PAGINE
========================================*/
casper.then(function check() {

console.log("\nClicco il pulsante per calcolare il numero di pagine");
var Pag; var index;
casper.then(clickAll);
function clickAll()
    {
    console.log(Pag);
    if(Pag!=""){
        
       casper.wait(1000, function() 
        { console.log("******"+Pag);
          console.log("I've waited for a second.");
          if (this.exists('a.fine.bgc10.c2')) 
          {
              this.click('a.fine.bgc10.c2');
              Pag = this.getElementAttribute("a.fine.bgc10.c2","href");
          }
          else
          {
              index = Pag.indexOf("=");
              MaxNum = Pag.slice(index+1);
              MaxNum = parseInt(MaxNum);
              console.log(MaxNum);
              Pag = "";
          }
         
        }); }
    else {return;}
      casper.then(clickAll); 
    }
})
/* ========================================
 SCRIVO L'INTESTAZIONE SUL FILE
========================================*/
/*casper.then(function()
{
// console.log("il file ver "+FOLDER+"virgilio.json ");
// fs.write(FOLDER+"virgilio.json", '{"city":"'+Name+'","other_id":"virgilio", "jsonPois":');
fs.appendFile(FOLDER+"virgilio.json", '{"city":"'+Name+'","other_id":"virgilio", "jsonPois":', function (err) 
        {console.error(err);});
})*/

/* ========================================
 INIZIO LO SCRAPE DI TUTTE LE PAGINE
========================================*/
casper.then(function() 
{        
 this.echo("entrato 1 then");  
 this.echo(MaxNum);
 var pois_urls=[];
 
//    for (i=0; i<=0/*MaxNum*/; i++){
    for (i=0; i<=MaxNum; i++){
        var pag=('http://'+salv+'.virgilio.it/eventi/?&page='+i);
        //console.log("i ======"+i);
        //console.log("nadsfjanf"+pag);        
        pois_urls.push(pag);
        }
  var i = 0;
   
this.each(pois_urls, function(self, poi_url){
     self.thenOpen(poi_url, function(){
           this.echo(poi_url);
           var pois_urlss= this.getElementsAttribute('.eventContent h5 a','href');
//           console.log(JSON.stringify(pois_urlss));
           this.each(pois_urlss, function repeat(self, poi_url){
//           console.log("1 carattere "+poi_url.charAt(0));
           if (poi_url.charAt(0)=="/")
               var apri = 'http://'+salv+'.virgilio.it'+poi_url;
            else
               var apri = poi_url;
//             self.thenOpen('http://'+luogo+'.virgilio.it'+poi_url, function(){
             self.thenOpen(apri, function(){

//             self.thenOpen(poi_url, function(){
                var event = {
                    'properties':
                    {
                    'type'    : "Feature",
                    'poi-type': 2,
                    "microCategoriesId": [
                    ],
                    "microCategories": [
                    ],
                    }, 
                    'details':
                    {

                        'address':{
                            
                                  },
                        
                    },
                    "geometry": {
                            "type": "Point"
                    }
                 };
/* ========================================
  IMAGINE
========================================*/
////                 
//                 var image  = [];
//                 var img;
//                 image = this.getElementsAttribute(".cont_img img","src");
//                 img = image[0];
////                 console.log(img);
////                 console.log("img 1"+image[0]);
//                 event.details['ph-primary']=images;


                var images="http://i.plug.it/local//sskin_seat//img/imgld.gif";
                var cont =0;
                casper.then(waitImg);
                console.log("inizio lo scrape dall'immagine perchè potrebbe non essere caricata");
                function waitImg()
                {
                    console.log(images);
                    if (images=="http://i.plug.it/local//sskin_seat//img/imgld.gif"&& cont<10)
                    {  
                       casper.wait(100, function()
                       {
//                          console.log(images);
                          images = this.getElementAttribute(".cont_img img","src");
                          cont ++;
                       });
                       
                    }
                    else {return images;}
                    casper.then(waitImg);
                }
                casper.then(function(){
//                console.log("****************"+images);
//                event.details['ph-primary']=images;

 //               });
//                 var Imagine = this.evaluate(function() 
//                               {
//                                    console.log("sono qui");
//                                    var images = document.getElementsAttribute(".cont_img img","src");
//                                    console.log("images"+images[0]);
//                                    images = Array.prototype.filter.call(images, function(i) { return !i.complete; });
//                                    window.imagesNotLoaded = images.length;
//                                    Array.prototype.forEach.call(images, function(i) 
//                                        { i.onload = function() { window.imagesNotLoaded--; }; });
//                                });
//                             // waitFor(Function testFx[, Function then, Function onTimeout, Number timeout])
//                            this.waitFor( function() 
//                                            {//testFx
//                                             return this.evaluate(function() 
//                                                { return window.imagesNotLoaded == 0; });
//                                            }, 
//                                         function()
//                                            {//then

//                 event.details['ph-primary']=images;
/* ========================================
  TITOLO
========================================*/

                    
                console.log(JSON.stringify("######### "+apri));
                var title = this.fetchText('.osr34.c2');
                title     = title.replace(/\n/,"");
                title     = title.trim();
                event.properties.title=title;
                console.log("!!!!!!! "+title+" !!!!!!!");
                
 /* ========================================
  ID Other_id
========================================*/
                var idIndex= apri.indexOf("_");
                if (idIndex>=0){
                    var codice     = apri.slice(idIndex+1);
 //                   console.log(codice);
                    event.details.other_id               = {};
                    event.details.other_id.virgilio      = codice;
                    event.details.last_update            = {};
                    var ultimo_aggiornamento             = new Date().getTime();
//                    console.log("l'ultimo aggiornamento"+ultimo_aggiornamento);
                    event.details.last_update.virgilio  = ultimo_aggiornamento;
                };
/* ========================================
  DATA
========================================*/                 
      var date = this.evaluate(function()
                 {  
                    var selector; var inizio; var inizio2; var dataTot; var data_H; var data_H2; var dataTot2; var lunghezza;
                    var fine =""; var mmEnd; var ggEnd; var yyyyEnd; var H_End; var start;
                    var modH =""; var h_start =""; var h_end =""; var min_start =""; var min_end =""; var hours;
                    var mmIn; var ggIn; var yyyyIn; var H_In; 
                    try{selector = document.querySelector(".eventTime")}
                    catch(e){};
                    try{selector = selector.querySelectorAll("time")}
                    catch(e){};
                    try{lunghezza= selector.length}
                    catch(e){};
                    try{modH     = document.querySelector(".evt_time strong").innerText}
                    catch(e){};
                    if (modH!="")
                    {
                        try{hours    = modH.split("-")}
                        catch(e){};
                        try{h_start  = hours[0].trim()}
                        catch(e){};
                        try{min_start= h_start.split(":")}
                        catch(e){};
                        try{h_start  = min_start[0]}
                        catch(e){};
                        try{min_start= min_start[1]}
                        catch(e){};
                        try{h_end    = hours[1].trim()}
                        catch(e){};
                        try{min_end  = h_end.split(":")}
                        catch(e){};
                        try{h_end    = min_end[0]}
                        catch(e){};
                        try{min_end  = min_end[1]}
                        catch(e){};
                           
                    }
                    try{inizio   = selector[0].getAttribute("datetime")}
                    catch(e){};
                    try{data_H2  = inizio.split("T")}
                    catch(e){};
                    try{dataTot2 = data_H2[0].split("-")}
                    catch(e){};
                    try{yyyyIn   = dataTot2[0]}
                    catch(e){}; 
                    try{mmIn     = dataTot2[1]}
                    catch(e){}; 
                    try{ggIn     = dataTot2[2]}
                    catch(e){};
                    try{H_In     = data_H2[1].split(":")}
                    catch(e){};
                    if (h_start!="")
                    {
                        start=new Date();
                        start.setFullYear(yyyyIn, mmIn-1, ggIn);
                        start.setHours(h_start);
                        start.setMinutes(min_start);
                        start.setSeconds(0);
                        start.setMilliseconds(0);
                    }
                    else 
                    {
                        start = inizio;
                    }
                    if (lunghezza==2)
                    {
                        try{inizio2  = selector[1].getAttribute("datetime")}
                        catch(e){};
                        try{data_H   = inizio2.split("T")}
                        catch(e){};
                        try{dataTot  = data_H[0].split("-")}
                        catch(e){};
                        try{yyyyEnd  = dataTot[0]}
                        catch(e){}; 
                        try{mmEnd    = dataTot[1]}
                        catch(e){}; 
                        try{ggEnd    = dataTot[2]}
                        catch(e){};
                        try{H_End    = data_H[1].split(":")}
                        catch(e){};
                        if (h_end!="")
                         {
                            fine=new Date();
                            fine.setFullYear(yyyyEnd, mmEnd-1, ggEnd);
                            fine.setHours(h_end);
                            fine.setMinutes(min_end);
                            fine.setSeconds(59);
                            fine.setMilliseconds(0);
                         }
                        else 
                        {
                            fine= new Date();
                            fine.setFullYear(yyyyEnd, mmEnd-1, ggEnd);
                            fine.setHours(23);
                            fine.setMinutes(59);
                            fine.setSeconds(59);
                            fine.setMilliseconds(0); 
                        }   
                    }
                    else
                    {
                       if (h_end!="")
                         {
                            fine=new Date();
                            fine.setFullYear(yyyyIn, mmIn-1, ggIn);
                            fine.setHours(h_end);
                            fine.setMinutes(min_end);
                            fine.setSeconds(59);
                            fine.setMilliseconds(0);
                         }
                        else 
                        {
                            fine= new Date();
                            fine.setFullYear(yyyyIn, mmIn-1, ggIn);
                            fine.setHours(23);
                            fine.setMinutes(59);
                            fine.setSeconds(59);
                            fine.setMilliseconds(0); 
                        } 
                    }
                    
                     var date={
                            dateFrom: start,
                            dateTo  : fine,
//                            H : H_End[0],
//                            modH : modH,
//                            h_start: h_start,
//                            h_fin  : h_end,
//                            min_end: min_end,
//                            min_start: min_start,
                            lunghezza: lunghezza
                            
                       };

                        return  JSON.stringify(date);
                 }); 

                var allData=JSON.parse(date);
  //              console.log(JSON.stringify(allData));
                event.properties.dateFrom=allData.dateFrom;
                event.properties.dateTo=allData.dateTo;

/* ========================================
  CONTATTI
========================================*/
        var contacts = this.evaluate(function()
                 {
                    var phone; var email; var website; var selector; var emailWeb; var selector2; var lunghezza;
                    try{selector = document.querySelector(".max_info")}
                    catch(e){};
                    try{selector2= document.querySelectorAll(".max_info a")}
                    catch(e){};
                    try{lunghezza= selector2.length}
                    catch(e){};
                    try{phone    = selector.querySelector(".num_tel.ossb14.c2").innerText}
                    catch(e){};
                    if (lunghezza == 1)
                        {
                            try{emailWeb = selector2[0].getAttribute("href")}
                            catch(e){};
                            if (emailWeb.indexOf("mailto:")>=0)
                                {
                                   try{email = emailWeb.replace("mailto:","")}
                                   catch(e){}; 
                                }
                            else 
                                {
                                   try{website= emailWeb}
                                   catch(e){};
                                }
                        }
                    else if (lunghezza==2)
                        {
                           try{emailWeb = selector2[0].getAttribute("href")}
                            catch(e){};
                            if (emailWeb.indexOf("mailto:")>=0)
                                {
                                   try{email = emailWeb.replace("mailto:","")}
                                   catch(e){};
                                   try{website= selector2[1].getAttribute("href")}
                                   catch(e){};
                                }
                            else 
                                {
                                   try{website= emailWeb}
                                   catch(e){};
                                   try{email = selector2[1].getAttribute("href").replace("mailto:","")}
                                   catch(e){};
                                } 
                        }
                    var contacts =
                        {
                            'phone': phone,
                            'email': email,
                            'website':website,
                            'lunghezza': lunghezza
                        };
                    return JSON.stringify(contacts);
                 });
                 var allCont= JSON.parse(contacts);

//                 console.log("****"+JSON.stringify(allCont));
                 if (allCont!=null)
                 { 
                     event.details.contact         = {};
                     if (allCont.phone!=undefined)
                        event.details.contact.phone      = allCont.phone;
                     if (allCont.email!=undefined)
                        event.details.contact.email      = allCont.email;
                     if (allCont.website!=undefined && allCont.website.indexOf('www.evensi.it')==-1)
                        event.details.contact.website    = allCont.website;
                 }
//                 console.log(JSON.stringify(allInd));
                 
                 
/* ========================================
  INDIRIZZO E COORDINATE
========================================*/
        var address = this.evaluate(function()
                 { 
                    var address2; var street; var cap; var country; var city; var state; var selector; var title; var lng; var lat;
                    var miscellanus; var index; var match; var selector2; var selettore;
            
                    try{selector = document.querySelector(".luogo_eventi.bgc1.c2 address").innerText}
                    catch(e){};
                    try{title    = document.querySelector(".ossb16").innerText}
                    catch(e){};
                    try{selettore= document.querySelector(".mappa_eventi")}
                    catch(e){};
                    try{lng      = selettore.getAttribute("data-lon")}
                    catch(e){};
                    try{lat      = selettore.getAttribute("data-lat")}
                    catch(e){};
                    if (selector.indexOf(",")>=0)
                    {
                        try{address2         = selector.split(",")}
                        catch(e){};
                        try{street           = address2[0]}
                        catch(e){};
                        try{miscellanus      = address2[1].trim()}
                        catch(e){};
                        try{match            = miscellanus.match(/[0-9]/)}
                        catch(e){};
                        try{index            = miscellanus.indexOf(match[0])}
                        catch(e){};
                        if (index>=0)
                        {
                            try{cap          = miscellanus.slice(index, index+5)}   
                            catch(e){};
                            try{selector2    = miscellanus.split("(")}
                            catch(e){};
                            try{city         = selector2[0].slice(index+6).trim()}
                            catch(e){};
                            try{country      = selector2[1].replace(")","")}
                            catch(e){};
                        }
                        else
                        {
                            try{selector2    = miscellanus.split("(")}
                            catch(e){};
                            try{city         = selector2[0].trim()}
                            catch(e){};
                            try{country      = selector2[1].replace(")","")}
                            catch(e){}; 
                        }
                    }
                    else
                    {
                        try{miscellanus      = selector.trim()}
                        catch(e){};
                        try{match            = miscellanus.match(/[0-9]/)}
                        catch(e){};
                        try{index            = miscellanus.indexOf(match[0])}
                        catch(e){};
                        if (index>=0)
                        {
                            try{cap          = miscellanus.slice(index, index+5)}   
                            catch(e){};
                            try{selector2    = miscellanus.split("(")}
                            catch(e){};
                            try{city         = selector2[0].slice(index+6).trim()}
                            catch(e){};
                            try{country      = selector2[1].replace(")","")}
                            catch(e){};
                        }
                        else
                        {
                            try{selector2    = miscellanus.split("(")}
                            catch(e){};
                            try{city         = selector2[0].trim()}
                            catch(e){};
                            try{country      = selector2[1].replace(")","")}
                            catch(e){}; 
                        }
                    }
//                    try{
//                        if (address2!=)
//                    }
//                    catch(e){};
                    var address =
                       {
                           title  : title,
                           street : street,
                           index  : index,
                           zip    : cap,
                           country: country,
                           city   : city,
                           state  : "marche",
                           lat    : lat,
                           lng    : lng
                           
                       };
                    return JSON.stringify(address);
                 });
                 var allInd = JSON.parse(address);
                 var titolo = allInd.title;
//                 console.log(JSON.stringify(allInd));
                 if (allInd.title!=undefined)
                    event.details.address.title    = allInd.title;
                 if (allInd.street!=undefined)
                    event.details.address.street   = allInd.street;
                 if (allInd.city!=undefined)
                    event.details.address.city     = allInd.city.toLowerCase();
                 if (allInd.zip!=undefined)
                    event.details.address.zip      = allInd.zip;
                 if (allInd.country!=undefined)
                    event.details.address.country  = allInd.country.toUpperCase();
                 event.details.address.state    = allInd.state;
                 if (allInd.lng!=undefined && allInd.lat!=undefined)
                 {
                    var coordinates = [allInd.lng, allInd.lat];                
                    event.geometry.coordinates = coordinates;  
                 }

                 
/* ========================================
  TIPO DI EVENTO
========================================*/
                 
                 var tipo           = this.getElementsAttribute('.tags li a','href');
                 var cat1; var cat2;
                 var lunghezza =tipo.length;
 //                console.log("la luunghezza "+lunghezza);
                 if (lunghezza>=1)
                 {
                    cat1               = tipo[0].split("-");
 //                   console.log("tipo1:"+cat1[1]);   
                 }
                 
                 if (lunghezza>=2){
                    cat2            = tipo[1].split("-");
 //                   console.log("tipo2:"+cat2[1]);
                 };
                 var macroTipo      = this.fetchText(".fonte.osb11.c14.fonteStyle a");
                 macroTipo          = macroTipo.replace(/\s/g,"").toLowerCase();
 //                console.log(macroTipo);
                 

                 
/* ========================================
  MICROCATEGORIE
========================================*/
                     switch(macroTipo)
                     {
                        case "concerti"         : //console.log("CONCERTO");
                                                  event.properties.microCategoriesId.push(td_match["concerti"]);
                                                         break;
                        case "rassegne"         : //console.log("RASSEGNE");
                                                  event.properties.microCategoriesId.push(td_match["rassegneeproiezioni"]);
                                                         break;
                        case "mercatini"        : //console.log("MERCATINI");
                                                  event.properties.microCategoriesId.push(td_match["mercatini"]);
                                                         break;
                        case "sagre"            :
                                                  event.properties.microCategoriesId.push(td_match["sagreefestepopolari"]);
                                                         break;
                     }
                     if (lunghezza>=1)
                     {
                         switch(cat1[1])
                         {
                            case "musica_dal_vivo"  : //console.log("stiamo in un concerto");
                                                       event.properties.microCategoriesId.push(td_match["eventomusicalive"]);
                                                             break;
                            case "cultura"          : //console.log("CULTURA");
                                                       event.properties.microCategoriesId.push(td_match["arteeintrattenimento"]);
                                                             break;
                            case "sport"            : //console.log("SPORT");
                                                       event.properties.microCategoriesId.push(td_match["attivitàsportive"]);
                                                             break;      
                            case "food_and_drink"   : //console.log("FOOD E DRINK");
                                                       event.properties.microCategoriesId.push(td_match["eventoenogastronomi"]); 
                                                             break;
                            case "fiere"            : //console.log("FIERE");
                                                        event.properties.microCategoriesId.push(td_match["fieradistrada"]);
                                                        event.properties.microCategoriesId.push(td_match["fiera"]);      
                                                             break;
                            case "nightlife"        : //console.log("NIGHT");
                                                        event.properties.microCategoriesId.push(td_match["eventonotturno"]);
                                                             break;

                         }
                     }
                     if(lunghezza>=2){
                        switch(cat2[1])
                         {
                            case "musica_dal_vivo"  : //console.log("stiamo in un concerto");
                                                       event.properties.microCategoriesId.push(td_match["eventomusicalive"]);
                                                             break;
                            case "cultura"          : //console.log("CULTURA");
                                                       event.properties.microCategoriesId.push(td_match["arteeintrattenimento"]);
                                                             break;
                            case "sport"            : //console.log("SPORT");
                                                       event.properties.microCategoriesId.push(td_match["attivitàsportive"]);
                                                             break;      
                            case "food_and_drink"   : //console.log("FOOD E DRINK);
                                                       event.properties.microCategoriesId.push(td_match["eventoenogastronomi"]); 
                                                             break;
                            case "fiere"            : //console.log("FIERE");
                                                        event.properties.microCategoriesId.push(td_match["fieradistrada"]);
                                                        event.properties.microCategoriesId.push(td_match["fiera"]);      
                                                             break;
                            case "nightlife"        :   //console.log("NIGHT");
                                                        event.properties.microCategoriesId.push(td_match["eventonotturno"]);
                                                             break;

                         }
                    }
                 event.properties.microCategoriesId.push(td_match["evento"]);
                 if (lunghezza>=1)
                 {
                     if (cat1[1]=='top_event')
                     {
                         event.properties.microCategoriesId.push(td_match["imperdibili"]);
                     }
                 }
                 if (lunghezza>=2)
                 {
                     if (cat2[1]=='top_event')
                     {
                         event.properties.microCategoriesId.push(td_match["imperdibili"]);
                     }
                 }
                 if (title.indexOf("museo")>=0||title.indexOf("musei")>=0||
                     titolo.indexOf("museo")>=0||titolo.indexOf("musei")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["museo"]);
                 };
                 if (title.indexOf("gallery")>=0||title.indexOf("galleria")>=0||
                     titolo.indexOf("gallery")>=0||titolo.indexOf("galleria")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["galleriadarte"]);
                 };
                 if(title.indexOf("degustazione")>=0||title.indexOf("degustazionii")>=0||
                    titolo.indexOf("degustazione")>=0||titolo.indexOf("degustazioni")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["degustazione"]);
                 };
                 if (title.indexOf("cantina")>=0||title.indexOf("cantine")>=0
                     ||titolo.indexOf("cantina")>=0||titolo.indexOf("cantine")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["cantina"]);  
                 };
                 if (title.indexOf("vini")>=0||title.indexOf("vino")>=0||title.indexOf("vineria")>=0||
                     title.indexOf("vinerie")>=0
                     ||titolo.indexOf("vini")>=0||titolo.indexOf("vino")>=0||titolo.indexOf("vineria")>=0||
                     titolo.indexOf("vinerie")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["vineria"]);  
                      
                 };
                 if (title.indexOf("birra")>=0||title.indexOf("birre")>=0||title.indexOf("birrificio")>=0||title.indexOf("birreria")>=0||
                     titolo.indexOf("birra")>=0||titolo.indexOf("birrificio")>=0||titolo.indexOf("birreria")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["birreria"]);
                 };
                 if (title.indexOf("teatro")>=0||titolo.indexOf("teatro")>=0)
                 {
                     event.properties.microCategoriesId.push(td_match["teatro"]);
                 };
/* ========================================
  PREZZO BIGLIETTO e OTHER_ID TICKET ONE
========================================*/
                 var price =this.evaluate(function() 
                 {
                  var selector ; var selector2; var info;
                  try{selector = document.querySelector(".evt_ticket").innerText}
                  catch(e){};
                  try{selector2= document.querySelector(".eventPrice span").innerText}
                  catch(e){};
//                  try{info     = selector2.querySelector(".ossb12.c1").innerText}
//                  catch(e){};
                  var price=
                      {
                          price2: selector,
                          info  : selector2
                      }
//                  return selector
                  return JSON.stringify(price);

                 })
                 var allInf = JSON.parse(price);
//                 console.log("]]]]]]"+JSON.stringify(allInf));
//                 console.log("le info sono: "+allInf.info);
//                 var price  = allInf.price;
//                 price      = price.trim();
//                 coonsole.log("il prezzo è: "+allInf.price2);
                 
//                 event.details.price.prc_info = price;
                if (allInf.price2.indexOf("Prezzo non disponibile")>=0)
                    {
                        
                    }
                else
                    {
                        event.details.price  = {};
                        if(allInf.info==undefined)
                        {
                            event.details.price.prc_info = allInf.price2;  
                        }
                        else
                        {
                            event.details.price.prc_info = allInf.price2 +"\n"+allInf.info;
                        }    
                    }
//                 var webTicket       = this.getElementAttribute('.imgticket a','href');
////                 console.log("il webTicket : "+webTicket);
//                 var usAffiliate ="http://clkuk.tradedoubler.com/click?p(237081)a(2838986)g(21237920)url("+webTicket+")";
////                 console.log("l'us Affiliato : "+usAffiliate);
//                 
//                 
//                 if (webTicket!=null)
//                    {   var res         = webTicket.match(/evdetailb&key=/);
////                        console.log("********** il res è : "+res);
//                        var index       = webTicket.indexOf(res);
//                        var codice      = webTicket.slice(index).replace(res,"");
////                        console.log("il codice :"+codice);
//                        event.details.ticket_office          = {};
//                        event.details.ticket_office.website  = usAffiliate;
//                        event.details.other_id               = {};
//                        event.details.other_id.ticket_one    = codice;
//                        event.details.last_update            = {};
//                        var ultimo_aggiornamento             = new Date().getTime();
//                        console.log("l'ultimo aggiornamento"+ultimo_aggiornamento);
//                        event.details.last_update.ticket_one = ultimo_aggiornamento;
//                    }
//                 
//                 event.details.type = tipo;
/* ========================================
  DESCRIZIONE
========================================*/
                 
////                 var desc = this.fetchText('.scroll-inner');
////                 event.details.desc = desc;
//
                 var descr =this.evaluate(function() 
                 {
                  var selector ;
                  try{selector = document.querySelector(".text-wrapper").innerHTML}
                  catch(e){};   
                  return selector
                 })

                 var desc="";
                 var img = images;
                 var element = "" ;
                 var sito    = "";
                 console.log(img);
                 var esiste = this.getElementAttribute(".leggi_tutto","href");
//                 console.log("esiste"+esiste);
                 if(esiste!=null)
                 {
                     console.log("il campo per cliccare esiste");
                     self.thenOpen(esiste, function(){
                         waitDesc();
                         function waitDesc()
                         {
                            //console.log(desc);
                            console.log(images);
                            if(desc=="" && img==images)
                            {

                               casper.wait(1000, function() 
                                { //console.log("******"+desc);
                                  console.log("I've waited for a second");
                                  desc   = this.getHTML(".p-desc");
                                  images = this.getElementAttribute("#locandina a img","src");
                                  sito   = this.getElementAttribute(".m-b-x a","href");
                                  element = images + "!*"+sito+"!!!???"+desc;
//                 
//                                  var elements = 
//                                      {
//                                          desc : desc,
//                                          img  : images
//                                      }
                                  
                                  })

                            }
                            else {return element;}
                            casper.then(waitDesc);
                          }
                     });
                 }
                 casper.then(function(){
//                     var allElem = JSON.parse(elements);
                     console.log (element);
                     if (element!="")
                     {
                         var indice = element.indexOf('!*');
                         var indice2= element.indexOf("!!!???");
                         images     = element.slice(0,indice);
                         sito       = element.slice(indice+2, indice2);
                         desc       = element.slice(indice2+6);
                         console.log("web *******"+sito);
                         console.log("img ********"+images);
                         console.log("desc ********" +desc);
                         event.details.contact.website = sito; 

                         
                     }
                     event.details['ph-primary']=images;

//                     console.log("]]]]]]]*******"+JSON.stringify(allElem))
                     //console.log("desc:"+desc);
                     if(desc=="")
                        event.details.desc= descr;
                     else
                        event.details.desc = desc
                     console.log(JSON.stringify(event, null, 2));
                     eventi.push(event);
/*                     casper.then(function(){
                        console.log("Event salvato nel Json "+FOLDER+"virgilio.json ");
                        fs.appendFile(FOLDER+'virgilio.json', JSON.stringify(eventi, null, 2)+',', function (err) 
                        {console.error(err);});
                        })

*/
                     
                        });
                 
                    });
                });
            })

//                 if(e%10==0)
//                 {        
//                   fs.write(FOLDER+salv+e'.json', 
//                  '{"city":"'+Name+'","other_id":"virgilio", "jsonPois":'+ JSON.stringify(ev, null, 2)+'}');

 
	});//qui finisce l'apertura di tutte le parti
        });


          

     });
})
casper.then(function()
	{
      console.log("file eventi salvati in "+FOLDER+salv);
	  fs.write(FOLDER+salv+'.json', 
			  '{"city":"'+Name+'","other_id":"virgilio", "jsonPois":'+ JSON.stringify(eventi, null, 2)+'}');
	});

});

});
//casper.then(function()
//	{
//      DataLastUpgrade             = new Date();
//	  fs.appendFile('Fine.txt', 'Fine'+salv+ " data creazione"+DataLastUpgrade);
//	});
//});
//casper.then(function()
//	{
//      console.log("file eventi salvati in "+FOLDER+"virgilio.json ");
//	  fs.appendFile(FOLDER+'virgilio.json', '}');
//	});
//casper.then(function()
//	{
//      console.log("file eventi non salvati in "+FOLDER+EVENT_NOT_SAVE);
//	  fs.write(FOLDER+FOLDER+EVENT_NOT_SAVE, nonSalvati);
//	});
var td_match=
    {
        "imperdibili"         :"000000",
        "evento"              :"4d4b7105d754a06373d81259",
        "eventoenogastronomi" :"4d4b7105d754a06373d81259bis",
        "eventodate"          :"4d4b7105d754a06373d81259tris",
//        "fooddrink"           :"4d4b7105d754a06373d81259b2is",
        //concerti
        "concerti"            :"4bf58dd8d48988d1e5931735",
        "festivalmusicale"    :"5267e4d9e4b0ec79466e48d1", 
        "eventopop/rock"      :"4bf58dd8d48988d1e5931735_1",
        "eventometal"         :"4bf58dd8d48988d1e5931735_2",
        "eventojazz"          :"4bf58dd8d48988d1e5931735_3",
        "eventolirica"        :"4bf58dd8d48988d1e5931735_4",
        "eventoclassica"      :"4bf58dd8d48988d1e5931735_5",
        "eventomusicalive"    :"4bf58dd8d48988d1e5931735_6",
        //eventi locali
        "convention"          :"5267e4d9e4b0ec79466e48c9",
        "festival"            :"5267e4d9e4b0ec79466e48c7",
        "fieradistrada"       :"5267e4d8e4b0ec79466e48c5",
        "fiera"               :"4eb1daf44b900d56c88a4600",
        "mercatini"           :"5267e4d8e4b0ec79466e48c5bis",
        "sagreefestepopolari" :"5267e4d9e4b0ec79466e48c7bis",
        "rassegneeproiezioni" :"5267e4d9e4b0ec79466e48c9bis",
        "altrotipodievento"   :"5267e4d9e4b0ec79466e48c8",
        "eventonotturno"      :'4bf58dd8d48988d11a941735',
        //spettacoli e teatro
        "danzaeballetto"      :"4bf58dd8d48988d18e941735bis",
        "cabaret"             :"4bf58dd8d48988d18e941735",
        "musicalvarieta"      :"4bf58dd8d48988d18e941735tris",
        "altrispettacoli"     :"4bf58dd8d48988d18e941735quatris",
        //arte e cultura        
        "conferenza"          :"5267e4d9e4b0ec79466e48c6",
        "mostreedesposizioni" :"4bf58dd8d48988d181941735bis",
        "arteeintrattenimento":"4d4b7104d754a06370d81259",
        //sport
        "tennis"              :"4e39a891bd410d7aed40cbc2",
        "attivitàsportive"    :"4f4528bc4b90abdf24c9de85",
        "rugby"               :"52e81612bcbc57f1066b7a2c",        
        "calcio"              :"4f4528bc4b90abdf24c9de85_1",
        "automobilismo"       :"4f4528bc4b90abdf24c9de85_2",
        "motociclismo"        :"4f4528bc4b90abdf24c9de85_3",
        "pugilato"            :"4f4528bc4b90abdf24c9de85_4",
        //altro
        "circo"               :"52e81612bcbc57f1066b79e7",
        "teatro"              :"4bf58dd8d48988d137941735",
        "parcoatema"          :"4bf58dd8d48988d182941735",
        //museo e controlli con if
        "museo"               :"4bf58dd8d48988d181941735",
        "galleriadarte"       :"4bf58dd8d48988d1e2931735",
        "degustazione"        :"4bf58dd8d48988d14b941735tris",
        "cantina"             :"4bf58dd8d48988d14b941735bis",
        "vineria"             :"4bf58dd8d48988d14b941735",
        "birreria"            :"4bf58dd8d48988d117941735"
        
    }


casper.run(function() {
    this.echo('So the whole suite ended.');
    this.exit(); // <--- don't forget me
//    this.die("Complete callback has failed: " + err);
});