const express = require('express');
const app = express();
const sql = require("mssql");
const path = require('path');

app.set('view engine', 'ejs');

const DBConfig = {
    user: 'admUser',
    password: 'password',
    server: 'WINDOWS-25B0042',  
    database: 'testdata', 
    options:{
        instanceName:'SQLEXPRESS'
    }
}

try{
    sql.connect(DBConfig);
    console.log("connected to db...");
}
catch(error){
    console.log(error);
}

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

//routes for pages - need .ejs pages
app.get('/',function(request,response){
    response.render('../public/index');
})
app.get('/fighterCatalogue',function(request,response){
    response.render('../public/fightercatalogue');
})
app.get('/fighterCard/:boxerName',function(request,response){
    var boxerName = request.params.boxerName;
    var pathToCard = path.resolve(__dirname+'../../public/fightercard.html');
    console.log(boxerName);
    response.render('../public/fightercard',{boxer: boxerName});
})


//data
app.get('/getUpcomingFights', function(request,response){
    
        request = new sql.Request();
        request.query('select FightLocation,FightDate,FightDivision from UpcomingFights', function (err, recordset){
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

app.get('/getUpcomingFighterLastFiveFightsA/:boxerName',async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare(' select top (5) b.FightDate, b.OpponentName, b.FightResult'
                +' from BoxerFightHistory b'
                +' inner join UpcomingFights u on u.BoxerAID = b.BoxerID'
                +' inner join Boxer c on c.BoxerId = u.BoxerAID where c.BoxerName = @boxerName'
                +' order by FightDate desc',async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getUpcomingFighterLastFiveFightsB/:boxerName',async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare(' select top (5) b.FightDate, b.OpponentName, b.FightResult'
                +' from BoxerFightHistory b'
                +' inner join UpcomingFights u on u.BoxerBID = b.BoxerID'
                +' inner join Boxer c on c.BoxerId = u.BoxerBID where c.BoxerName = @boxerName'
                +' order by FightDate desc',async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getRandomFighterImages',function(request,response){

    request = new sql.Request();
    request.query('SELECT * FROM BoxerImage' 
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
app.get('/getAllBoxers',function(request,response){

    request = new sql.Request();
    request.query('select b.BoxerName from Boxer b order by BoxerName asc', function(err, recordset){
        if(err)
        {
            console.log(err);
        }
        response.send(recordset);
    })
})
async function checkForIllegals(queryParam){
    var illegalCharacterArray = [';','--','"',"'",'drop','table','database'];

    for(var key in illegalCharacterArray){
        if(queryParam.includes(illegalCharacterArray[key]) === true){
            queryParam = '';
            break;
        }
    }
    return queryParam;
}
app.get('/getBoxerStats/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select s.Alias, s.Age, s.Height, s.Reach, s.Division, s.Nationality from BoxerStats s'
                +' inner join Boxer b'
                +' on b.BoxerId = s.BoxerID'
                +' where b.BoxerName = @boxerName', async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getBoxerCountryFlag/:boxerNationality', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerNationality = request.params.boxerNationality;
    var illegalValue = await checkForIllegals(boxerNationality);

    ps.input('boxerNationality', sql.VarChar);
    ps.prepare('select c.CountryFlagRef'
                +' from CountryFlags c'
                +' inner join BoxerStats s'
                +' on c.CountryId = s.CountryFlagId'
                +' where Nationality = @boxerNationality', async function(err){
                    ps.execute({boxerNationality: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getBoxerImage/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select i.BoxerImageReference from BoxerImage i'
                  +' inner join Boxer b'
                  +' on b.BoxerId = i.BoxerID'
                  +' where b.BoxerName = @boxerName', async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getBoxerRecord/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select s.TotalWins, s.TotalWinsKO, s.TotalLosses, s.TotalDraws from BoxerRecord s'
                +' inner join Boxer b'
                +' on b.BoxerId = s.BoxerID'
                +' where b.BoxerName = @boxerName', async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/getBoxerFightHistory/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select f.FightDate, f.FightWeight, f.OpponentName, f.OpponentRecord, f.FightLocation, f.FightResult from BoxerFightHistory f'
                +' inner join Boxer b'
                +' on b.BoxerId = f.BoxerID'
                +' where b.BoxerName = @boxerName', async function(err){
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });
})
app.get('/sortBoxerCatalogue/:sortCriteria/:primaryWeight/:primaryGender',async function(request,response){
    const ps = new sql.PreparedStatement()
    var sortCriteria = request.params.sortCriteria;
    var primaryWeight = request.params.primaryWeight;
    var primaryGender = request.params.primaryGender;

    var illegalValuesortCriteria  = await checkForIllegals(sortCriteria);
    var illegalValueprimaryWeight  = await checkForIllegals(primaryWeight);    
    var illegalValueprimaryGender  = await checkForIllegals(primaryGender);  

    request = new sql.Request();
    if(illegalValueprimaryWeight !== 'All weights'){
        if(illegalValuesortCriteria === 'Alphabetical'){
            ps.input('primaryWeight', sql.VarChar);
            ps.input('primaryGender', sql.VarChar);
            ps.prepare('select b.BoxerName' 
                         +' from Boxer b'
                         +' inner join BoxerStats s'
                         +' on b.BoxerId = s.BoxerID'
                         +' where s.Division = @primaryWeight and s.Gender = @primaryGender'
                         +' order by b.BoxerName asc', function(err, recordset){
                             ps.execute({primaryWeight: illegalValueprimaryWeight, primaryGender: illegalValueprimaryGender}, async function(err, recordset){
                                ps.unprepare(async function(err){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                });
                                response.send(recordset);  
                            });               
            });        
        }
        if(illegalValuesortCriteria === 'Ranking'){
            //need think about how ranking will work in db     
        }    
        if(illegalValuesortCriteria === 'Random'){
            ps.input('primaryWeight', sql.VarChar);
            ps.input('primaryGender', sql.VarChar);
            ps.prepare('select b.BoxerName' 
                         +' from Boxer b'
                         +' inner join BoxerStats s'
                         +' on b.BoxerId = s.BoxerID'
                         +' where s.Division = @primaryWeight and s.Gender = @primaryGender'
                         +' order by newid()', function(err, recordset){
                             ps.execute({primaryWeight: illegalValueprimaryWeight, primaryGender: illegalValueprimaryGender}, async function(err, recordset){
                                ps.unprepare(async function(err){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                });
                                response.send(recordset);  
                            });               
            });               
        }
    }
    else{
        if(illegalValuesortCriteria === 'Alphabetical'){
            ps.input('primaryGender', sql.VarChar);
            ps.prepare('select b.BoxerName' 
                         +' from Boxer b'
                         +' inner join BoxerStats s'
                         +' on b.BoxerId = s.BoxerID'
                         +' where s.Gender = @primaryGender'
                         +' order by b.BoxerName asc', function(err, recordset){
                             ps.execute({primaryGender: illegalValueprimaryGender}, async function(err, recordset){
                                ps.unprepare(async function(err){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                });
                                response.send(recordset);  
                            });               
            });       
        }
        if(illegalValuesortCriteria === 'Ranking'){
            //need think about how ranking will work in db     
        }    
        if(illegalValuesortCriteria === 'Random'){
            ps.input('primaryGender', sql.VarChar);
            ps.prepare('select b.BoxerName' 
                         +' from Boxer b'
                         +' inner join BoxerStats s'
                         +' on b.BoxerId = s.BoxerID'
                         +' where s.Gender = @primaryGender'
                         +' order by newid()', function(err, recordset){
                             ps.execute({primaryGender: illegalValueprimaryGender}, async function(err, recordset){
                                ps.unprepare(async function(err){
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                });
                                response.send(recordset);  
                            });               
            });                       
        }       
    }
})