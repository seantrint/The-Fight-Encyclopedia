const express = require('express');
const app = express();
const sql = require("mssql");
const pcName = 'WINDOWS-25B0042';

app.use(express.static('public'));

app.listen(3000, () => console.log('listening at 3000'));
app.get('/api', function(request,response){
    const config = {
        user: 'admUser',
        password: 'password',
        server: 'WINDOWS-25B0042',  
        database: 'testdata', 
        options:{
            instanceName:'SQLEXPRESS'
        }
    }
    //console.log(config.user);
    sql.connect(config, function(err){
        if(err)
        {
            console.log(err);
        }
        const req = new sql.Request();
        req.query('select * from dbo.UpcomingFights', function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);      
            console.log(recordset.recordset[0].FightLocation);
        })
    })
})