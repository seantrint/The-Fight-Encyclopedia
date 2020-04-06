const express = require('express');
const app = express.Router();
//app.set('view engine', 'ejs');
app.get('/',function(request,response){
    response.render('../public/index');
});
app.get('/fighterCatalogue/:mainFilter?/:weightFilter?/:genderFilter?/:viewType?',function(request,response){
    var mainFilter = request.params.mainFilter;
    var weightFilter = request.params.weightFilter;
    var genderFilter = request.params.genderFilter;
    var viewType = request.params.viewType;
    if(mainFilter == undefined){
        mainFilter = 'Alphabetical';
    }
    if(weightFilter == undefined){
        weightFilter = 'All weights';
    }
    if(genderFilter == undefined){
        genderFilter = 'Men';
    }
    if(viewType == undefined){
        viewType = 'Grid';
    }
    response.render('../public/fightercatalogue',{mainFilter: mainFilter, weightFilter: weightFilter, genderFilter:genderFilter, viewType: viewType});
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