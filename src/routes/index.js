const express = require('express');
const app = express.Router();
//app.set('view engine', 'ejs');
app.get('/',function(request,response){
    response.render('../public/index');
});
app.get('/fighterCatalogue',function(request,response){
    response.render('../public/fightercatalogue');
});
app.get('/fighterCard/:boxerName',function(request,response){
    var boxerName = request.params.boxerName;
    response.render('../public/fightercard',{boxer: boxerName});
});
app.get('/searchResults/:searchTerm', function(request,response){
    var searchTerm = request.params.searchTerm;
    response.render('../public/searchresults',{searchTerm: searchTerm});
});
app.use(function(request,response){
    response.status(404).render('../public/errorpages/error404');
});
module.exports = app;