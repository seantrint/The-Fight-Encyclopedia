var upcomingFightCount = 0;
var isGrid = true;
var isList = false;
var countriesArray = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","UK","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe", "USA"];
//add error handling
async function loadUpcomingFightsData(){
    const upcomingFights = await fetch('/getUpcomingFights');
    const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
    const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
    const upcomingFightsStats = await fetch('/getUpcomingFighterStats');    
    const upcomingFightsImages = await fetch('/getUpcomingFighterImages');    
    var upcomingFightsData = await upcomingFights.json();
    var upcomingFightsNamesData = await upcomingFightsNames.json();
    var upcomingFightsRecordsData = await upcomingFightsRecords.json();
    var upcomingFightsStatsData = await upcomingFightsStats.json();
    var upcomingFightsImagesData = await upcomingFightsImages.json();   

    //must be a way to make this .textcontent code more efficient, i.e. some kind of loop to go through all fields with 
    //the same class name and append the right recordset to each?

    //heading
    for (var key in upcomingFightsData.recordset) {
        for (var key1 in upcomingFightsData.recordset[key]) {
        }
    }
    document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[0].FightDivision;
    document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[0].FightLocation;
    document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[0].FightDate;
    document.getElementById('upComingFightName').textContent  = upcomingFightsNamesData.recordset[0].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[0].BoxerName[1];
    
    //names
    document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[1];
    
    var fighterAName = document.getElementById('fighterAName').textContent;
    var fighterBName = document.getElementById('fighterBName').textContent;


    //overall records
    document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[0].TotalWins[0];
    document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].TotalLosses[0];
    document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].TotalDraws[0];
    document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[0].TotalWins[1];
    document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].TotalLosses[1];
    document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].TotalDraws[1];
    
    //stats - replace with loop
    document.getElementById('fighterAAge').textContent = upcomingFightsStatsData.recordset[0].Age[0];
    document.getElementById('fighterBAge').textContent = upcomingFightsStatsData.recordset[0].Age[1];
    document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[0].Height[0];
    document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[0].Height[1];
    document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[0].Reach[0];
    document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[0].Reach[1];
    document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[0].Nationality[0];
    document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[0].Nationality[1];

    //images
    document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[0].BoxerImageReference[0];
    document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[0].BoxerImageReference[1];

    //last 5 fights
    const upcomingFightsLastFiveA = await fetch('/getUpcomingFighterLastFiveFightsA/'+fighterAName);
    var upcomingFightsLastFiveDataA = await upcomingFightsLastFiveA.json();
    const upcomingFightsLastFiveB = await fetch('/getUpcomingFighterLastFiveFightsB/'+fighterBName);
    var upcomingFightsLastFiveDataB = await upcomingFightsLastFiveB.json();

    var i = 0;
    var j = 0;
    for (var key in upcomingFightsLastFiveDataA.recordset) {
        for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
            var testDiv = document.createElement('div');
            testDiv.className = 'last5gridChild';
            testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
            testDiv.id = "Last5GridAChild"+i;
            if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                testDiv.style.backgroundColor = 'green';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Draw'){
                testDiv.style.backgroundColor = '#2d545e';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                testDiv.style.backgroundColor = '#CE2029';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            document.getElementById('Last5gridA').appendChild(testDiv);
            i++;
        }
    }
    for (var key in upcomingFightsLastFiveDataB.recordset) {
        for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
            var testDiv = document.createElement('div');
            testDiv.className = 'last5gridChild';
            testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
            testDiv.id = 'Last5GridBChild'+j;
            if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                testDiv.style.backgroundColor = 'green';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Draw'){
                testDiv.style.backgroundColor = '#2d545e';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                testDiv.style.backgroundColor = '#CE2029';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            document.getElementById('Last5gridB').appendChild(testDiv);
            j++;
        }
    }

}
async function fetchLayoutPage(){
    const response = await fetch('/layout.html');
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
        homeLink.style.display = 'none';
        await loadUpcomingFightsData();
        await addImagesToFighterPreviewBox();
    }
    if (docTitle == "Fighter Catalogue") {
        fighterCatalogueLink.style.display = 'none';
        await loadFighterCatalogue();
    }
    if(docTitle == "Fighter Card"){
        await loadFighterCard();
    }
}
async function loadFighterCard(){
    var boxerName = document.getElementById('boxerName').textContent;

    const boxerStats = await fetch('/getBoxerStats/'+boxerName);
    const boxerImage = await fetch('/getBoxerImage/'+boxerName);
    const boxerRecord = await fetch('/getBoxerRecord/'+boxerName);
    const boxerFightHistory = await fetch('/getBoxerFightHistory/'+boxerName);
    var boxerStatsData = await boxerStats.json();
    var boxerImageData = await boxerImage.json();
    var boxerRecordData = await boxerRecord.json();
    var boxerFightHistoryData = await boxerFightHistory.json();

    const boxerCountryFlag = await fetch ('/getBoxerCountryFlag/'+boxerStatsData.recordset[0].Nationality);
    var boxerCountryFlagData = await boxerCountryFlag.json();
    var countryFlagImg = document.createElement('img');
    countryFlagImg.className = 'countryflagfightercard';
    countryFlagImg.src = boxerCountryFlagData.recordset[0].CountryFlagRef;
    countryFlagImg.style.height = '15px';
    countryFlagImg.style.verticalAlign = 'middle';


    var imagepath = '/'+boxerImageData.recordset[0].BoxerImageReference;

    document.getElementById('fighterInfoImage').src = imagepath;
    var i = 0;
    var j = 0;
    //stats
    for (var key in boxerStatsData.recordset) {
        for (var key1 in boxerStatsData.recordset[key]) {
            console.log(boxerStatsData.recordset[key][key1]);
            var testDiv = document.createElement('div');
            testDiv.className = 'fighterinfostatsspaceContent';
            testDiv.textContent = boxerStatsData.recordset[key][key1];
            testDiv.id = 'fighterInfoStatsspaceContent'+i;
            if(countriesArray.includes(testDiv.textContent)){
                testDiv.appendChild(countryFlagImg);
            }
            testDiv.style.gridRow = i+1;
            i++;
            document.getElementById('fighterInfoStatsSpace').appendChild(testDiv);
        }
    }

    //overall record
    document.getElementById('fighterInfoWins').textContent = boxerRecordData.recordset[0].TotalWins+' ('+boxerRecordData.recordset[0].TotalWinsKO+' KOs)';
    document.getElementById('fighterInfoLosses').textContent = boxerRecordData.recordset[0].TotalLosses;
    document.getElementById('fighterInfoDraws').textContent = boxerRecordData.recordset[0].TotalDraws;

    //fight history
    for (var key in boxerFightHistoryData.recordset) {
        for (var key1 in boxerFightHistoryData.recordset[key]) {
            var testDiv = document.createElement('div');
            testDiv.className = 'fighterinfohistoryspaceContent';
            testDiv.textContent = boxerFightHistoryData.recordset[key][key1];
            if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                testDiv.style.backgroundColor = 'green';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Draw'){
                testDiv.style.backgroundColor = '#2d545e';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                testDiv.style.backgroundColor = '#CE2029';
                //testDiv.style.width = '50%';
                testDiv.style.textAlign = 'center';
            }
            testDiv.id = 'fighterInfoHistoryspaceContent'+j;
            document.getElementById('fighterInfoHistorySpace').appendChild(testDiv);
        }
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
async function start() {
    await fetchLayoutPage();
}
function openMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    var z = document.getElementById("searchField");
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
    if(upcomingFightCount !=2){
        const upcomingFights = await fetch('/getUpcomingFights');
        const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
        const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
        const upcomingFightsStats = await fetch('/getUpcomingFighterStats');    
        const upcomingFightsImages = await fetch('/getUpcomingFighterImages');    
        var upcomingFightsData = await upcomingFights.json();
        var upcomingFightsNamesData = await upcomingFightsNames.json();
        var upcomingFightsRecordsData = await upcomingFightsRecords.json();
        var upcomingFightsStatsData = await upcomingFightsStats.json();
        var upcomingFightsImagesData = await upcomingFightsImages.json();   
    
        upcomingFightCount++;
    
        //heading
        document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[upcomingFightCount].FightLocation;
        document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDivision;
        document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDate;
        document.getElementById('upComingFightName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];
    
    
        //names
        document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
        document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];
        var fighterAName = document.getElementById('fighterAName').textContent;
        var fighterBName = document.getElementById('fighterBName').textContent;

        //overall records
        document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[0];
        document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[0];
        document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[0];
        document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[1];
        document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[1];
        document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[1];   
    
        //stats
        document.getElementById('fighterAAge').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Age[0];
        document.getElementById('fighterBAge').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Age[1];
        document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[0];
        document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[1];
        document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[0];
        document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[1];
        document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0];
        document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1];
    
        //images
        document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[0];
        document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[1];
    
        //last 5 fights
        const upcomingFightsLastFiveA = await fetch('/getUpcomingFighterLastFiveFightsA/'+fighterAName);
        var upcomingFightsLastFiveDataA = await upcomingFightsLastFiveA.json();
        const upcomingFightsLastFiveB = await fetch('/getUpcomingFighterLastFiveFightsB/'+fighterBName);
        var upcomingFightsLastFiveDataB = await upcomingFightsLastFiveB.json();
        var i=0;
        var j=0;

        for (var key in upcomingFightsLastFiveDataA.recordset) {
            for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
                var testDiv = document.getElementById('Last5GridAChild'+i);
                testDiv.className = 'last5gridChild';
                testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                    testDiv.style.backgroundColor = 'green';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Draw'){
                    testDiv.style.backgroundColor = '#2d545e';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                    testDiv.style.backgroundColor = '#CE2029';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                i++;
            }
        }
        for (var key in upcomingFightsLastFiveDataB.recordset) {
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testDiv = document.getElementById('Last5GridBChild'+j);
                testDiv.className = 'last5gridChild';
                testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                    testDiv.style.backgroundColor = 'green';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Draw'){
                    testDiv.style.backgroundColor = '#2d545e';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                    testDiv.style.backgroundColor = '#CE2029';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                j++;
            }
        }
    }
}
async function previousFight(){
    if(upcomingFightCount != 0){
        const upcomingFights = await fetch('/getUpcomingFights');
        const upcomingFightsNames = await fetch('/getUpcomingFighterNames');
        const upcomingFightsRecords = await fetch('/getUpcomingFighterRecords');    
        const upcomingFightsStats = await fetch('/getUpcomingFighterStats');    
        const upcomingFightsImages = await fetch('/getUpcomingFighterImages');    
        var upcomingFightsData = await upcomingFights.json();
        var upcomingFightsNamesData = await upcomingFightsNames.json();
        var upcomingFightsRecordsData = await upcomingFightsRecords.json();
        var upcomingFightsStatsData = await upcomingFightsStats.json();
        var upcomingFightsImagesData = await upcomingFightsImages.json();   

        upcomingFightCount--;
    
        //heading
        document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[upcomingFightCount].FightLocation;
        document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDivision;
        document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[upcomingFightCount].FightDate;
        document.getElementById('upComingFightName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];

        //names
        document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
        document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];    
        var fighterAName = document.getElementById('fighterAName').textContent;
        var fighterBName = document.getElementById('fighterBName').textContent;

        //overall records
        document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[0];
        document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[0];
        document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[0];
        document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalWins[1];
        document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalLosses[1];
        document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].TotalDraws[1];   
        
        //stats
        document.getElementById('fighterAAge').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Age[0];
        document.getElementById('fighterBAge').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Age[1];
        document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[0];
        document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[1];
        document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[0];
        document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[1];
        document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0];
        document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1];

        //images
        document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[0];
        document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[1];
        
        //last 5 fights
        const upcomingFightsLastFiveA = await fetch('/getUpcomingFighterLastFiveFightsA/'+fighterAName);
        var upcomingFightsLastFiveDataA = await upcomingFightsLastFiveA.json();
        const upcomingFightsLastFiveB = await fetch('/getUpcomingFighterLastFiveFightsB/'+fighterBName);
        var upcomingFightsLastFiveDataB = await upcomingFightsLastFiveB.json();
        var i=0;
        var j=0;

        for (var key in upcomingFightsLastFiveDataA.recordset) {
            for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
                var testDiv = document.getElementById('Last5GridAChild'+i);
                testDiv.className = 'last5gridChild';
                testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                    testDiv.style.backgroundColor = 'green';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Draw'){
                    testDiv.style.backgroundColor = '#2d545e';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                    testDiv.style.backgroundColor = '#CE2029';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                i++;
            }
        }
        for (var key in upcomingFightsLastFiveDataB.recordset) {
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testDiv = document.getElementById('Last5GridBChild'+j);
                testDiv.className = 'last5gridChild';
                testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                if(testDiv.textContent === 'Win (TKO)' || testDiv.textContent === 'Win (KO)' || testDiv.textContent === 'Win (UD)' || testDiv.textContent === 'Win (MD)' || testDiv.textContent === 'Win (SD)'){
                    testDiv.style.backgroundColor = 'green';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Draw'){
                    testDiv.style.backgroundColor = '#2d545e';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                if(testDiv.textContent === 'Loss (TKO)' || testDiv.textContent === 'Loss (KO)' || testDiv.textContent === 'Loss (UD)' || testDiv.textContent === 'Loss (MD)' || testDiv.textContent === 'Loss (SD)'){
                    testDiv.style.backgroundColor = '#CE2029';
                    //testDiv.style.width = '50%';
                    testDiv.style.textAlign = 'center';
                }
                j++;
            }
        }        
    }
}
async function addImagesToFighterPreviewBox(){
    const randomFighterImages = await fetch('/getRandomFighterImages');    
    var randomFighterImagesData = await randomFighterImages.json();

    for(var i =0;i <8;i++ ){
        //elements seem to start filling from center and work their way left
        //also need anchor tag here?
        var testImage = document.createElement('img');
        testImage.setAttribute('src',randomFighterImagesData.recordset[i].BoxerImageReference);
        testImage.className = 'featuredfighterimg';   
        document.getElementById('FeaturedFighterImages').appendChild(testImage);       
    }

}
async function loadFighterCatalogueAsGrid(fighterCatalogueData){
    await clearCatalogue();
    var i =0;
    //load catalogue as grid
    for (var key in fighterCatalogueData.recordset) {
        for (var key1 in fighterCatalogueData.recordset[key]) {
            const fighterImageApi = await fetch('/getBoxerImage/'+fighterCatalogueData.recordset[key][key1]);
            var fighterImageApiData = await fighterImageApi.json();

            var catalogueEntryDiv = document.createElement('div');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            linkToCard.id = 'linktocardid'+i;
            nameParagraph.textContent = fighterCatalogueData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;
            fighterImage.className = 'catalogueimage';
            fighterImage.src = fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;
            
            linkToCard.appendChild(fighterImage);
            linkToCard.appendChild(nameParagraph);
            linkToCard.style.cursor = 'pointer';
            
            linkToCard.onclick = async function(divId){
                divId = this.id;
                var boxerName = document.getElementById(divId).textContent;
                window.location.href = 'fighterCard/'+boxerName;
            }
            catalogueEntryDiv.className = 'catalogueentry';
            catalogueEntryDiv.id = 'catalogueentry'+i;
            catalogueEntryDiv.appendChild(linkToCard);
            
            document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);       
            i++; 
        }
    }
}
async function loadFighterCatalogueAsList(fighterCatalogueData){
    await clearCatalogue();
    var i =0;
    var numberList = 1;
    var catalogueTable = document.createElement('table');
    catalogueTable.id = 'CatalogueTable';
    catalogueTable.className = 'cataloguetable'
    document.body.appendChild(catalogueTable);

    //load catalogue as list
    for (var key in fighterCatalogueData.recordset) {
        for (var key1 in fighterCatalogueData.recordset[key]) {

            const fighterStats = await fetch('/getBoxerStats/'+fighterCatalogueData.recordset[key][key1]);
            var fighterStatsData = await fighterStats.json();

            const fighterCountryFlag = await fetch('/getBoxerCountryFlag/'+fighterStatsData.recordset[0].Nationality)
            var fighterCountryFlagData = await fighterCountryFlag.json();

            const fighterRecord = await fetch('/getBoxerRecord/'+fighterCatalogueData.recordset[key][key1])
            var fighterRecordData = await fighterRecord.json();

            var tableRow = document.createElement('tr');
            var tableData = document.createElement('td');
            var tableData2 = document.createElement('td');
            var countryFlagImg = document.createElement('img')
            var nameParagraph = document.createElement('p');
            var recordParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            tableRow.id ='CatalogueTableRowId'+i;
            linkToCard.id = fighterCatalogueData.recordset[key][key1];
            linkToCard.className = 'linktofightercataloguetable'

            tableData2.className='cataloguetablerecord';

            nameParagraph.textContent = numberList +'.'+' '+fighterCatalogueData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;

            if(countriesArray.includes(fighterStatsData.recordset[0].Nationality)){
                countryFlagImg.src=fighterCountryFlagData.recordset[0].CountryFlagRef;
                countryFlagImg.className = 'countryflagimgcatalogue';
                nameParagraph.appendChild(countryFlagImg);
            }

            // var wins = document.createElement('span');
            // wins.textContent=fighterRecordData.recordset[0].TotalWins;
            // wins.style.color='green';

            // var losses = document.createElement('span');
            // losses.textContent = fighterRecordData.recordset[0].TotalLosses;
            // losses.style.color='#CE2029';

            // var draws = document.createElement('span');
            // draws.textContent=fighterRecordData.recordset[0].TotalDraws;
            // draws.style.color='#2d545e';

            // recordParagraph.textContent = wins.textContent +'/'+losses.textContent+'/'+draws.textContent;
            // tableData2.appendChild(recordParagraph);

            linkToCard.appendChild(nameParagraph);
            
            linkToCard.onclick = async function(divId){
                divId = this.id;
                var boxerName = document.getElementById(divId).id;
                window.location.href = 'fighterCard/'+boxerName;
            }

            tableData.appendChild(linkToCard);
            tableRow.appendChild(tableData);
            tableRow.className = 'cataloguetablerow';
            catalogueTable.appendChild(tableRow);

            i++; 
            numberList++;
        }
    }    
}
async function loadFighterCatalogue(param){
    var currentSortingFilter = document.getElementById("currentFilter").innerHTML;
    var currentWeightFilter = document.getElementById("currentWeightFilter").innerHTML;
    var currentGenderFilter = document.getElementById("currentGenderFilter").innerHTML;
    const fighterCatalogue = await fetch('/sortBoxerCatalogue/'+currentSortingFilter+'/'+currentWeightFilter+'/'+currentGenderFilter);
    var fighterCatalogueData = await fighterCatalogue.json();

    if(param === undefined ){
        //load catalogue as grid
        await loadFighterCatalogueAsGrid(fighterCatalogueData);
    }
    else{
        if(document.getElementById(param).id === 'GridViewButton'){
            //load catalogue as grid
            isGrid = true;
            isList = false;
            await loadFighterCatalogueAsGrid(fighterCatalogueData);
        }
        if(document.getElementById(param).id === 'ListViewButton'){
            //load catalogue as list
            isGrid = false;
            isList = true;
            await loadFighterCatalogueAsList(fighterCatalogueData);
        }
    }
   
}
async function navigateToFighterCard(divId){
    var boxerName = divId.textContent;
    window.location.href = 'fighterCard/'+boxerName;
}
function showFilterMenu() {
    var x = document.getElementById("filterMenu");
    var y = document.getElementById("filterWeightMenu");
    var z = document.getElementById("filterGenderMenu");

    if ( window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        x.style.display = 'block';  
    } 
    else {
        x.style.display = 'none';
    }
    y.style.display = "none";
    z.style.display = "none";

}
function closeFilterMenu() {
    var x = document.getElementById("filterMenu");
    x.style.display = "none";
}

async function filterAlphabeticalRankingRandom(id) {
    var currentSortingFilter = document.getElementById("currentFilter");
    var selectedSortingFilter = document.getElementById(id);
    var currentWeightFilter = document.getElementById("currentWeightFilter").innerHTML;
    currentSortingFilter.innerHTML = selectedSortingFilter.innerHTML;
    var currentGenderFilter = document.getElementById("currentGenderFilter").innerHTML;

    const sortSelection = await fetch('/sortBoxerCatalogue/'+selectedSortingFilter.innerHTML+'/'+currentWeightFilter+'/'+currentGenderFilter);
    var sortSelectionData = await sortSelection.json();
    var i =0;

    //remove existing elements
    await clearCatalogue();
    if(isGrid){
        await loadFighterCatalogueAsGrid(sortSelectionData);
    }
    if(isList){
        await loadFighterCatalogueAsList(sortSelectionData);
    }
    closeFilterMenu();
}
window.onscroll = function ()
{
    TriggerJumpToTopButton()
};

function TriggerJumpToTopButton() {
    var x = document.getElementById("jumpToTopButton");
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function jumpToTop() {
    window.pageYOffset = 0; document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
}
function showWeightFilterMenu() {
    var x = document.getElementById("filterWeightMenu");
    var y = document.getElementById("filterMenu");
    var z = document.getElementById("filterGenderMenu");
    if ( window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
    y.style.display = "none";
    z.style.display = "none";
}
function closeWeightFilterMenu() {
    var x = document.getElementById("filterWeightMenu");
    x.style.display = "none";
}
async function clearCatalogue(){
    var z = document.getElementsByClassName('catalogueentry');
    var y = document.getElementsByClassName('cataloguetablerow');
    var elemId='';
    if(typeof z != undefined){
        for (var j =0; j < z.length; j+1){
            elemId = document.getElementById(z[j].id);
            elemId.remove();
        }
    }
    if(typeof y != undefined){
        for (var j =0; j < y.length; j+1){
            elemId = document.getElementById(y[j].id);
            elemId.remove();
        }
    }
}
async function filterWeightClass(id) {
    var currentWeightFilter = document.getElementById("currentWeightFilter");
    var selectedWeightFilter = document.getElementById(id);
    var currentSortingFilter = document.getElementById("currentFilter").innerHTML;
    currentWeightFilter.innerHTML = selectedWeightFilter.innerHTML;
    var currentGenderFilter = document.getElementById("currentGenderFilter").innerHTML;

    const filteredWeight = await fetch('/sortBoxerCatalogue/'+currentSortingFilter+'/'+selectedWeightFilter.innerHTML+'/'+currentGenderFilter);
    var filteredWeightData = await filteredWeight.json();
    var i=0;

    
    //delete existing elements
    await clearCatalogue();

    if(isGrid){
        await loadFighterCatalogueAsGrid(filteredWeightData);
    }
    if(isList){
        await loadFighterCatalogueAsList(filteredWeightData);
    }
    closeWeightFilterMenu();
}
function showGenderFilterMenu() {
    var x = document.getElementById("filterGenderMenu");
    var y = document.getElementById("filterMenu");
    var z = document.getElementById("filterWeightMenu");
    if ( window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
    y.style.display = "none";
    z.style.display = "none";
}
function closeGenderFilterMenu() {
    var x = document.getElementById("filterGenderMenu");
    x.style.display = "none";
}
async function filterGender(id) {
    var currentGenderFilter = document.getElementById("currentGenderFilter");
    var selectedGenderFilter = document.getElementById(id);
    currentGenderFilter.innerHTML = selectedGenderFilter.innerHTML;
    var currentWeightFilter = document.getElementById("currentWeightFilter").innerHTML;
    var currentSortingFilter = document.getElementById("currentFilter").innerHTML;

    const filteredGender = await fetch('/sortBoxerCatalogue/'+currentSortingFilter+'/'+currentWeightFilter+'/'+selectedGenderFilter.innerHTML);
    var filteredGenderData = await filteredGender.json();

  
    //delete existing elements
    await clearCatalogue();
    if(isGrid){
        await loadFighterCatalogueAsGrid(filteredGenderData);
    }
    if(isList){
        await loadFighterCatalogueAsList(filteredGenderData);
    }
    closeGenderFilterMenu();
}