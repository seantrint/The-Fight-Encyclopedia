const express = require('express');
const app = express();
const routes = require("./routes/index");
const views = require("./views/index");

app.set('view engine', 'ejs');

const startServer = async () => {
    try{
        app.use(express.static('public'));
        app.listen(3000, () => console.log('listening at 3000'));               
    }
    catch(err){
        console.log("error starting server: "+err)
    }
}
startServer();
app.use(routes);
app.use(views);