const express = require('express');
const app = express();
const sql = require("mssql");

const config = {
    user: 'admUser',
    password: 'password',
    server: 'WINDOWS-25B0042',  
    database: 'testdata', 
    options:{
        instanceName:'SQLEXPRESS'
    }
}
sql.connect(config, function(err){
    if(err)
    {
        console.log(err);
    }
})
app.use(express.static('public'));
app.listen(3000, () => console.log('listening at 3000'));

app.get('/getUpcomingFights', function(request,response){

        request = new sql.Request();
        request.query('select * from dbo.UpcomingFights', function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);
        })
})

app.get('/getUpcomingFighterNames', function(request,response){
    
    request = new sql.Request();
    request.query('select s1.BoxerName, s2.BoxerName from' 
        +'( select b.BoxerName, u.UpcomingFightID'
        +' from Boxer b'
        +' inner join UpcomingFights u on u.BoxerAID = b.BoxerId) s1'
        +' inner join'
        +'(  select b.BoxerName, u.UpcomingFightID'
        +' from Boxer b'
        +' inner join UpcomingFights u on u.BoxerBID = b.BoxerId) s2'
        +' on s1.UpcomingFightID = s2.UpcomingFightID', function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);
        })    
})

app.get('/getUpcomingFighterRecords',function(request,response){
    request = new sql.Request();
    request.query('select s1.TotalWins, s1.TotalWinsKO, s1.TotalLosses, s1.TotalDraws, s2.TotalWins, s2.TotalWinsKO, s2.TotalLosses, s2.TotalDraws from'
        +'( select b.TotalWins, b.TotalWinsKO, b.TotalLosses, b.TotalDraws, u.UpcomingFightID'
        +' from BoxerRecord b'
        +' inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +' inner join'
        +' ( select b.TotalWins, b.TotalWinsKO, b.TotalLosses, b.TotalDraws, u.UpcomingFightID'
        +' from BoxerRecord b'
        +' inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +' on s1.UpcomingFightID = s2.UpComingFightID', function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })
})

app.get('/getUpcomingFighterStats',function(request,response){
    request = new sql.Request();
    request.query('select s1.Age, s1.Height, s1.Reach, s1.Nationality, s2.Age, s2.Height, s2.Reach, s2.Nationality from'
        +'( select b.Age, b.Height, b.Reach, b.Nationality, u.UpcomingFightID'
        +'  from BoxerStats b'
        +'  inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +'  inner join'
        +'( select b.Age, b.Height, b.Reach, b.Nationality, u.UpcomingFightID'
        +'  from BoxerStats b'
        +'  inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +'  on s1.UpcomingFightID = s2.UpComingFightID', function(err,recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })
})

app.get('/getUpcomingFighterImages',function(request,response){
    request = new sql.Request();
    request.query('select s1.BoxerImageReference, s2.BoxerImageReference from'
        +'( select b.BoxerImageReference, u.UpcomingFightID'
        +'  from BoxerImage b' 
        +'  inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +'  inner join' 
        +'( select b.BoxerImageReference, u.UpcomingFightID'
        +'  from BoxerImage b' 
        +'  inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +'  on s1.UpcomingFightID = s2.UpComingFightID', function(err,recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })
})

app.get('/getRandomFighterImages',function(request,response){
    request = new sql.Request();
    request.query('SELECT * FROM dbo.BoxerImage' 
    +' WHERE (ABS(CAST'
    +' ((BINARY_CHECKSUM(*) *' 
    +' RAND()) as int)) % 100) < 80'
        ,function(err,recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })
})