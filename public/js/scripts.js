var upcomingFightCount = 0;

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
    console.log(upcomingFightsData.recordset);
    for (var key in upcomingFightsData.recordset) {
        for (var key1 in upcomingFightsData.recordset[key]) {
            console.log(upcomingFightsData.recordset[key][key1]);
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
    
    //stats
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
            testDiv.className = 'last5gridAChild';
            testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
            testDiv.id = "Last5GridAChild"+i;
            document.getElementById('Last5gridA').appendChild(testDiv);
            i++;
        }
    }
    for (var key in upcomingFightsLastFiveDataB.recordset) {
        for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
            var testDiv = document.createElement('div');
            testDiv.className = 'last5gridBChild';
            testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
            testDiv.id = 'Last5GridBChild'+j;
            j++;
            document.getElementById('Last5gridB').appendChild(testDiv);
        }
    }

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
        await addImagesToFighterPreviewBox();
    }
    else if (docTitle == "Fighter Catalogue") {
        fighterCatalogueLink.style.display = 'none';
        await loadFighterCatalogue();
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
        console.log(fighterAName+" , "+fighterBName);

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
                testDiv.className = 'last5gridAChild';
                testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                i++;
            }
        }
        for (var key in upcomingFightsLastFiveDataB.recordset) {
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testDiv = document.getElementById('Last5GridBChild'+j);
                testDiv.className = 'last5gridBChild';
                testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                j++;
            }
        }
    }
    console.log(upcomingFightCount);
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
        console.log(fighterAName+" , "+fighterBName);

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
                testDiv.className = 'last5gridAChild';
                testDiv.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                i++;
            }
        }
        for (var key in upcomingFightsLastFiveDataB.recordset) {
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testDiv = document.getElementById('Last5GridBChild'+j);
                testDiv.className = 'last5gridBChild';
                testDiv.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                j++;
            }
        }        
    }
    console.log(upcomingFightCount);

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
async function loadFighterCatalogue(){
    const fighterCatalogue = await fetch('/getAllBoxers');
    var fighterCatalogueData = await fighterCatalogue.json();

    var i =0;
    for (var key in fighterCatalogueData.recordset) {
        for (var key1 in fighterCatalogueData.recordset[key]) {
            const fighterImageApi = await fetch('/getBoxerImage/'+fighterCatalogueData.recordset[key][key1]);
            var fighterImageApiData = await fighterImageApi.json();

            var catalogueEntryDiv = document.createElement('div');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            linkToCard.href = 'fightercard.html';
            linkToCard.id = 'linktocardid'+i;
            nameParagraph.textContent = fighterCatalogueData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;
            fighterImage.className = 'catalogueimage';
            fighterImage.src = fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;

            linkToCard.appendChild(fighterImage);
            linkToCard.appendChild(nameParagraph);

            catalogueEntryDiv.className = 'catalogueentry';
            catalogueEntryDiv.id = 'catalogueentry'+i;
            catalogueEntryDiv.appendChild(linkToCard);

            document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);       
            i++; 
        }
    }    
}
function showFilterMenu() {
    var x = document.getElementById("filterMenu");
    var y = document.getElementById("filterWeightMenu");
    var z = document.getElementById("filterGenderMenu");

    if ( window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        x.style.display = 'block';
    } else {
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
    
    const sortSelection = await fetch('/sortBoxerCatalogue/'+selectedSortingFilter.innerHTML+'/'+currentWeightFilter);
    var sortSelectionData = await sortSelection.json();
    var i =0;

    //remove existing elements
    await clearCatalogue();

    for (var key in sortSelectionData.recordset) {
        for (var key1 in sortSelectionData.recordset[key]) {
            const fighterImageApi = await fetch('/getBoxerImage/'+sortSelectionData.recordset[key][key1]);
            var fighterImageApiData = await fighterImageApi.json();

            var catalogueEntryDiv = document.createElement('div');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            linkToCard.href = 'fightercard.html';
            linkToCard.id = 'linktocardid'+i;
            nameParagraph.textContent = sortSelectionData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;
            fighterImage.className = 'catalogueimage';
            fighterImage.src = fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;

            linkToCard.appendChild(fighterImage);
            linkToCard.appendChild(nameParagraph);

            catalogueEntryDiv.className = 'catalogueentry';
            catalogueEntryDiv.id = 'catalogueentry'+i;
            catalogueEntryDiv.appendChild(linkToCard);

            document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);       
            i++; 
        }     
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
    var elemId='';

    for (var j =0; j < z.length; j+1){
        elemId = document.getElementById(z[j].id);
        elemId.remove();
    }
}
async function filterWeightClass(id) {
    var currentWeightFilter = document.getElementById("currentWeightFilter");
    var selectedWeightFilter = document.getElementById(id);
    var currentSortingFilter = document.getElementById("currentFilter").innerHTML;
    currentWeightFilter.innerHTML = selectedWeightFilter.innerHTML;

    const filteredWeight = await fetch('/sortBoxerCatalogue/'+currentSortingFilter+'/'+selectedWeightFilter.innerHTML);
    var filteredWeightData = await filteredWeight.json();
    var i=0;

    
    //delete existing elements
    await clearCatalogue();

    //all weights
    for (var key in filteredWeightData.recordset) {
        for (var key1 in filteredWeightData.recordset[key]) {
            const fighterImageApi = await fetch('/getBoxerImage/'+filteredWeightData.recordset[key][key1]);
            var fighterImageApiData = await fighterImageApi.json();

            var catalogueEntryDiv = document.createElement('div');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            linkToCard.href = 'fightercard.html';
            linkToCard.id = 'linktocardid'+i;
            nameParagraph.textContent = filteredWeightData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;
            fighterImage.className = 'catalogueimage';
            fighterImage.src = fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;

            linkToCard.appendChild(fighterImage);
            linkToCard.appendChild(nameParagraph);

            catalogueEntryDiv.className = 'catalogueentry';
            catalogueEntryDiv.id = 'catalogueentry'+i;
            catalogueEntryDiv.appendChild(linkToCard);

            document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);       
            i++; 
        }     
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

    const filteredGender = await fetch('/filterCatalogueByGender/'+selectedGenderFilter.innerHTML);
    var filteredGenderData = await filteredGender.json();
    var i=0;
  
    //delete existing elements
    await clearCatalogue();
    for (var key in filteredGenderData.recordset) {
        for (var key1 in filteredGenderData.recordset[key]) {
            const fighterImageApi = await fetch('/getBoxerImage/'+filteredGenderData.recordset[key][key1]);
            var fighterImageApiData = await fighterImageApi.json();

            var catalogueEntryDiv = document.createElement('div');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            linkToCard.href = 'fightercard.html';
            linkToCard.id = 'linktocardid'+i;
            nameParagraph.textContent = filteredGenderData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;
            fighterImage.className = 'catalogueimage';
            fighterImage.src = fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;

            linkToCard.appendChild(fighterImage);
            linkToCard.appendChild(nameParagraph);

            catalogueEntryDiv.className = 'catalogueentry';
            catalogueEntryDiv.id = 'catalogueentry'+i;
            catalogueEntryDiv.appendChild(linkToCard);

            document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);       
            i++; 
            }     
        }
    closeGenderFilterMenu();
}