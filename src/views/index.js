const express = require('express');
const app = express();
const sql = require("mssql");
const config = require("../config");
const routes = require("../routes/index");

function connectToDb(){
    try{
        sql.connect(config);
        console.log("connected to db...");
    }
    catch(error){
        console.log(error);
        //load error page
        response.render('../public/errorpages/dbdown');
    }
}
function closeDbConnection(){
    try{
        sql.close();
        console.log("disconnected from db...");
    }
    catch(error){
        console.log(error);
    }
}
connectToDb();

async function loadDbDownPage(){
    app.use(function(request,response){
        response.render('../public/errorpages/dbdown');
    });
}

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
async function keepConnectionAlive(){

}
app.get('/getSearchResults/:searchTerm', async function(request,response){
    const ps = new sql.PreparedStatement()
    var searchTerm = request.params.searchTerm;
    var illegalValue = await checkForIllegals(searchTerm);
    illegalValue = '%'+illegalValue+'%';
    ps.input('searchTerm', sql.VarChar);
    ps.prepare(' select BoxerName'
                +' from Boxer'
                +' where BoxerName like @searchTerm',async function(err){
                    if(err)
                    {
                        response.send(await loadDbDownPage());
                        console.log(err);
                    }
                    ps.execute({searchTerm: illegalValue}, async function(err, recordset){
                        if(err)
                        {
                            response.send(await loadDbDownPage());
                            console.log(err);
                        }
                        ps.unprepare(async function(err){
                            if(err)
                            {
                                response.send(await loadDbDownPage());
                                console.log(err);
                            }
                        });
                        response.send(recordset);  
                    });
                });                    
})
app.get('/getUpcomingFights', async function(request,response){
    request = new sql.Request();
    request.query('select FightLocation,FightDate,FightDivision from UpcomingFights', async function (err, recordset){
        if(err)
        {
            response.send(await loadDbDownPage());
            console.log(err);
        }
        response.send(recordset);
    })
})

app.get('/getUpcomingFighterNames', async function(request,response){
    request = new sql.Request();
    request.query('select s1.BoxerName, s2.BoxerName from' 
        +'( select b.BoxerName, u.UpcomingFightID'
        +' from Boxer b'
        +' inner join UpcomingFights u on u.BoxerAID = b.BoxerId) s1'
        +' inner join'
        +'(  select b.BoxerName, u.UpcomingFightID'
        +' from Boxer b'
        +' inner join UpcomingFights u on u.BoxerBID = b.BoxerId) s2'
        +' on s1.UpcomingFightID = s2.UpcomingFightID', async function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);
        })  
})

app.get('/getUpcomingFighterRecords',async function(request,response){
    request = new sql.Request();
    request.query('select s1.TotalWins, s1.TotalWinsKO, s1.TotalLosses, s1.TotalDraws, s2.TotalWins, s2.TotalWinsKO, s2.TotalLosses, s2.TotalDraws from'
        +'( select b.TotalWins, b.TotalWinsKO, b.TotalLosses, b.TotalDraws, u.UpcomingFightID'
        +' from BoxerRecord b'
        +' inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +' inner join'
        +' ( select b.TotalWins, b.TotalWinsKO, b.TotalLosses, b.TotalDraws, u.UpcomingFightID'
        +' from BoxerRecord b'
        +' inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +' on s1.UpcomingFightID = s2.UpComingFightID', async function (err, recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })        
})

app.get('/getUpcomingFighterStats',async function(request,response){
    request = new sql.Request();
    request.query('select s1.Age, s1.Height, s1.Reach, s1.Nationality, s2.Age, s2.Height, s2.Reach, s2.Nationality from'
        +'( select b.Age, b.Height, b.Reach, b.Nationality, u.UpcomingFightID'
        +'  from BoxerStats b'
        +'  inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +'  inner join'
        +'( select b.Age, b.Height, b.Reach, b.Nationality, u.UpcomingFightID'
        +'  from BoxerStats b'
        +'  inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +'  on s1.UpcomingFightID = s2.UpComingFightID', async function(err,recordset){
            if(err)
            {
                console.log(err);
            }
            response.send(recordset);  
        })      
})

app.get('/getUpcomingFighterImages',async function(request,response){
    request = new sql.Request();
    request.query('select s1.BoxerImageReference, s2.BoxerImageReference from'
        +'( select b.BoxerImageReference, u.UpcomingFightID'
        +'  from BoxerImage b' 
        +'  inner join UpcomingFights u on u.BoxerAID = b.BoxerID) s1'
        +'  inner join' 
        +'( select b.BoxerImageReference, u.UpcomingFightID'
        +'  from BoxerImage b' 
        +'  inner join UpcomingFights u on u.BoxerBID = b.BoxerID) s2'
        +'  on s1.UpcomingFightID = s2.UpComingFightID', async function(err,recordset){
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
app.get('/getRandomFighterImages',async function(request,response){
    request = new sql.Request();
    request.query('SELECT * FROM BoxerImage' 
    +' WHERE (ABS(CAST'
    +' ((BINARY_CHECKSUM(*) *' 
    +' RAND()) as int)) % 100) < 80'
        ,async function(err,recordset){
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
app.get('/getBoxerStats/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select s.Alias, s.Nationality, s.Age, s.Height, s.Reach, s.Division from BoxerStats s'
                +' inner join Boxer b'
                +' on b.BoxerId = s.BoxerID'
                +' where b.BoxerName = @boxerName', async function(err){
                    if(err){
                        console.log(err);
                    }
                    ps.execute({boxerName: illegalValue}, async function(err, recordset){
                        if(err){
                            console.log(err);
                            response.send("Something went wrong");
                        }
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
                    if(err){
                        console.log(err);
                    }
                    ps.execute({boxerNationality: illegalValue}, async function(err, recordset){
                        if(err){
                            console.log(err);
                            response.send('something went wrong');
                        }
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
app.get('/getBoxerFightHistoryLast5/:boxerName', async function(request,response){
    const ps = new sql.PreparedStatement()
    var boxerName = request.params.boxerName;
    var illegalValue = await checkForIllegals(boxerName);

    ps.input('boxerName', sql.VarChar);
    ps.prepare('select top (5) f.FightDate, f.FightWeight, f.OpponentName, f.OpponentRecord, f.FightLocation, f.FightResult from BoxerFightHistory f'
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
module.exports = app;