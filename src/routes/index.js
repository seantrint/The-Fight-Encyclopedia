const server = require('../index');
server.get('/',function(request,response){
    response.render('../public/index');
})
server.get('/fighterCatalogue',function(request,response){
    response.render('../public/fightercatalogue');
})
server.get('/fighterCard/:boxerName',function(request,response){
    var boxerName = request.params.boxerName;
    var pathToCard = path.resolve(__dirname+'../../public/fightercard.html');
    console.log(boxerName);
    response.render('../public/fightercard',{boxer: boxerName});
})