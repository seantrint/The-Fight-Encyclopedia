var upcomingFightCount = 0;
var isGrid = true;
var isList = false;
var countriesArray = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","UK","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe", "USA"];
var winsArray = ["Win (UD)", "Win (KO)", "Win (SD)", "Win (MD)", "Win (TKO)", "Win (DQ)", "Win (PTS)"];
var lossArray = ["Loss (UD)", "Loss (KO)", "Loss (SD)", "Loss (MD)", "Loss (TKO)", "Loss (DQ)", "Loss (PTS)"];
var drawArray = ["Draw (MD)", "Draw (SD)", "Draw (PTS)", "Draw (UD)", "Draw"];
var itemsPerCatalogue = 10;
async function numberOfElementsPerPage(){
    if(screen.width >= 640){
        itemsPerCatalogue = 12;
    }
    if(screen.width >= 1250){
        itemsPerCatalogue = 15;
    }  
    if(screen.width >= 1850){
        itemsPerCatalogue = 18;
    }     
}
async function fetchData(route, parameter1 = '', parameter2 = '', parameter3 = '', parameter4 = ''){
    //could this go in server page?
    const request = await fetch(route+parameter1+parameter2+parameter3+parameter4);
    var requestData = request.json();

    return requestData;
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
    if(screen.width >=430){
        await searchOnEnterPress("searchFieldMobileWide", "searchButtonMobileWide");
    }
    if(screen.width >=1024){
        await searchOnEnterPress("searchFieldWideScreen", "searchButtonWideScreen");
    }
    if (docTitle == "Home") {
        homeLink.style.display = 'none';
        await loadUpcomingFightsData();
        await addImagesToFighterPreviewBox();
    }
    if (docTitle == "Fighter Catalogue") {
        fighterCatalogueLink.style.display = 'none';
        await numberOfElementsPerPage();
        await loadFighterCatalogue();
    }
    if(docTitle == "Fighter Card"){
        await loadFighterCard();
    }
    if(docTitle == "Search Results"){
        await loadSearchResults();
    }
}
async function clearSearchResults(){
    var z = document.getElementsByClassName('searchresultsgridchild');
    var elemId='';

    if(typeof z != undefined){
        for (var j =0; j < z.length; j+1){
            elemId = document.getElementById(z[j].id);
            elemId.remove();
        }
    }
    await clearErrors();
}
async function loadSearchResults(){
    document.getElementById("searchFieldWideScreen").style.display = 'none';
    document.getElementById("searchButtonWideScreen").style.display = 'none';
    document.getElementById("searchFieldMobileWide").style.display = 'none';
    document.getElementById("searchButtonMobileWide").style.display = 'none';
    await clearSearchResults();
    var searchTerm = document.getElementById('SearchTerm').textContent;
    var searchResultsData = await fetchData('/getSearchResults/',searchTerm);

    await loadSearch(searchResultsData);
    await searchOnEnterPress("searchField","searchButton");
}
async function loadSearch(searchResultsData){
    var i=0;
    var searchResultsData = searchResultsData;
    for (var key in searchResultsData.recordset) {
        for (var key1 in searchResultsData.recordset[key]) {
            var testDiv = document.createElement('div');
            var searchResultLink = document.createElement('a');
            var fighterImage = document.createElement('img');
            var nameParagraph = document.createElement('p');

            var fighterImageApiData = await fetchData('/getBoxerImage/',searchResultsData.recordset[key][key1]);

            fighterImage.className = 'searchresultsgridchildimg';
            fighterImage.src = '/'+fighterImageApiData.recordset[0].BoxerImageReference;
            fighterImage.id = 'fighterimageid'+i;

            searchResultLink.className = 'searchresultsgridlink';
            searchResultLink.id = 'searchResultsGridLink'+i;

            testDiv.className = 'searchresultsgridchild';
            nameParagraph.textContent = searchResultsData.recordset[key][key1];
            nameParagraph.id = 'nameid'+i;

            nameParagraph.className = 'searchresultsparagraph';

            searchResultLink.appendChild(fighterImage);
            searchResultLink.appendChild(nameParagraph);

            var boxerStatsData = await fetchData('/getBoxerStats/',nameParagraph.textContent);
            var countryFlagImg = await getFlag(boxerStatsData.recordset[0].Nationality, 'countryflagimgsearch');
            var nameParagraph3 = document.createElement('p');
            var boxerRecordData = await fetchData('/getBoxerRecord/',nameParagraph.textContent);

            var wins = document.createElement('span');
            wins.textContent=boxerRecordData.recordset[0].TotalWins;
            wins.className='totalwins';

            var slash1 =document.createElement('span');
            slash1.textContent = '/';

            var slash2 =document.createElement('span');
            slash2.textContent = '/';

            var losses = document.createElement('span');
            losses.textContent = boxerRecordData.recordset[0].TotalLosses;
            losses.className='totallosses';

            var draws = document.createElement('span');
            draws.textContent=boxerRecordData.recordset[0].TotalDraws;
            draws.className='totaldraws';

            nameParagraph3.appendChild(wins);
            nameParagraph3.appendChild(slash1);
            nameParagraph3.appendChild(losses);
            nameParagraph3.appendChild(slash2);
            nameParagraph3.appendChild(draws);
            nameParagraph3.className = 'searchresultsparagraphrecord';

            searchResultLink.appendChild(countryFlagImg);            
            searchResultLink.appendChild(nameParagraph3);      

            searchResultLink.onclick = async function(divId){
                divId = this.id;
                var boxerDiv = document.getElementById(divId);
                var boxerName = boxerDiv.childNodes[1].textContent;
                window.location.href = '../fighterCard/'+boxerName;
            }
            testDiv.id = 'searchResultsGridChild'+i;
            testDiv.appendChild(searchResultLink);
            i++;
            document.getElementById('SearchResultsGrid').appendChild(testDiv);
        }
    }
    if(i === 0){
        var testError = document.getElementById('SearchResultsGrid');
        //make generic
        await createErrorDiv(testError);
    } 
}
async function createErrorDiv(div = ''){
    var errorDiv = document.createElement('div');
    errorDiv.id = 'ErrorDiv';
    errorDiv.className = 'errordiv';
    var errorParagraph = document.createElement('p');

    errorParagraph.textContent = 'No results found for search';
    errorDiv.appendChild(errorParagraph);
    if(div !== ''){
        div.appendChild(errorDiv);
    }
    else{
        document.body.appendChild(errorDiv);
    }

}
async function loadSearchResultsOnPage(){
    await clearSearchResults();
    var searchTerm = document.getElementById('searchField').value;
    document.getElementById('SearchTerm').textContent = searchTerm;
    var searchResultsData = await fetchData('/getSearchResults/',searchTerm);
    
    await loadSearch(searchResultsData);
}
async function getFlag(nationality, classname){
    var boxerCountryFlagData = await fetchData('/getBoxerCountryFlag/',nationality);
    var countryFlagImg = document.createElement('img');
    countryFlagImg.className = classname;
    countryFlagImg.src = boxerCountryFlagData.recordset[0].CountryFlagRef;

    return countryFlagImg;
}
async function loadFighterCard(){
    var boxerName = document.getElementById('boxerName').textContent;
    var boxerStatsData = await fetchData('/getBoxerStats/',boxerName);
    var boxerImageData = await fetchData('/getBoxerImage/',boxerName);
    var boxerRecordData = await fetchData('/getBoxerRecord/',boxerName);
    var boxerFightHistoryData = await fetchData('/getBoxerFightHistory/',boxerName);
    var cardGrid = document.getElementById('FighterInfoGrid');

    try{
        var imagepath = '/'+boxerImageData.recordset[0].BoxerImageReference;
        document.getElementById('fighterInfoImage').src = imagepath;
        var i = 0;
        var j = 0;

        //stats
        for (var key in boxerStatsData.recordset) {
            for (var key1 in boxerStatsData.recordset[key]) {
                var testDiv = document.createElement('div');
                testDiv.className = 'fighterinfostatsspaceContent';
                testDiv.textContent = boxerStatsData.recordset[key][key1];
                testDiv.id = 'fighterInfoStatsspaceContent'+i;
                if(countriesArray.includes(testDiv.textContent)){
                    var countryFlagImg = await getFlag(boxerStatsData.recordset[0].Nationality, 'countryflagfightercard');
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

        var fhcount = 1;
        var every6Array = [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93,99,105,111,117,123,129,135,141,147,153,159,165,171,177,183,189,195,201,207,213,219,225,231,237,243,249,255,261,267,273,279,285,291,297,303,309,315,321,327,333,339,345,351,357,363,369,375,381,387,393,399,405,411,417,423,429,435]

        //fight history
        for (var key in boxerFightHistoryData.recordset) {
            var testRow = document.createElement('tr');
            for (var key1 in boxerFightHistoryData.recordset[key]) {
                // var testDiv = document.createElement('div');
                // testDiv.className = 'fighterinfohistoryspaceContent';
                // testDiv.textContent = boxerFightHistoryData.recordset[key][key1];
                var testData = document.createElement('td');
                testData.textContent = boxerFightHistoryData.recordset[key][key1];
                testData.className = 'fighthistorytablecell';
                    //make generic
                    if(winsArray.includes(boxerFightHistoryData.recordset[key][key1])){
                        var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                        testData.textContent = ' '+newtext+' ';
                        var winDiv = document.createElement('div');
                        winDiv.className = 'fightercardresultbox'
                        winDiv.style.backgroundColor = 'green';
                        winDiv.textContent = 'W';
                        
                        testData.appendChild(winDiv);
                    }
                    else if(lossArray.includes(boxerFightHistoryData.recordset[key][key1])){
                        var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                        testData.textContent = ' '+newtext+' ';
                        var lossDiv = document.createElement('div');
                        lossDiv.className = 'fightercardresultbox'
                        lossDiv.style.backgroundColor = '#CE2029';
                        lossDiv.textContent = 'L';

                        testData.appendChild(lossDiv);
                    }       
                    else if(drawArray.includes(boxerFightHistoryData.recordset[key][key1])){
                        var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                        testData.textContent = ' '+newtext+' ';
                        var drawDiv = document.createElement('div');
                        drawDiv.className = 'fightercardresultbox'
                        drawDiv.style.backgroundColor = '#2d545e';
                        drawDiv.textContent = 'D';

                        testData.appendChild(drawDiv);
                    } 
                if(every6Array.includes(fhcount)){
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = boxerFightHistoryData.recordset[key][key1];
                    fighterLink.textContent = boxerFightHistoryData.recordset[key][key1];
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                }
                testRow.className = 'fighthistorytablerow';
                testRow.appendChild(testData);
                fhcount++;
                document.getElementById('fighterInfoHistorySpaceTable').appendChild(testRow);
                
                // else if(drawArray.includes(boxerFightHistoryData.recordset[key][key1])){
                //     testDiv.style.textAlign = 'center';
                // }
                // else if(lossArray.includes(boxerFightHistoryData.recordset[key][key1])){
                //     testDiv.style.textAlign = 'center';
                // }
                // testDiv.id = 'fighterInfoHistoryspaceContent'+j;
                // document.getElementById('fighterInfoHistorySpace').appendChild(testDiv);
            }
        }                
    }
    catch(err){
        console.log(err);
        while (cardGrid.firstChild){
            cardGrid.removeChild(cardGrid.lastChild);
        }
        var errorDiv = document.createElement('div');
        errorDiv.id = 'ErrorDiv';
        errorDiv.className = 'errordiv';
        var errorParagraph = document.createElement('p');

        errorParagraph.textContent = 'Boxer '+boxerName+' not found or does not exist';
        errorDiv.appendChild(errorParagraph);
        document.getElementById('ErrorSpace').appendChild(errorDiv);
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
async function closemenus(){
    var popupmenu = document.getElementById('popupMenu');
    var openpopupmenu = document.getElementById("openMenuButton");
    var weightfilter = document.getElementById("filterWeightMenu");
    var filter = document.getElementById("filterMenu");
    var genderfilter = document.getElementById("filterGenderMenu");   
    var searchInput = document.getElementById("searchFieldMobile");
    var searchButton = document.getElementById("searchButtonMobile");
    var wideScreenMenu = document.getElementById("menuOptions");
    // change to array of ids

    document.onclick = function(e){
        if(e.target.id !== 'popupMenu' && e.target.id !== 'openMenuButton' && e.target.id !== 'searchFieldMobile' && e.target.id !== 'searchButtonMobile'){
            popupmenu.style.display = 'none';
            openpopupmenu.style.display = 'block';            
          }
        if(e.target.id !== 'filterWeightMenu' && e.target.id !== 'currentWeightFilter'){
            if(weightfilter != null){
                weightfilter.style.display = 'none';   
            }
        }
        if(e.target.id !== 'filterMenu' && e.target.id !== 'currentFilter'){
            if(filter != null){
                filter.style.display = 'none';   
            }
        }
        if(e.target.id !== 'filterGenderMenu' && e.target.id !== 'currentGenderFilter'){
            if(genderfilter != null){
                genderfilter.style.display = 'none';   
            }
        }
        if(e.target.id !== 'menuOptions' && e.target.id !== 'pageName'){
            if(wideScreenMenu != null){
                wideScreenMenu.style.display = 'none';   
            }
        }                
      };

}
async function searchOnEnterPress(inputId, buttonId){
    document.getElementById(inputId).addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById(buttonId).click();
        }
        });
}
async function openMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    var z = document.getElementById("searchField");
    x.style.display = ("block");
    y.style.display = ("none");

    await searchOnEnterPress("searchFieldMobile", "searchButtonMobile");
}
async function closeMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    x.style.display = ("none");
    y.style.display = ("block");
}
async function closeDivFromOutside(){
    document.onclick=function(div){
        var x = document.getElementById("popupMenu");
        var y = document.getElementById("openMenuButton");
        if(div.target.id !== 'popupMenu'){
            x.style.display = ("none");
            y.style.display = ("block");
        }
    }
}
async function addImagesToFighterPreviewBox(){
    var randomFighterImagesData = await fetchData('/getRandomFighterImages');

    for(var i =0;i <8;i++ ){
        //elements seem to start filling from center and work their way left
        //also need anchor tag here?
        var testImage = document.createElement('img');
        testImage.setAttribute('src',randomFighterImagesData.recordset[i].BoxerImageReference);
        testImage.className = 'featuredfighterimg';   
        document.getElementById('FeaturedFighterImages').appendChild(testImage);       
    }

}
async function loadingText(){
    var loadingParagraph = document.createElement('p');
    loadingParagraph.textContent = 'Loading...';
    document.body.appendChild(loadingParagraph);
    await sleep(1000);
    document.body.removeChild(loadingParagraph);
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
var dataArray = [];
var grid = true;
var table = false;
async function loadFighterCatalogueAsGrid(fighterCatalogueData){
    grid = true;
    table = false;
    await clearCatalogue();
    dataArray = [];
    var i =0;
    //load catalogue as grid
    for (var key in fighterCatalogueData.recordset) {
        for (var key1 in fighterCatalogueData.recordset[key]) {
            var fighterImageApiData = await fetchData('/getBoxerImage/',fighterCatalogueData.recordset[key][key1]);

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
            
            dataArray.push(catalogueEntryDiv);  
            i++; 
        }
    }
    //load stuff to build and test pagination
    // var testDataCount = 0;
    // for(testDataCount;testDataCount<100;testDataCount++){
    //     var testDiv = document.createElement('div');
    //     var testImage = document.createElement('img');
    //     var testParagraph = document.createElement('p');
    //     var testLink = document.createElement('a');

    //     testDiv.className = 'catalogueentry';
    //     testImage.className = 'catalogueimage';
    //     testImage.src ='img/logo.png';
    //     testParagraph.textContent = 'test'+testDataCount;
    //     testLink.appendChild(testImage);
    //     testLink.appendChild(testParagraph);
    //     testDiv.appendChild(testLink);
    //     testDiv.id = 'catalogueentry '+testDataCount+5;
    //     dataArray.push(testDiv);
    // }
    //create buttons
    await loadGridData(currentPage);
    if(i === 0){
        await createErrorDiv();
    }
}
var currentPage = 1;
var numPages = 0;
var pageLinksArray = [];

async function displayPageLinks(){
    var nextPageLimit;
    var previousPageLimit;
    var endLimit = pageLinksArray.length-1;
    var nextPagesToHideArray = [];
    var prevPagesToHideArray = [];

    var stylecurrentpage = currentPage-1;
    if(pageLinksArray.length != 0){
        document.getElementById('pagelink'+stylecurrentpage).style.textDecoration = 'none';
        document.getElementById('pagelink'+stylecurrentpage).style.color = '#2b7a8a';
    }

    if(currentPage == 1 && pageLinksArray.length > 1){
        nextPageLimit = currentPage+3;
        var dots = document.createElement('a');
        dots.textContent = '...';
        dots.className = 'spacebetweenpages';
        dots.id = 'dotsahead';
        document.getElementById('pagelink'+nextPageLimit).parentNode.insertBefore(dots, document.getElementById('pagelink'+nextPageLimit));
 
    }
    else if(currentPage == 2){
        nextPageLimit = currentPage+2;
        var dots = document.createElement('a');
        dots.textContent = '...';
        dots.className = 'spacebetweenpages';
        dots.id = 'dotsahead';
        document.getElementById('pagelink'+nextPageLimit).parentNode.insertBefore(dots, document.getElementById('pagelink'+nextPageLimit));
    }
    else{
        nextPageLimit = currentPage+1;
        var dots = document.createElement('a');
        dots.textContent = '...';
        dots.className = 'spacebetweenpages';
        dots.id = 'dotsbehind';
        var dots2 = document.createElement('a');
        dots2.textContent = '...';
        dots2.className = 'spacebetweenpages';
        dots2.id = 'dotsahead';
        var spacefordotsbehind = currentPage-2;
        var spacefordotsahead = currentPage+2;
        if(spacefordotsbehind >= 2){
            document.getElementById('pagelink'+spacefordotsbehind).parentNode.insertBefore(dots, document.getElementById('pagelink'+spacefordotsbehind));
        }
        if(spacefordotsahead < pageLinksArray.length){
            document.getElementById('pagelink'+spacefordotsahead).parentNode.insertBefore(dots2, document.getElementById('pagelink'+spacefordotsahead));
        }
    }
    if(currentPage >1){
        previousPageLimit = currentPage-2;
        for(var i = previousPageLimit; i>0;i--){
            prevPagesToHideArray.push(pageLinksArray[i]);
        }
        for(var i = prevPagesToHideArray.length-1; i>0;i--){
            document.getElementById(prevPagesToHideArray[i].id).style.display = 'none';
        }
    }

    nextPagesToHideArray = pageLinksArray.slice(nextPageLimit, endLimit);
    
    for(var data in nextPagesToHideArray){
        document.getElementById(nextPagesToHideArray[data].id).style.display = 'none';
    }
}
async function createPageLinks(length){ 
    pageLinksArray=[];
    var previousButton = document.createElement('a');
    previousButton.textContent = '«';
    previousButton.id = 'cataloguePrevious';
    previousButton.className = 'cataloguepagelink';
    previousButton.onclick = async function(divId){
        divId = this.id;
        await loadGridData(divId);
    }    
    document.getElementById('catalogueButtonsLink').appendChild(previousButton);

    numPages = Math.ceil(length/itemsPerCatalogue);
    for(var i =0;i<numPages;i++){
        var pageLink = document.createElement('a');
        var pagenum=i+1;
        pageLink.textContent = pagenum;
        pageLink.id = 'pagelink'+i;
        pageLink.className = 'cataloguepagelink';
        document.getElementById('catalogueButtonsLink').appendChild(pageLink); //change to await function - display page links
        pageLink.onclick = async function(divId){
                        divId = this.id;
                        await goToPage(divId);
                    }
        pageLinksArray.push(pageLink);
    }
    await displayPageLinks();
    var nextButton = document.createElement('a');
    nextButton.textContent = '»';
    nextButton.id = 'catalogueNext';
    nextButton.className = 'cataloguepagelink';
    nextButton.onclick = async function(divId){
        divId = this.id;
        await loadGridData(divId);
    }    
    document.getElementById('catalogueButtonsLink').appendChild(nextButton);
}
async function goToPage(page){ //parameter for grid/table id
    var pagetext;
    var pageint;
if(Number.isInteger(page)){
    pageint = page;
}
else{
    pagetext = document.getElementById(page);
    pageint = parseInt(pagetext.textContent);
}



currentPage = pageint;
var newArray = [];
    if(pageint == 1){
        begin = 0;
        end = itemsPerCatalogue;
        newArray.push(dataArray.slice(begin,end));
        await clearCatalogue();
        await loadingText();
        if((document.getElementById('CatalogueTable') == undefined) && table){
            await createCatalogueTable();
        }
        for(var data in newArray[0]){
            if(grid){
                document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
            }
            else if (table){
                
                document.getElementById('CatalogueTable').appendChild(newArray[0][data]);
            }
        } 
        await createPageLinks(dataArray.length);
    }
    else{
        end = (pageint*itemsPerCatalogue);
        begin = end-itemsPerCatalogue;
        newArray.push(dataArray.slice(begin,end));
        await clearCatalogue();
        await loadingText();
        if((document.getElementById('CatalogueTable') == undefined) && table){
            await createCatalogueTable();
        }
        for(var data in newArray[0]){
            if(grid){
                document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
            }
            else if (table){
                document.getElementById('CatalogueTable').appendChild(newArray[0][data]);
            }
        } 
        await createPageLinks(dataArray.length);
    }
}
var begin = 0;
var end = itemsPerCatalogue;
var change = 10;

async function loadGridData(page){ //parameter for grid/table id
    var newArray = [];
    if(page === undefined){
        await createPageLinks(dataArray.length);
        for(var data in dataArray.slice(0,itemsPerCatalogue)){
            if(grid){
                document.getElementById('CatalogueGrid').appendChild(dataArray[data]);
            }
            else if(table){
                document.getElementById('CatalogueTable').appendChild(dataArray[data]);                
            }
        }
    }
    else if(Number.isInteger(page)){
        await goToPage(page);
    }
    else{
        var pageNumber = document.getElementById(page);
        if(pageNumber.id==='catalogueNext'){
            end=end+itemsPerCatalogue;
            begin=end-itemsPerCatalogue;
            newArray.push(dataArray.slice(begin,end));
            if(newArray[0].length > 0){
                await clearCatalogue();
                await loadingText();
                for(var data in newArray[0]){
                    if(grid){
                        document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
                    }
                    else if(table){
                        await createCatalogueTable();
                        document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
                    }                    
                } 
                currentPage++;
                await createPageLinks(dataArray.length);
            }
            else{
                begin=begin-itemsPerCatalogue;
                end=end-itemsPerCatalogue;
            }
        }
        if(pageNumber.id==='cataloguePrevious'){
            if(begin>0){
                await clearCatalogue();
                end=end-itemsPerCatalogue;
                begin=end-itemsPerCatalogue;
                if(begin<1 && end<itemsPerCatalogue){
                    begin=0;
                    end=itemsPerCatalogue;
                    newArray.push(dataArray.slice(begin,end));
                    await loadingText();
                    if((document.getElementById('CatalogueTable') == undefined) && table){
                        await createCatalogueTable();
                    }
                    for(var data in newArray[0]){
                        if(grid){
                            document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
                        }
                        else if(table){
                            document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
                        }  
                    } 
                    currentPage--;
                    await createPageLinks(dataArray.length);
                }
                else{
                    newArray.push(dataArray.slice(begin,end));
                    await loadingText();
                    if((document.getElementById('CatalogueTable') == undefined) && table){
                        await createCatalogueTable();
                    }
                    for(var data in newArray[0]){
                        if(grid){
                            document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
                        }
                        else if(table){
                            document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
                        }  
                    } 
                    currentPage--;
                    await createPageLinks(dataArray.length);
                }
            }
        }              
    }
}
async function createCatalogueTable(){
    var catalogueTable = document.createElement('table');
    catalogueTable.id = 'CatalogueTable';
    catalogueTable.className = 'cataloguetable'
    document.body.appendChild(catalogueTable);
    var tableHeadingRow = document.createElement('tr');
    var tableHeadingName = document.createElement('th');
    var tableHeadingRecord = document.createElement('th');
    var tableHeadingDivision = document.createElement('th');
    tableHeadingName.textContent = 'Name';
    tableHeadingRecord.textContent = 'Record';
    tableHeadingDivision.textContent = 'Division';
    tableHeadingName.className = 'cataloguetableheading';
    tableHeadingRecord.className = 'cataloguetableheading';
    tableHeadingDivision.className = 'cataloguetableheading';    
    tableHeadingRow.className = 'cataloguetableheadingrow'
    tableHeadingRow.id = 'catalogueTableHeadingRow'
    tableHeadingRow.appendChild(tableHeadingName);
    tableHeadingRow.appendChild(tableHeadingRecord);    
    tableHeadingRow.appendChild(tableHeadingDivision);        
    //catalogueTable.appendChild(tableHeadingRow); 
    var tableHeadingLast5 = document.createElement('th');
    tableHeadingLast5.textContent = 'Last 5 Fights';          
    tableHeadingLast5.className = 'cataloguetableheading';    
    tableHeadingLast5.id = 'CatalogueTableLast5';
    tableHeadingRow.appendChild(tableHeadingLast5);  
    catalogueTable.appendChild(tableHeadingRow);
}
async function loadFighterCatalogueAsList(fighterCatalogueData){
    grid = false;
    table = true;
    await clearCatalogue();
    dataArray = [];
    var i =0;
    var numberList = 1;
    for (var key in fighterCatalogueData.recordset) {
        for (var key1 in fighterCatalogueData.recordset[key]) {
            var fighterStatsData = await fetchData('/getBoxerStats/',fighterCatalogueData.recordset[key][key1]);
            var fighterRecordData = await fetchData('/getBoxerRecord/',fighterCatalogueData.recordset[key][key1]);

            var tableRow = document.createElement('tr');
            var tableData = document.createElement('td');
            var tableData2 = document.createElement('td');
            var tableData3 = document.createElement('td');
            var tableData4 = document.createElement('td');
            var nameParagraph = document.createElement('p');
            var linkToCard = document.createElement('a');

            tableRow.id ='CatalogueTableRowId'+i;
            linkToCard.id = fighterCatalogueData.recordset[key][key1];
            linkToCard.className = 'linktofightercataloguetable';
            tableData.className='cataloguetablename';
            tableData2.className='cataloguetablerecord';
            tableData3.className='cataloguetabledivision';
            tableData4.className='cataloguetablelast5';

            nameParagraph.textContent = numberList+'.'+' '+fighterCatalogueData.recordset[key][key1]; 
            nameParagraph.id = 'fighternameid'+i;

            if(countriesArray.includes(fighterStatsData.recordset[0].Nationality)){
                var countryFlagImg = await getFlag(fighterStatsData.recordset[0].Nationality, 'countryflagimgcatalogue')
                nameParagraph.appendChild(countryFlagImg);
            }
            var wins = document.createElement('span');
            wins.textContent=fighterRecordData.recordset[0].TotalWins;
            wins.className='totalwins';

            var slash1 =document.createElement('span');
            slash1.textContent = '/';

            var slash2 =document.createElement('span');
            slash2.textContent = '/';

            var losses = document.createElement('span');
            losses.textContent = fighterRecordData.recordset[0].TotalLosses;
            losses.className='totallosses';

            var draws = document.createElement('span');
            draws.textContent=fighterRecordData.recordset[0].TotalDraws;
            draws.className='totaldraws';

            tableData2.appendChild(wins);
            tableData2.appendChild(slash1);                
            tableData2.appendChild(losses); 
            tableData2.appendChild(slash2);                    
            tableData2.appendChild(draws); 

            var division = document.createElement('span')
            division.textContent=fighterStatsData.recordset[0].Division;
            division.style.color='black';
            tableData3.appendChild(division);

            var fightHistory = await fetchData('/getBoxerFightHistoryLast5/',fighterCatalogueData.recordset[key][key1]);
            for (var key in fightHistory.recordset) {
                var fightResult = document.createElement('div');
                fightResult.className = 'last5box';
                if(winsArray.includes(fightHistory.recordset[key].FightResult))
                {
                    fightResult.style.backgroundColor = 'green';

                }
                else if(lossArray.includes(fightHistory.recordset[key].FightResult))
                {
                    fightResult.style.backgroundColor = '#CE2029';
                }
                else if(drawArray.includes(fightHistory.recordset[key].FightResult))
                {
                    fightResult.style.backgroundColor = '#2d545e';
                }
                tableData4.appendChild(fightResult);
            }                               

            linkToCard.appendChild(nameParagraph);
            
            linkToCard.onclick = async function(divId){
                divId = this.id;
                var boxerName = document.getElementById(divId).id;
                window.location.href = 'fighterCard/'+boxerName;
            }

            tableData.appendChild(linkToCard);
            tableRow.appendChild(tableData);
            tableRow.appendChild(tableData2);
            tableRow.appendChild(tableData3);
            tableRow.appendChild(tableData4);
            tableRow.className = 'cataloguetablerow';
            //catalogueTable.appendChild(tableRow); //change to dataarray
            dataArray.push(tableRow);
            i++; 
            numberList++;
        }
    }
    // var testDataCount = 0;
    // //create test stuff for table
    // for(testDataCount;testDataCount<100;testDataCount++){
    //     var tableRow = document.createElement('tr');
    //     var testData1 = document.createElement('td');
    //     var testData2 = document.createElement('td');
    //     var testData3 = document.createElement('td');
    //     var testData4 = document.createElement('td');

    //     testData1.textContent = 'A'+testDataCount;
    //     testData2.textContent = 'B'+testDataCount;
    //     testData3.textContent = 'C'+testDataCount;
    //     testData4.textContent = 'D'+testDataCount;
    //     tableRow.appendChild(testData1);
    //     tableRow.appendChild(testData2);
    //     tableRow.appendChild(testData3);
    //     tableRow.appendChild(testData4);
    //     tableRow.className = 'cataloguetablerow';
    //     tableRow.id = 'catalogueentry '+testDataCount+5;
    //     dataArray.push(tableRow);
    // }
    await loadGridData(currentPage);

    if(i === 0){
        await clearCatalogue();
        await createErrorDiv();
    }    
}
async function loadFighterCatalogue(param){
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var fighterCatalogueData = await fetchData('/sortBoxerCatalogue/',currentSortingFilter+'/',currentWeightFilter+'/',currentGenderFilter);

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
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    currentSortingFilter.textContent = selectedSortingFilter.textContent;
    var currentGenderFilter = document.getElementById("currentGenderFilter").textContent;

    var sortSelectionData = await fetchData('/sortBoxerCatalogue/',selectedSortingFilter.textContent+'/',currentWeightFilter+'/',currentGenderFilter);
    var i =0;

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
    var x = document.getElementById("jumpToTopButtonSpace");
    if (document.body.scrollTop > 1500 || document.documentElement.scrollTop > 1500) {
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
//clearing could be generic
async function clearCatalogue(){
    var catalogueentry = document.getElementsByClassName('catalogueentry');
    var cataloguetablerow = document.getElementsByClassName('cataloguetablerow');
    var cataloguepagelink = document.getElementsByClassName('cataloguepagelink');
    var spacebetweenpages = document.getElementsByClassName('spacebetweenpages');
    var cataloguetableheadingrow = document.getElementsByClassName('cataloguetableheadingrow');
    var cataloguetable = document.getElementsByClassName('cataloguetable');
    var elemId='';

    if(typeof catalogueentry != undefined){
        for (var j =0; j < catalogueentry.length; j+1){
            elemId = document.getElementById(catalogueentry[j].id);
            elemId.remove();
        }
    }
    if(typeof cataloguetablerow != undefined){
        for (var j =0; j < cataloguetablerow.length; j+1){
            elemId = document.getElementById(cataloguetablerow[j].id);
            elemId.remove();
        }
    }
    if(typeof cataloguepagelink != undefined){
        for (var j =0; j < cataloguepagelink.length; j+1){
            elemId = document.getElementById(cataloguepagelink[j].id);
            elemId.remove();
        }
    }
    if(typeof spacebetweenpages != undefined){
        for (var j =0; j < spacebetweenpages.length; j+1){
            elemId = document.getElementById(spacebetweenpages[j].id);
            elemId.remove();
        }
    }
    if(typeof cataloguetableheadingrow != undefined){
        for (var j =0; j < cataloguetableheadingrow.length; j+1){
            elemId = document.getElementById(cataloguetableheadingrow[j].id);
            elemId.remove();
        }
    }
    if(typeof cataloguetable != undefined){
        for (var j =0; j < cataloguetable.length; j+1){
            elemId = document.getElementById(cataloguetable[j].id);
            elemId.remove();
        }
    }    
    await clearErrors();
}
async function clearErrors(){
    var x = document.getElementsByClassName('errordiv');
    if(typeof x != undefined){
        for (var j =0; j < x.length; j+1){
            elemId = document.getElementById(x[j].id);
            elemId.remove();
        }
    }  
}
async function clearlast5(){
    var x = document.getElementsByClassName('last5contentrow');
    if(typeof x != undefined){
        for (var j =0; j < x.length; j+1){
            elemId = document.getElementById(x[j].id);
            elemId.remove();
        }
    }     
}
async function filterWeightClass(id) {
    var currentWeightFilter = document.getElementById("currentWeightFilter");
    var selectedWeightFilter = document.getElementById(id);
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    currentWeightFilter.innerHTML = selectedWeightFilter.textContent;
    var currentGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var filteredWeightData = await fetchData('/sortBoxerCatalogue/',currentSortingFilter+'/',selectedWeightFilter.textContent+'/',currentGenderFilter);
    var i=0;

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
    currentGenderFilter.textContent = selectedGenderFilter.textContent;
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    var filteredGenderData = await fetchData('/sortBoxerCatalogue/',currentSortingFilter+'/',currentWeightFilter+'/',selectedGenderFilter.textContent);

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
async function search(id){
    var searchButton = document.getElementById(id).id;
    var searchField;
    if(searchButton === 'searchButtonMobile'){
        searchField = document.getElementById('searchFieldMobile').value;
    }
    if(searchButton === 'searchButtonWideScreen'){
        searchField = document.getElementById('searchFieldWideScreen').value;
    }
    if(searchButton === 'searchButton'){
        searchField = document.getElementById('searchField').value;
    }
    if(searchButton === 'searchButtonMobileWide'){
        searchField = document.getElementById('searchFieldMobileWide').value;
    }
    window.location.href = '/searchResults/'+searchField;
}
async function loadUpcomingFightsData(){
    var upcomingFightsData = await fetchData('/getUpcomingFights');
    var upcomingFightsNamesData = await fetchData('/getUpcomingFighterNames');
    var upcomingFightsRecordsData = await fetchData('/getUpcomingFighterRecords');
    var upcomingFightsStatsData = await fetchData('/getUpcomingFighterStats');
    var upcomingFightsImagesData = await fetchData('/getUpcomingFighterImages');   

    //must be a way to make this .textcontent code more efficient, i.e. some kind of loop to go through all fields with 
    //the same class name and append the right recordset to each?

    //heading
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
    if(countriesArray.includes(upcomingFightsStatsData.recordset[0].Nationality[0])){
        var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[0].Nationality[0], 'countryflagfightercard');
        document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[0].Nationality[0];
        document.getElementById('fighterANationality').appendChild(countryFlagImg);
    }
    if(countriesArray.includes(upcomingFightsStatsData.recordset[0].Nationality[1])){
        var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[0].Nationality[1], 'countryflagfightercard');
        document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[0].Nationality[1];
        document.getElementById('fighterBNationality').appendChild(countryFlagImg);
    }

    //images
    document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[0].BoxerImageReference[0];
    document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[0].BoxerImageReference[1];

    //last 5 fights
    var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
    var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);

    var twoupthree = [2,5,8,11,14];
    var i = 0;
    var j = 0;
    var fhcountA = 1;
    var fhcountB = 1;
    for (var key in upcomingFightsLastFiveDataA.recordset) {
        var testRow = document.createElement('tr');
        testRow.className = 'last5contentrow';
        testRow.id ='last5contentrow'+i;
        for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
            var testData = document.createElement('td');
            testData.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
            testData.className = 'last5contentcell';
            //make generic
            if(winsArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                testData.textContent = '';
                var winDiv = document.createElement('div');
                winDiv.className = 'fightercardresultbox'
                winDiv.style.backgroundColor = 'green';
                winDiv.textContent = 'W';
                
                testData.appendChild(winDiv);
            }
            else if(lossArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                testData.textContent = '';
                var lossDiv = document.createElement('div');
                lossDiv.className = 'fightercardresultbox'
                lossDiv.style.backgroundColor = '#CE2029';
                lossDiv.textContent = 'L';

                testData.appendChild(lossDiv);
            }       
            else if(drawArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                testData.textContent = '';
                var drawDiv = document.createElement('div');
                drawDiv.className = 'fightercardresultbox'
                drawDiv.style.backgroundColor = '#2d545e';
                drawDiv.textContent = 'D';

                testData.appendChild(drawDiv);
            }
            if(twoupthree.includes(fhcountA)){
                testData.textContent = '';
                var fighterLink = document.createElement('a');
                fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                fighterLink.className = 'fighthistorytablecelllink'
                testData.appendChild(fighterLink);
            } 
            testRow.appendChild(testData);
            document.getElementById('Last5TableA').appendChild(testRow);
            fhcountA++;
        }
        i++;
    }
    for (var key in upcomingFightsLastFiveDataB.recordset) {
        var testRow = document.createElement('tr');
        testRow.className = 'last5contentrow';
        testRow.id ='last5contentrow'+j;
        for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
            var testData = document.createElement('td');
            testData.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
            testData.className = 'last5contentcell';
            //make generic
            if(winsArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                testData.textContent = '';
                var winDiv = document.createElement('div');
                winDiv.className = 'fightercardresultbox'
                winDiv.style.backgroundColor = 'green';
                winDiv.textContent = 'W';
                
                testData.appendChild(winDiv);
            }
            else if(lossArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                testData.textContent = '';
                var lossDiv = document.createElement('div');
                lossDiv.className = 'fightercardresultbox'
                lossDiv.style.backgroundColor = '#CE2029';
                lossDiv.textContent = 'L';

                testData.appendChild(lossDiv);
            }       
            else if(drawArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                testData.textContent = '';
                var drawDiv = document.createElement('div');
                drawDiv.className = 'fightercardresultbox'
                drawDiv.style.backgroundColor = '#2d545e';
                drawDiv.textContent = 'D';

                testData.appendChild(drawDiv);
            } 
            if(twoupthree.includes(fhcountB)){
                testData.textContent = '';
                var fighterLink = document.createElement('a');
                fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                fighterLink.className = 'fighthistorytablecelllink'
                testData.appendChild(fighterLink);
            } 
            testRow.appendChild(testData);
            document.getElementById('Last5TableB').appendChild(testRow);
            fhcountB++;
        }
        j++;
    }
}
async function nextFight(){
    if(upcomingFightCount !=2){
        var upcomingFightsData = await fetchData('/getUpcomingFights');
        var upcomingFightsNamesData = await fetchData('/getUpcomingFighterNames');
        var upcomingFightsRecordsData = await fetchData('/getUpcomingFighterRecords');
        var upcomingFightsStatsData = await fetchData('/getUpcomingFighterStats');
        var upcomingFightsImagesData = await fetchData('/getUpcomingFighterImages');   
    
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
        if(countriesArray.includes(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0])){
            var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0], 'countryflagfightercard');
            document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0];
            document.getElementById('fighterANationality').appendChild(countryFlagImg);
        }
        if(countriesArray.includes(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1])){
            var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1], 'countryflagfightercard');
            document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1];
            document.getElementById('fighterBNationality').appendChild(countryFlagImg);
        }
    
        //images
        document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[0];
        document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[1];
    
        //last 5 fights
        var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
        var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);

        var twoupthree = [2,5,8,11,14];
        var i = 0;
        var j = 0;
        var fhcountA = 1;
        var fhcountB = 1;

        await clearlast5();
        for (var key in upcomingFightsLastFiveDataA.recordset) {
            var testRow = document.createElement('tr');
            testRow.className = 'last5contentrow';
            testRow.id ='last5contentrow'+i;
            for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
                var testData = document.createElement('td');
                testData.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                testData.className = 'last5contentcell';
                //make generic
                if(winsArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var winDiv = document.createElement('div');
                    winDiv.className = 'fightercardresultbox'
                    winDiv.style.backgroundColor = 'green';
                    winDiv.textContent = 'W';
                    
                    testData.appendChild(winDiv);
                }
                else if(lossArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var lossDiv = document.createElement('div');
                    lossDiv.className = 'fightercardresultbox'
                    lossDiv.style.backgroundColor = '#CE2029';
                    lossDiv.textContent = 'L';
    
                    testData.appendChild(lossDiv);
                }       
                else if(drawArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var drawDiv = document.createElement('div');
                    drawDiv.className = 'fightercardresultbox'
                    drawDiv.style.backgroundColor = '#2d545e';
                    drawDiv.textContent = 'D';
    
                    testData.appendChild(drawDiv);
                } 
                if(twoupthree.includes(fhcountA)){
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                    fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                } 
                testRow.appendChild(testData);
                document.getElementById('Last5TableA').appendChild(testRow);
                fhcountA++;
            }
            i++;
        }

        for (var key in upcomingFightsLastFiveDataB.recordset) {
            var testRow = document.createElement('tr');
            testRow.className = 'last5contentrow';
            testRow.id ='last5contentrow'+j;
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testData = document.createElement('td');
                testData.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                testData.className = 'last5contentcell';
                //make generic
                if(winsArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var winDiv = document.createElement('div');
                    winDiv.className = 'fightercardresultbox'
                    winDiv.style.backgroundColor = 'green';
                    winDiv.textContent = 'W';
                    
                    testData.appendChild(winDiv);
                }
                else if(lossArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var lossDiv = document.createElement('div');
                    lossDiv.className = 'fightercardresultbox'
                    lossDiv.style.backgroundColor = '#CE2029';
                    lossDiv.textContent = 'L';
    
                    testData.appendChild(lossDiv);
                }       
                else if(drawArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var drawDiv = document.createElement('div');
                    drawDiv.className = 'fightercardresultbox'
                    drawDiv.style.backgroundColor = '#2d545e';
                    drawDiv.textContent = 'D';
    
                    testData.appendChild(drawDiv);
                } 
                if(twoupthree.includes(fhcountB)){
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                    fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                } 
                testRow.appendChild(testData);
                document.getElementById('Last5TableB').appendChild(testRow);
                fhcountB++;
            }
            j++;
        }
    }
}
async function previousFight(){
    if(upcomingFightCount != 0){
        var upcomingFightsData = await fetchData('/getUpcomingFights');
        var upcomingFightsNamesData = await fetchData('/getUpcomingFighterNames');
        var upcomingFightsRecordsData = await fetchData('/getUpcomingFighterRecords');
        var upcomingFightsStatsData = await fetchData('/getUpcomingFighterStats');
        var upcomingFightsImagesData = await fetchData('/getUpcomingFighterImages');   

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
        if(countriesArray.includes(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0])){
            var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0], 'countryflagfightercard');
            document.getElementById('fighterANationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[0];
            document.getElementById('fighterANationality').appendChild(countryFlagImg);
        }
        if(countriesArray.includes(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1])){
            var countryFlagImg = await getFlag(upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1], 'countryflagfightercard');
            document.getElementById('fighterBNationality').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Nationality[1];
            document.getElementById('fighterBNationality').appendChild(countryFlagImg);
        }

        //images
        document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[0];
        document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].BoxerImageReference[1];
        
        //last 5 fights
        var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
        var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);

        var twoupthree = [2,5,8,11,14];
        var i = 0;
        var j = 0;
        var fhcountA = 1;
        var fhcountB = 1;

        await clearlast5();
        for (var key in upcomingFightsLastFiveDataA.recordset) {
            var testRow = document.createElement('tr');
            testRow.className = 'last5contentrow';
            testRow.id ='last5contentrow'+i;
            for (var key1 in upcomingFightsLastFiveDataA.recordset[key]) {
                var testData = document.createElement('td');
                testData.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                testData.className = 'last5contentcell';
                //make generic
                if(winsArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var winDiv = document.createElement('div');
                    winDiv.className = 'fightercardresultbox'
                    winDiv.style.backgroundColor = 'green';
                    winDiv.textContent = 'W';
                    
                    testData.appendChild(winDiv);
                }
                else if(lossArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var lossDiv = document.createElement('div');
                    lossDiv.className = 'fightercardresultbox'
                    lossDiv.style.backgroundColor = '#CE2029';
                    lossDiv.textContent = 'L';
    
                    testData.appendChild(lossDiv);
                }       
                else if(drawArray.includes(upcomingFightsLastFiveDataA.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var drawDiv = document.createElement('div');
                    drawDiv.className = 'fightercardresultbox'
                    drawDiv.style.backgroundColor = '#2d545e';
                    drawDiv.textContent = 'D';
    
                    testData.appendChild(drawDiv);
                } 
                if(twoupthree.includes(fhcountA)){
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                    fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                }                 
                testRow.appendChild(testData);
                document.getElementById('Last5TableA').appendChild(testRow);
                fhcountA++;
            }
            i++;
        }

        for (var key in upcomingFightsLastFiveDataB.recordset) {
            var testRow = document.createElement('tr');
            testRow.className = 'last5contentrow';
            testRow.id ='last5contentrow'+j;
            for (var key1 in upcomingFightsLastFiveDataB.recordset[key]) {
                var testData = document.createElement('td');
                testData.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                testData.className = 'last5contentcell';
                //make generic
                if(winsArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Win','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var winDiv = document.createElement('div');
                    winDiv.className = 'fightercardresultbox'
                    winDiv.style.backgroundColor = 'green';
                    winDiv.textContent = 'W';
                    
                    testData.appendChild(winDiv);
                }
                else if(lossArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Loss','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var lossDiv = document.createElement('div');
                    lossDiv.className = 'fightercardresultbox'
                    lossDiv.style.backgroundColor = '#CE2029';
                    lossDiv.textContent = 'L';
    
                    testData.appendChild(lossDiv);
                }       
                else if(drawArray.includes(upcomingFightsLastFiveDataB.recordset[key][key1])){
                    //var newtext = testData.textContent.replace('Draw','').replace('(','').replace(')','');
                    testData.textContent = '';
                    var drawDiv = document.createElement('div');
                    drawDiv.className = 'fightercardresultbox'
                    drawDiv.style.backgroundColor = '#2d545e';
                    drawDiv.textContent = 'D';
    
                    testData.appendChild(drawDiv);
                } 
                if(twoupthree.includes(fhcountB)){
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                    fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                }                       
                testRow.appendChild(testData);
                document.getElementById('Last5TableB').appendChild(testRow);
                fhcountB++;
            }
            j++;
        }        
    }
}