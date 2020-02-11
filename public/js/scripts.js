var upcomingFightCount = 0;

async function loadUpcomingFightsData(){
    const upcomingFights = await fetch('/getUpcomingFights');
    const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
    const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
    var upcomingFightsData = await upcomingFights.json();
    var upcomingFightsNamesData = await upcomingFightsNames.json();
    var upcomingFightsRecordsData = await upcomingFightsRecords.json();
   
    
    //heading
    document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[0].FightDivision;
    document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[0].FightLocation;
    document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[0].FightDate;
    document.getElementById('upComingFightName').textContent  = upcomingFightsNamesData.recordset[0].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[0].BoxerName[1];
    
    //names
    document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[1];
    
    //overall records
    document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[0].TotalWins[0];
    document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].TotalLosses[0];
    document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].TotalDraws[0];
    document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[0].TotalWins[1];
    document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].TotalLosses[1];
    document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].TotalDraws[1];
    
    //stats

    //images

    //last 5 fights
}
async function fetchLayoutPage(){
    //use fetch() to get layout.html as text
    //use DOMParser to parse text to html
    //append html to page, should be able to drop it into an empty <header>  
    const response = await fetch('layout.html');
    const text = await response.text();
    var parser = new DOMParser();
    var header = document.getElementById('pageLayout');
    var sharedLayout = parser.parseFromString(text, ("text/html"));

    header.innerHTML = sharedLayout.documentElement.innerHTML;
    await loadPageName();
}
async function loadPageName() {
    var docTitle = document.title;
    var pageName = document.getElementById("pageName");
    var homeLink = document.getElementById("homeLink");
    var fighterCatalogueLink = document.getElementById("fighterCatalogueLink");

    pageName.innerHTML = docTitle + "&ensp;&#8595;";

    if (docTitle == "Home") {
        console.log("if doctitle = home");
        homeLink.style.display = 'none';
        await loadUpcomingFightsData();
    }
    else if (docTitle == "Fighter Catalogue") {
        fighterCatalogueLink.style.display = 'none';
    }
}

function showMenuLinks() {
    var x = document.getElementById("menuOptions");

    if (window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
function start() {
    fetchLayoutPage();
}
function openMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    x.style.display = ("block");
    y.style.display = ("none");

}
function closeMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    x.style.display = ("none");
    y.style.display = ("block");
}
async function nextFight(){
    const upcomingFights = await fetch('/getUpcomingFights');
    const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
    const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
    var upcomingFightsData = await upcomingFights.json();
    var upcomingFightsNamesData = await upcomingFightsNames.json();
    var upcomingFightsRecordsData = await upcomingFightsRecords.json();

    upcomingFightCount++;

    //heading
    document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[upcomingFightCount].FightLocation;
    document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDivision;
    document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDate;
    document.getElementById('upComingFightName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];

    //names
    document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
    document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];

    //overall records
    document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[0];
    document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[0];
    document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[0];
    document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[1];
    document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[1];
    document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[1];   

    //stats

    //images

    //last 5 fights
}
async function previousFight(){
    const upcomingFights = await fetch('/getUpcomingFights');
    const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
    const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
    var upcomingFightsData = await upcomingFights.json();
    var upcomingFightsNamesData = await upcomingFightsNames.json();
    var upcomingFightsRecordsData = await upcomingFightsRecords.json();

    upcomingFightCount--;

    //heading
    document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[upcomingFightCount].FightLocation;
    document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDivision;
    document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDate;
    document.getElementById('upComingFightName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];

    //names
    document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
    document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];    
    
    //overall records
    document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[0];
    document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[0];
    document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[0];
    document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[1];
    document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[1];
    document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[1];   
    
    //stats

    //images

    //last 5 fights
}
