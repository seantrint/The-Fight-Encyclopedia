var upcomingFightCount = 0;
var isGrid = true;
var isList = false;
var countriesArray = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Canada","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Russian Federation","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","UK","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe", "USA","United Kingdom","United States"];
var winsArray = ["Win (UD)", "Win (KO)", "Win (SD)", "Win (MD)", "Win (TKO)", "Win (DQ)", "Win (PTS)"];
var lossArray = ["Loss (UD)", "Loss (KO)", "Loss (SD)", "Loss (MD)", "Loss (TKO)", "Loss (DQ)", "Loss (PTS)"];
var drawArray = ["Draw (MD)", "Draw (SD)", "Draw (PTS)", "Draw (UD)", "Draw"];
var itemsPerCatalogue = 10;
var begin = 0;
var end;
var change = 10;
var errorDivCreated = false;
async function numberOfElementsPerPage(){
    if(screen.width >= 0 && screen.width <= 640){
        itemsPerCatalogue = 15;
    }
    else if(screen.width >= 640 && screen.width <= 1250){
        itemsPerCatalogue = 18;
    }  
    else if(screen.width >= 1250 && screen.width <= 1850){
        itemsPerCatalogue = 21;
    }     
    else if(screen.width >= 1850 && screen.width >= 1900){
        itemsPerCatalogue = 24;
    }    
    else if(screen.width >= 1900 && screen.width >= 2200){
        itemsPerCatalogue = 32;
    }    
    else if(screen.width >= 2200 && screen.width >= 3000){
        itemsPerCatalogue = 47;
    }    
    else{
        itemsPerCatalogue = 82;
    }
    end = itemsPerCatalogue;
}
async function fetchData(route, parameter1 = '', parameter2 = '', parameter3 = '', parameter4 = ''){
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
    var mobileHomeLink = document.getElementById("mobileHomeLink");
    var mobilefighterCatalogueLink = document.getElementById("mobileFighterCatalogueLink");
    var mobileSearchField = document.getElementById("mobilemenulinkLast");
    var aboutLink = document.getElementById("mobileAboutLink");
    //var arrow = 'y\uU+0291E';
    var fighterCatalogueLink = document.getElementById("fighterCatalogueLink");
    var pageNameLogo;
    // if (docTitle == "Home") {
    //     pageNameLogo = document.createElement('i');
    //     pageNameLogo.className = 'fa fa-home';
    // }
    //pageName.innerHTML = "menu" + "&ensp;&#8595;";
    await searchOnEnterPress("searchFieldMobileDefault", "mobileButtonForSearch");
    await searchOnEnterPress("searchFieldWideScreen", "searchButtonWideScreen");
    if (docTitle == "Home") {
        mobileHomeLink.style.backgroundColor = '#d1d1d1';
        var boxersCount = await fetchData('/getBoxersCount');
        document.getElementById('BoxersCount').textContent = boxersCount.recordset[0].boxerCount;
        //homeLink.textContent = arrow + homeLink.textContent;
        await loadUpcomingFightsData();
        await loadDailyQuotes();
        await addImagesToFighterPreviewBox();
        document.getElementById('catalogueLoadingGif').style.display='none';
    }
    else if (docTitle == "Fighter Catalogue") {
        mobilefighterCatalogueLink.style.backgroundColor= '#d1d1d1';
        //add listener for scrolling=
        await numberOfElementsPerPage();
        await addCatalogueScrollListener();
        await loadFighterCatalogue();
    }
    // if(docTitle == "Fighter Card"){
    //     await loadFighterCard();
    // }
    else if(docTitle == "Search Results"){
        mobileSearchField.style.backgroundColor = '#d1d1d1';
        //add listener for scrolling
        await addSearchScrollListener();
        await loadSearchResults();
    }
    else if(docTitle == "API"){
        aboutLink.style.backgroundColor = '#d1d1d1';
    }
    else{
        await loadFighterCard();
    }
}
async function loadErrorPage(){
    var docTitle = document.title;
    if(docTitle == "Page Not Found"){
        await searchOnEnterPress("searchField", "searchButton");
    }
}
async function loadDailyQuotes(){
    var dailyQuotes = await fetchData('/getQuotesOfTheDay');
    var quotesspace = document.getElementById('quotesSpace');
    for(var quote in dailyQuotes.recordset){
        quoteParagraph = document.createElement('p');
        quoteParagraph.textContent = dailyQuotes.recordset[quote].quote;
        quotesspace.appendChild(quoteParagraph);
    }
}
async function expandPanel(id){
    var elementToChange = document.getElementById(id).parentNode.nextSibling.nextSibling;
    if(elementToChange.style.display != 'none'){
        elementToChange.style.display = 'none';
        document.getElementById(id).textContent = '+';
    }
    else if(elementToChange.style.display == 'none'){
        elementToChange.style.display = 'block';
        document.getElementById(id).textContent = '-';
    }
}
async function expandUpcomingFights(id){
    var polaroid = document.getElementById('Polaroid');
    var button = document.getElementById(id);
    var idsToHide = ['Polaroid', 'Previous', 'Next', 'Three', 'Four', 'Five', 'Six']
    if(polaroid.style.display != 'none'){
        polaroid.style.display = 'none';
        button.textContent = '+';
        for (i=0;i<=idsToHide.length-1;i++){
            document.getElementById(idsToHide[i]).style.display = 'none';
        }
    }
    else if(polaroid.style.display == 'none'){
        polaroid.style.display = 'block';
        button.textContent = '-';
        for (i=0;i<=idsToHide.length-1;i++){
            document.getElementById(idsToHide[i]).style.display = 'block';
        }
    }

}
async function createRemoveSpinner(create = true, rmv = false){
    var created = false;
    var z = document.getElementsByClassName('loadingScrollSpinner');
    if(create){
        var spinner = document.createElement('img')
        spinner.src = '/img/loading.gif'
        spinner.className = 'loadingScrollSpinner'
        spinner.id = 'id'+Math.random(10000)
        document.getElementById('CatalogueGrid').appendChild(spinner)
        created = true;
    }
    else if(rmv){
        var elemId='';
    
        if(typeof z != undefined){
            for (var j =0; j < z.length; j+1){
                elemId = document.getElementById(z[j].id);
                elemId.remove();
            }
        }
    }
}
async function addCatalogueScrollListener(){
    var currentSortingFilter = document.getElementById("currentFilter").textContent; 
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentGenderFilter = document.getElementById("currentGenderFilter").textContent;
    window.addEventListener('scroll', async function(e) {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(async function() {
            ticking = false;
            if(!endOfSearchData){
                if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                    await createRemoveSpinner(true)
                    //await TriggerJumpToTopButton();
                    await loadFighterCatalogue();
                    await createRemoveSpinner(false, true)
                }
            }
            });
          ticking = true;
        }
      });
}
let last_known_scroll_position = 0;
let ticking = false;
async function addSearchScrollListener(){
    //detect when scrolled to bottom
    window.addEventListener('scroll', async function(e) {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(async function() {
            ticking = false;
            if(!endOfSearchData){
                if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                    //await TriggerJumpToTopButton();
                    //increase array slice by 10 on begin + end
                    //rerun load search results - do not clear existing results!! (async function loadSearch)
                    var searchTerm = document.getElementById('SearchTerm').textContent;
                    var searchResultsData = await fetchData('/getSearchResults/',searchTerm);
                    await loadSearch(searchResultsData);
                }
            }
            });
          ticking = true;
        }
      });
}
async function showSearchBar(){
    document.getElementById("searchFieldMobileDefault").style.display = 'block';
    document.getElementById("searchButtonMobileDefault").style.display = 'none';
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
    //document.getElementById("searchFieldMobileWide").style.display = 'none';
    //document.getElementById("searchButtonMobileWide").style.display = 'none';
    await clearSearchResults();
    var searchTerm = document.getElementById('SearchTerm').textContent;
    var searchResultsData = await fetchData('/getSearchResults/',searchTerm);

    await loadSearch(searchResultsData);
    await searchOnEnterPress("searchField","searchButton");
}
var searchArrayBegin = 0;
var searchArrayEnd = 10;
var endOfSearchData = false;
async function loadSearch(searchResultsData){
    var i=0;
    if(first == false){
        searchArrayBegin = searchArrayEnd;
        searchArrayEnd = searchArrayEnd+10;
    }
    first = false;
    var searchResultsData = searchResultsData;
    var searchDataArray = [];
    searchDataArray.push(searchResultsData.recordset);
    var firstSearchArraySlice = searchDataArray[0].slice(searchArrayBegin,searchArrayEnd);
    for (var key in firstSearchArraySlice) {
        var testDiv = document.createElement('div');
        var searchResultLink = document.createElement('a');
        var fighterImage = document.createElement('img');
        var nameParagraph = document.createElement('p');
            if(firstSearchArraySlice[key].ImageReference != null){
                fighterImage.src = '/'+firstSearchArraySlice[key].ImageReference;
            }
            else{
                fighterImage.src = '/img/logo.png'
            }
        fighterImage.id = 'fighterimageid'+i;
        var fighterImageLink = document.createElement('a');
        fighterImageLink.href = '/fighterCard/'+firstSearchArraySlice[key].BoxerName;
        fighterImageLink.className = 'searchresultsgridchildimg';
        fighterImageLink.appendChild(fighterImage);  

        searchResultLink.className = 'searchresultsgridlink';
        searchResultLink.id = 'searchResultsGridLink'+i;

        testDiv.className = 'searchresultsgridchild';
        var nameParagraphLink = document.createElement('a');
        nameParagraphLink.href = '/fighterCard/'+firstSearchArraySlice[key].BoxerName;
        nameParagraphLink.appendChild(nameParagraph);
        nameParagraph.textContent = firstSearchArraySlice[key].BoxerName;
        nameParagraph.id = 'nameid'+i;

        nameParagraphLink.className = 'searchresultsparagraph';

        searchResultLink.appendChild(fighterImageLink);
        searchResultLink.appendChild(nameParagraphLink);

        var countryFlagImg = await getFlag(firstSearchArraySlice[key].Nationality, 'countryflagimgsearch');
        countryFlagImg.id = 'flagid'+i;
        var nameParagraph3 = document.createElement('p');
        nameParagraph3.id = 'recordid'+i;
        var wins = document.createElement('span');
        if(firstSearchArraySlice[key].Wins != null){
            wins.textContent = firstSearchArraySlice[key].Wins;
        }
        wins.className='totalwins';

        var slash1 =document.createElement('span');
        slash1.textContent = '/';

        var slash2 =document.createElement('span');
        slash2.textContent = '/';

        var losses = document.createElement('span');
        if(firstSearchArraySlice[key].Losses != null){
            losses.textContent = firstSearchArraySlice[key].Losses;
        }
        losses.className='totallosses';

        var draws = document.createElement('span');
        if(firstSearchArraySlice[key].Draws != null){
            draws.textContent = firstSearchArraySlice[key].Draws;
        }
        draws.className='totaldraws';        
        nameParagraph3.appendChild(wins);
        nameParagraph3.appendChild(slash1);
        nameParagraph3.appendChild(losses);
        nameParagraph3.appendChild(slash2);
        nameParagraph3.appendChild(draws);
        nameParagraph3.className = 'searchresultsparagraphrecord';
        searchResultLink.appendChild(countryFlagImg);            
        searchResultLink.appendChild(nameParagraph3);      

        testDiv.id = 'searchResultsGridChild'+i;
        testDiv.appendChild(searchResultLink);
        
        document.getElementById('SearchResultsGrid').appendChild(testDiv);
        i++;
    }
    document.getElementById('catalogueLoadingGif').style.display = 'none';
    var existingSearchDiv = document.getElementsByClassName('searchresultsgridchild');
    if(i === 0 && searchDataArray[0].length === 0 && !errorDivCreated){
        //empty search results
        var testError = document.getElementById('SearchResultsGrid');
        //make generic
        await createErrorDiv(testError, 'No results found for search');
        errorDivCreated = true;
    } 
    else if(i === 0 && typeof existingSearchDiv != undefined){
        //scrolled to end of dataset so disable scrolling
        endOfSearchData = true;
    }
}
async function createErrorDiv(div = '', errorText = ''){
    var errorDiv = document.createElement('div');
    errorDiv.id = 'ErrorDiv';
    errorDiv.className = 'errordiv';
    var errorParagraph = document.createElement('p');

    if(errorText !== ''){
        errorParagraph.textContent = errorText;
    }
    else{
        errorParagraph.textContent = 'No results found for search';
    }
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
    if(boxerCountryFlagData.recordset[0] != undefined){
        countryFlagImg.src = boxerCountryFlagData.recordset[0].CountryFlagRef;  
    }

    return countryFlagImg;
}
async function loadFighterCard(){
    var boxerName = document.getElementById('boxerName').textContent;
    var boxerStatsData = await fetchData('/getBoxerStats/',boxerName);
    var boxerImageData = await fetchData('/getBoxerImage/',boxerName);
    var boxerRecordData = await fetchData('/getBoxerRecord/',boxerName);
    var boxerFightHistoryData = await fetchData('/getBoxerFightHistory/',boxerName);
    var cardGrid = document.getElementById('FighterInfoGrid');
    document.getElementById('fighterInfoImage').src = "/img/loading.gif";
    try{
        var imagepath = '/'+boxerImageData.recordset[0].ImageReference;
        document.getElementById('fighterInfoImage').src = imagepath;
        var i = 0;
        var j = 0;
        try{
            newdob = boxerStatsData.recordset[0].dob;
            newdob = newdob.split('T')[0]
            boxerStatsData.recordset[0].dob = newdob;
        }
        catch(error){
            console.log(error)
        }
        try{
            newcareerweight = boxerStatsData.recordset[0].careerweight;
            newcareerweight = newcareerweight.replace('lbs','')
            boxerStatsData.recordset[0].careerweight = newcareerweight;
        }
        catch(error){
            console.log(error)
        }
        
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
        document.getElementById('fighterInfoWins').textContent = boxerRecordData.recordset[0].Wins+' ('+boxerRecordData.recordset[0].WinsKo+' KOs)';
        document.getElementById('fighterInfoLosses').textContent = boxerRecordData.recordset[0].Losses;
        document.getElementById('fighterInfoDraws').textContent = boxerRecordData.recordset[0].Draws;

        var fhcount = 1;
        var opponentName = '';
        var opponentRecordData; 
        //fight history
        for (var key in boxerFightHistoryData.recordset) {
            var testRow = document.createElement('tr');
            for (var key1 in boxerFightHistoryData.recordset[key]) {
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
                if ( fhcount && (fhcount % 6 === 2)) { 
                    if(screen.width <= 360){
                        testData.style.textAlign = 'center';
                    }
                }   
                if ( fhcount && (fhcount % 6 === 3)) {
                    testData.textContent = '';
                    var fighterLink = document.createElement('a');
                    fighterLink.href = boxerFightHistoryData.recordset[key][key1];
                    fighterLink.textContent = boxerFightHistoryData.recordset[key][key1];
                    opponentName = fighterLink.textContent;
                    //we can check for opponent credentials with a fetch request using his name
                    fighterLink.className = 'fighthistorytablecelllink'
                    testData.appendChild(fighterLink);
                }
                if ( fhcount && (fhcount % 6 === 4)) {
                    testData.textContent = '';
                    opponentRecordData = await fetchData('/getBoxerRecord/',opponentName);
                    //get boxer record based on opponents name
                    //repeat code from colouring records elsewhere
                    var wins = document.createElement('span');
                    wins.textContent=opponentRecordData.recordset[0].Wins;
                    wins.className='totalwins';
        
                    var slash1 =document.createElement('span');
                    slash1.textContent = '/';
        
                    var slash2 =document.createElement('span');
                    slash2.textContent = '/';
        
                    var losses = document.createElement('span');
                    losses.textContent = opponentRecordData.recordset[0].Losses;
                    losses.className='totallosses';
        
                    var draws = document.createElement('span');
                    draws.textContent=opponentRecordData.recordset[0].Draws;
                    draws.className='totaldraws';
                    testData.appendChild(wins);
                    testData.appendChild(slash1);
                    testData.appendChild(losses);
                    testData.appendChild(slash2);
                    testData.appendChild(draws);
                }
                //testData.style.borderRight = '1px ridge gray';
                // if ( fhcount && (fhcount % 6 === 0)) {
                //     testData.style.borderRight = 'none';
                // }
                testRow.className = 'fighthistorytablerow';
                testRow.appendChild(testData);
                fhcount++;
                document.getElementById('fighterInfoHistorySpaceTable').appendChild(testRow);
            }
        }                
    }
    catch(err){
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
async function showMenuLinks() {
 
    var x = document.getElementById("menuOptions");
    var y = document.getElementById("wideScreenLinks");
    if(x.style.opacity === '0'){
        x.style.opacity = '1';
    }
    x.classList.toggle('open');
    if(y.style.display === 'none'){
        y.style.display = 'block';
    }
    y.classList.toggle('open');
    // if (window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
    //     x.classList.toggle('open')
        
    // } else {
    //     x.style.display = 'none';
    // }
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
    var searchInput = document.getElementById("searchFieldMobileDefault");
    var searchButton = document.getElementById("searchButtonMobileDefault");
    var wideScreenMenu = document.getElementById("menuOptions");
    var wideScreenLinks = document.getElementById("wideScreenLinks");
    // change to array of ids
    var firstArrayOfIds = ['popupMenu','openMenuButton','searchFieldMobile', 'searchButtonMobile', 'searchButtonMobileDefault', 'searchFieldMobileDefault'];
    var secondArrayOfIds = ['filterWeightMenu','currentWeightFilter'];
    var thirdArrayOfIds = ['filterMenu','currentFilter'];
    var fourthArrayOfIds = ['filterGenderMenu','currentGenderFilter'];
    var fifthArrayOfIds = ['menuOptions', 'pageName'];
    document.onclick = async function(e){
        if(!firstArrayOfIds.includes(e.target.id)){
            popupmenu.style.display = 'none';
            openpopupmenu.style.display = 'block';   
            searchButton.style.display = 'block';  
            searchInput.style.display = 'none';
          }
        if(!secondArrayOfIds.includes(e.target.id)){
            if(weightfilter != null){
                weightfilter.style.display = 'none';   
            }
        }
        if(!thirdArrayOfIds.includes(e.target.id)){
            if(filter != null){
                filter.style.display = 'none';   
            }
        }
        if(!fourthArrayOfIds.includes(e.target.id)){
            if(genderfilter != null){
                genderfilter.style.display = 'none';   
            }
        }
        if(!fifthArrayOfIds.includes(e.target.id)){
            if(wideScreenMenu != null){
                wideScreenMenu.style.opacity = '0'; 
                //await sleep(600);  
                wideScreenLinks.style.display = 'none';
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
    var z = document.getElementById("searchButtonMobileDefault");
    var q = document.getElementById("searchFieldMobileDefault");
    x.style.display = ("block");
    y.style.display = ("none");
    z.style.display = ("none");
    q.style.display = ("none");
    await searchOnEnterPress("searchFieldMobile", "searchButtonMobile");
}
async function closeMenu() {
    var x = document.getElementById("popupMenu");
    var y = document.getElementById("openMenuButton");
    var q = document.getElementById("openMenuLogo");
    var z = document.getElementById("searchButtonMobileDefault");
    x.style.display = ("none");
    y.style.display = ("block");
    q.style.display = ("block");
    z.style.display = ("block");
}
// async function closeDivFromOutside(){
//     document.onclick=function(div){
//         var x = document.getElementById("popupMenu");
//         var y = document.getElementById("openMenuButton");
//         if(div.target.id !== 'popupMenu'){
//             x.style.display = ("none");
//             y.style.display = ("block");
//         }
//     }
// }
async function addImagesToFighterPreviewBox(){
    var randomFighterImagesData = await fetchData('/getRandomFighterImages');
    for(var i =0;i <8;i++ ){
        //elements seem to start filling from center and work their way left
        //also need anchor tag here?
        var testImage = document.createElement('img');
        if(randomFighterImagesData.recordset[i].ImageReference != null){
            testImage.src = randomFighterImagesData.recordset[i].ImageReference;
        }
        else{
            testImage.src = 'img/logo.png';
        }
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
var first = true;
async function loadFighterCatalogueAsGrid(fighterCatalogueData){
    document.getElementById("catalogueLoadingGif").style.display = 'block';
    grid = true;
    table = false;
    dataArray = [];
    var i =0;
    //load catalogue as grid
    //change loop to use the data array slice
    if(first == false){
        begin = end;
        end = end+itemsPerCatalogue;
    }
    first = false;
    dataArray.push(fighterCatalogueData.recordset); 
    var arraySlice = dataArray[0].slice(begin,end);
    for (var key in arraySlice) {
        var catalogueEntryDiv = document.createElement('div');
        var fighterImage = document.createElement('img');
        var nameParagraph = document.createElement('p');
        var linkToCard = document.createElement('a');
        linkToCard.id = 'linktocardid'+i;
        nameParagraph.textContent = arraySlice[key].BoxerName; 
        nameParagraph.id = 'fighternameid'+i;
        fighterImage.className = 'catalogueimage';
        if(arraySlice[key].ImageReference != null){
            fighterImage.src = '/'+arraySlice[key].ImageReference;
        }
        else{
            fighterImage.src = '/img/logo.png'
        }
        fighterImage.id = 'fighterimageid'+i;    
        linkToCard.appendChild(fighterImage);
        linkToCard.appendChild(nameParagraph);
        linkToCard.style.cursor = 'pointer';

        linkToCard.href = '/fighterCard/'+arraySlice[key].BoxerName;

        catalogueEntryDiv.className = 'catalogueentry';
        catalogueEntryDiv.id = 'catalogueentry'+i;
        catalogueEntryDiv.appendChild(linkToCard);
        
         
        //can append items to grid here
        document.getElementById('CatalogueGrid').appendChild(catalogueEntryDiv);
        
        i++;             
    }
    document.getElementById("catalogueLoadingGif").style.display = 'none';
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
    //for scrolling listener comment out loadGridData
    //create buttons
    //await loadGridData(currentPage);
    var existingCatalogueDiv = document.getElementsByClassName('catalogueentry');

    if(i === 0 && dataArray[0].length === 0 && !errorDivCreated){
        //empty data set
        await createErrorDiv('','No results found for filter selection');
        errorDivCreated = true;
    }
    else if (i === 0 && typeof existingCatalogueDiv != undefined){
        //end of data set
        endOfSearchData = true;
    }

}
var currentPage = 1;
var numPages = 0;
var pageLinksArray = [];

// async function displayPageLinks(){
//     var nextPageLimit;
//     var previousPageLimit;
//     var endLimit = pageLinksArray.length-1;
//     var nextPagesToHideArray = [];
//     var prevPagesToHideArray = [];

//     var stylecurrentpage = currentPage-1;
//     if(pageLinksArray.length != 0){
//         document.getElementById('pagelink'+stylecurrentpage).style.textDecoration = 'none';
//         document.getElementById('pagelink'+stylecurrentpage).style.color = '#2b7a8a';
//     }

//     if(currentPage == 1 && pageLinksArray.length > 1){
//         nextPageLimit = currentPage+3;
//         var dots = document.createElement('a');
//         dots.textContent = '...';
//         dots.className = 'spacebetweenpages';
//         dots.id = 'dotsahead';
//         document.getElementById('pagelink'+nextPageLimit).parentNode.insertBefore(dots, document.getElementById('pagelink'+nextPageLimit));
 
//     }
//     else if(currentPage == 2){
//         nextPageLimit = currentPage+2;
//         var dots = document.createElement('a');
//         dots.textContent = '...';
//         dots.className = 'spacebetweenpages';
//         dots.id = 'dotsahead';
//         document.getElementById('pagelink'+nextPageLimit).parentNode.insertBefore(dots, document.getElementById('pagelink'+nextPageLimit));
//     }
//     else{
//         nextPageLimit = currentPage+1;
//         var dots = document.createElement('a');
//         dots.textContent = '...';
//         dots.className = 'spacebetweenpages';
//         dots.id = 'dotsbehind';
//         var dots2 = document.createElement('a');
//         dots2.textContent = '...';
//         dots2.className = 'spacebetweenpages';
//         dots2.id = 'dotsahead';
//         var spacefordotsbehind = currentPage-2;
//         var spacefordotsahead = currentPage+2;
//         if(spacefordotsbehind >= 2){
//             document.getElementById('pagelink'+spacefordotsbehind).parentNode.insertBefore(dots, document.getElementById('pagelink'+spacefordotsbehind));
//         }
//         if(spacefordotsahead < pageLinksArray.length){
//             document.getElementById('pagelink'+spacefordotsahead).parentNode.insertBefore(dots2, document.getElementById('pagelink'+spacefordotsahead));
//         }
//     }
//     if(currentPage >1){
//         previousPageLimit = currentPage-2;
//         for(var i = previousPageLimit; i>0;i--){
//             prevPagesToHideArray.push(pageLinksArray[i]);
//         }
//         for(var i = prevPagesToHideArray.length-1; i>0;i--){
//             document.getElementById(prevPagesToHideArray[i].id).style.display = 'none';
//         }
//     }

//     nextPagesToHideArray = pageLinksArray.slice(nextPageLimit, endLimit);
    
//     for(var data in nextPagesToHideArray){
//         document.getElementById(nextPagesToHideArray[data].id).style.display = 'none';
//     }
// }
// async function createPageLinks(length){ 
//     pageLinksArray=[];
//     var previousButton = document.createElement('a');
//     previousButton.textContent = '«';
//     previousButton.id = 'cataloguePrevious';
//     previousButton.className = 'cataloguepagelink';
//     previousButton.onclick = async function(divId){
//         divId = this.id;
//         await loadGridData(divId);
//     }    
//     document.getElementById('catalogueButtonsLink').appendChild(previousButton);

//     numPages = Math.ceil(length/itemsPerCatalogue);
//     for(var i =0;i<numPages;i++){
//         var pageLink = document.createElement('a');
//         var pagenum=i+1;
//         pageLink.textContent = pagenum;
//         pageLink.id = 'pagelink'+i;
//         pageLink.className = 'cataloguepagelink';
//         document.getElementById('catalogueButtonsLink').appendChild(pageLink); 
//         pageLink.onclick = async function(divId){
//                         divId = this.id;
//                         await goToPage(divId);
//                     }
//         pageLinksArray.push(pageLink);
//     }
//     await displayPageLinks();
//     var nextButton = document.createElement('a');
//     nextButton.textContent = '»';
//     nextButton.id = 'catalogueNext';
//     nextButton.className = 'cataloguepagelink';
//     nextButton.onclick = async function(divId){
//         divId = this.id;
//         await loadGridData(divId);
//     }    
//     document.getElementById('catalogueButtonsLink').appendChild(nextButton);
// }
// async function goToPage(page){ 
//     var pagetext;
//     var pageint;
// if(Number.isInteger(page)){
//     pageint = page;
// }
// else{
//     pagetext = document.getElementById(page);
//     pageint = parseInt(pagetext.textContent);
// }
// currentPage = pageint;
// var newArray = [];
//     if(pageint == 1){
//         begin = 0;
//         end = itemsPerCatalogue;
//         newArray.push(dataArray.slice(begin,end));
//         await clearCatalogue();
//         if((document.getElementById('CatalogueTable') == undefined) && table){
//             await createCatalogueTable();
//         }
//         for(var data in newArray[0]){
//             if(grid){
//                 document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
//             }
//             else if (table){
                
//                 document.getElementById('CatalogueTable').appendChild(newArray[0][data]);
//             }
//         } 
//         await createPageLinks(dataArray.length);
//     }
//     else{
//         end = (pageint*itemsPerCatalogue);
//         begin = end-itemsPerCatalogue;
//         newArray.push(dataArray.slice(begin,end));
//         await clearCatalogue();
//         if((document.getElementById('CatalogueTable') == undefined) && table){
//             await createCatalogueTable();
//         }
//         for(var data in newArray[0]){
//             if(grid){
//                 document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
//             }
//             else if (table){
//                 document.getElementById('CatalogueTable').appendChild(newArray[0][data]);
//             }
//         } 
//         await createPageLinks(dataArray.length);
//     }
// }


// async function loadGridData(page){
//     var newArray = [];
//     if(page === undefined){
//         await createPageLinks(dataArray.length);
//         for(var data in dataArray.slice(0,itemsPerCatalogue)){
//             if(grid){
//                 document.getElementById('CatalogueGrid').appendChild(dataArray[data]);
//             }
//             else if(table){
//                 document.getElementById('CatalogueTable').appendChild(dataArray[data]);                
//             }
//         }
//     }
//     else if(Number.isInteger(page)){
//         await goToPage(page);
//     }
//     else{
//         var pageNumber = document.getElementById(page);
//         if(pageNumber.id==='catalogueNext'){
//             end=end+itemsPerCatalogue;
//             begin=end-itemsPerCatalogue;
//             newArray.push(dataArray.slice(begin,end));
//             if(newArray[0].length > 0){
//                 await clearCatalogue();
//                 if((document.getElementById('CatalogueTable') == undefined) && table){
//                     await createCatalogueTable();
//                 }
//                 for(var data in newArray[0]){
//                     if(grid){
//                         document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
//                     }
//                     else if(table){
//                         document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
//                     }                    
//                 } 
//                 currentPage++;
//                 await createPageLinks(dataArray.length);
//             }
//             else{
//                 begin=begin-itemsPerCatalogue;
//                 end=end-itemsPerCatalogue;
//             }
//         }
//         if(pageNumber.id==='cataloguePrevious'){
//             if(begin>0){
//                 await clearCatalogue();
//                 end=end-itemsPerCatalogue;
//                 begin=end-itemsPerCatalogue;
//                 if(begin<1 && end<itemsPerCatalogue){
//                     begin=0;
//                     end=itemsPerCatalogue;
//                     newArray.push(dataArray.slice(begin,end));
//                     if((document.getElementById('CatalogueTable') == undefined) && table){
//                         await createCatalogueTable();
//                     }
//                     for(var data in newArray[0]){
//                         if(grid){
//                             document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
//                         }
//                         else if(table){
//                             document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
//                         }  
//                     } 
//                     currentPage--;
//                     await createPageLinks(dataArray.length);
//                 }
//                 else{
//                     newArray.push(dataArray.slice(begin,end));
//                     if((document.getElementById('CatalogueTable') == undefined) && table){
//                         await createCatalogueTable();
//                     }
//                     for(var data in newArray[0]){
//                         if(grid){
//                             document.getElementById('CatalogueGrid').appendChild(newArray[0][data]);
//                         }
//                         else if(table){
//                             document.getElementById('CatalogueTable').appendChild(newArray[0][data]);                
//                         }  
//                     } 
//                     currentPage--;
//                     await createPageLinks(dataArray.length);
//                 }
//             }
//         }              
//     }
// }
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
    var tableHeadingLast5 = document.createElement('th');
    tableHeadingLast5.textContent = 'Last 5 Fights';          
    tableHeadingLast5.className = 'cataloguetableheading';    
    tableHeadingLast5.id = 'CatalogueTableLast5';
    tableHeadingRow.appendChild(tableHeadingLast5);  
    catalogueTable.appendChild(tableHeadingRow);
}
var globalCatalogueListCount = 1;
async function loadFighterCatalogueAsList(fighterCatalogueData){
    grid = false;
    table = true;
    //await clearCatalogue();
    dataArray = [];
    namesArrayForLast5Fights = [];
    if(first == false){
        begin = end;
        end = end+itemsPerCatalogue;
    }
    else if (first){
        await createCatalogueTable();
    }
    first = false;
    dataArray.push(fighterCatalogueData.recordset); 
    var arraySlice = dataArray[0].slice(begin,end);
    var i =0;
    var numberList = 1;
    for (var key in arraySlice) {
        var tableRow = document.createElement('tr');
        var tableData = document.createElement('td');
        var tableData2 = document.createElement('td');
        var tableData3 = document.createElement('td');
        var tableData4 = document.createElement('td');
        var nameParagraph = document.createElement('p');
        var linkToCard = document.createElement('a');

        tableRow.id ='CatalogueTableRowId'+globalCatalogueListCount;
        linkToCard.id = arraySlice[key].BoxerName;
        linkToCard.className = 'linktofightercataloguetable';
        tableData.className='cataloguetablename';
        tableData2.className='cataloguetablerecord';
        tableData3.className='cataloguetabledivision';
        tableData4.className='cataloguetablelast5';
        nameParagraph.textContent = globalCatalogueListCount+'.'+' '+arraySlice[key].BoxerName; 
        nameParagraph.id = 'fighternameid'+globalCatalogueListCount;
        linkToCard.href = '/fighterCard/'+arraySlice[key].BoxerName;
        if(countriesArray.includes(arraySlice[key].Nationality)){
                var countryFlagImg = await getFlag(arraySlice[key].Nationality, 'countryflagimgcatalogue');
                nameParagraph.appendChild(countryFlagImg);
            }
        var wins = document.createElement('span');
        wins.textContent= arraySlice[key].Wins;
        wins.className='totalwins';

        var slash1 =document.createElement('span');
        slash1.textContent = '/';

        var slash2 =document.createElement('span');
        slash2.textContent = '/';

        var losses = document.createElement('span');
        losses.textContent = arraySlice[key].Losses;
        losses.className='totallosses';
        var draws = document.createElement('span');
        draws.textContent= arraySlice[key].Draws;
        draws.className='totaldraws';        
        tableData2.appendChild(wins);
        tableData2.appendChild(slash1);                
        tableData2.appendChild(losses); 
        tableData2.appendChild(slash2);                    
        tableData2.appendChild(draws); 

        var division = document.createElement('span')      
        division.textContent= arraySlice[key].Division;

        division.style.color='black';
        tableData3.appendChild(division);
        if(arraySlice[key].last5 != null){
            var fightResult;
            var isFinished = false;
            for(var counter = 0;counter <= winsArray.length-1;counter++){
                if(arraySlice[key].last5.includes(winsArray[counter]) 
                || arraySlice[key].last5.includes(lossArray[counter]) 
                || arraySlice[key].last5.includes(drawArray[counter])){
                    var splitString = arraySlice[key].last5.split(',');
                    if(!isFinished){
                        for(var splitCounter = 0; splitCounter <= splitString.length - 1; splitCounter++){
                            splitString[splitCounter] = splitString[splitCounter].trim();
                            if(winsArray.includes(splitString[splitCounter]))
                            {
                                fightResult = document.createElement('div');
                                fightResult.className = 'last5box';
                                fightResult.style.backgroundColor = 'green';
                    
                            }
                            if(lossArray.includes(splitString[splitCounter]))
                            {
                                fightResult = document.createElement('div');
                                fightResult.className = 'last5box';
                                fightResult.style.backgroundColor = '#CE2029';
                            }
                            if(drawArray.includes(splitString[splitCounter]))
                            {
                                fightResult = document.createElement('div');
                                fightResult.className = 'last5box';
                                fightResult.style.backgroundColor = '#2d545e';
                            }    
                            tableData4.appendChild(fightResult);  
                            isFinished = true;
                        }
                    }
                }
            }
        }

        linkToCard.appendChild(nameParagraph);
        tableData.appendChild(linkToCard);
        tableRow.appendChild(tableData);
        tableRow.appendChild(tableData2);
        tableRow.appendChild(tableData3);
        tableRow.appendChild(tableData4);
        tableRow.className = 'cataloguetablerow';
        document.getElementById('CatalogueTable').appendChild(tableRow);
        //dataArray.push(tableRow);

        globalCatalogueListCount++;
        numberList++;
    }
    // var fightHistory = await fetchData('/testArrayInput/',namesArrayForLast5Fights);
    // console.log(namesArrayForLast5Fights);
    // console.log(namesArrayForLast5Fights[0]);
    // console.log("length is "+namesArrayForLast5Fights.length);
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
    //await loadGridData(currentPage);
    document.getElementById("catalogueLoadingGif").style.display = 'none';
    var existingCatalogueDiv = document.getElementsByClassName('cataloguetable');

    if(globalCatalogueListCount === 1 && dataArray[0].length === 0 && !errorDivCreated){
        //empty data set
        await clearCatalogue();
        await createErrorDiv('','No results found for filter selection');
        errorDivCreated = true;
    }
    else if (globalCatalogueListCount === 0 && typeof existingCatalogueDiv != undefined){
        //end of data set
        endOfSearchData = true;
    }
}

async function changeCatalogueView(param){
    var selectedGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    var viewParam = '';
    if(document.getElementById(param).id === 'GridViewButton'){
        isList = false;
        isGrid = true;
        viewParam = 'Grid';
    }
    if(document.getElementById(param).id === 'ListViewButton'){
        isGrid = false;
        if(isList === false){
            isList = true;
            viewParam = 'List';
        }
    }
    window.location.href = '/fighterCatalogue/'+currentSortingFilter +'/'+currentWeightFilter+'/'+selectedGenderFilter+'/'+viewParam;
}
async function loadFighterCatalogue(){
    var currentSortingFilter = document.getElementById("currentFilter").textContent; 
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var fighterCatalogueData = await fetchData('/sortBoxerCatalogue/',currentSortingFilter+'/',currentWeightFilter+'/',currentGenderFilter);
    var viewParam = document.getElementById("viewParam").textContent;

    var dropdownArray = ['allWeights', 'heavyweight', 'cruiserweight', 'lightheavyweight', 
    'supermiddleweight', 'middleweight', 'lightmiddleweight', 'welterweight','lightweight','superfeatherweight','featherweight',
    'superbantamweight', 'bantamweight', 'superflyweight', 'flyweight', 'lightflyweight', 'minimumweight', 'alphabeticalFilter', 
    'rankingFilter', 'randomFilter', 'men', 'women'];
    //remove current option from dropdown list
    for(var i = 0; i < dropdownArray.length-1;i++){
        if(currentWeightFilter == document.getElementById(dropdownArray[i]).textContent){
            document.getElementById(dropdownArray[i]).style.display = 'none';
        }
        else if(currentSortingFilter == document.getElementById(dropdownArray[i]).textContent){
            document.getElementById(dropdownArray[i]).style.display = 'none';
        }
        if(currentGenderFilter == document.getElementById(dropdownArray[i]).textContent){
            document.getElementById(dropdownArray[i]).style.display = 'none';
        }
    }

    if(viewParam === undefined ){
        if(isGrid === true){
            await loadFighterCatalogueAsGrid(fighterCatalogueData);
        }
        if(isList === true){
            await loadFighterCatalogueAsList(fighterCatalogueData);
        }
    }
    else{
        if(viewParam === 'Grid'){
            await loadFighterCatalogueAsGrid(fighterCatalogueData);
        }
        else if(viewParam ==='List'){
            await loadFighterCatalogueAsList(fighterCatalogueData);
        }
    }
}
// async function navigateToFighterCard(divId){
//     var boxerName = divId.textContent;
//     window.location.href = 'fighterCard/'+boxerName;
// }
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
var mainFilterToHide ='';
async function filterAlphabeticalRankingRandom(id) {
    var selectedGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentSortingFilter = document.getElementById(id).textContent;
    var viewType = document.getElementById('viewParam').textContent;

    window.location.href = '/fighterCatalogue/'+currentSortingFilter +'/'+currentWeightFilter+'/'+selectedGenderFilter+'/'+viewType;    
}
window.onscroll = async function ()
{
    await TriggerJumpToTopButton();
};

async function TriggerJumpToTopButton() {
    var x = document.getElementById("jumpToTopButtonSpace");
    if (document.body.scrollTop > 1500 || document.documentElement.scrollTop > 1500) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
async function jumpToTop() {
    window.scrollY = 0; document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
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
var weightFilterToHide ='';
async function filterWeightClass(id) {
    var selectedGenderFilter = document.getElementById("currentGenderFilter").textContent;
    var currentWeightFilter = document.getElementById(id).textContent;
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    var viewType = document.getElementById('viewParam').textContent;

    window.location.href = '/fighterCatalogue/'+currentSortingFilter +'/'+currentWeightFilter+'/'+selectedGenderFilter+'/'+viewType;
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
var genderFilterToHide ='';
async function filterGender(id) {
    var selectedGenderFilter = document.getElementById(id).textContent;
    var currentWeightFilter = document.getElementById("currentWeightFilter").textContent;
    var currentSortingFilter = document.getElementById("currentFilter").textContent;
    var viewType = document.getElementById('viewParam').textContent;

    window.location.href = '/fighterCatalogue/'+currentSortingFilter +'/'+currentWeightFilter+'/'+selectedGenderFilter+'/'+viewType;
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
    if(searchButton === 'mobileButtonForSearch'){
        searchField = document.getElementById('searchFieldMobileDefault').value;
    }
    if(searchField != ''){
        window.location.href = '/searchResults/'+searchField;
    }
}
async function loadUpcomingFightsData(){
    var upcomingFightsData = await fetchData('/getUpcomingFights');
    var upcomingFightsNamesData = await fetchData('/getUpcomingFighterNames');
    var upcomingFightsRecordsData = await fetchData('/getUpcomingFighterRecords');
    var upcomingFightsStatsData = await fetchData('/getUpcomingFighterStats');
    var upcomingFightsImagesData = await fetchData('/getUpcomingFighterImages');   
    try{
    //heading
    document.getElementById('upComingFightDivision').textContent = upcomingFightsData.recordset[0].FightDivision;
    document.getElementById('upComingFightLocation').textContent = upcomingFightsData.recordset[0].FightLocation;
    document.getElementById('upComingFightDate').textContent = upcomingFightsData.recordset[0].FightDate;
    document.getElementById('upComingFightName').textContent  = upcomingFightsNamesData.recordset[0].BoxerName[0] + ' vs ' +upcomingFightsNamesData.recordset[0].BoxerName[1];
    
    //names
    document.getElementById('fighterAName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('fighterBName').textContent = upcomingFightsNamesData.recordset[0].BoxerName[1];
    //images
    try{
        document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[0].ImageReference[0];
        document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[0].ImageReference[1];
    }
    catch(exception){
        document.getElementById('fighterAImage').src = '/img/logo.png';
        document.getElementById('fighterBImage').src = '/img/logo.png';
    }
    //links
    document.getElementById('fighterbuttonAFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('fighterbuttonBFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[1];
    document.getElementById('fighterALink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('fighterBLink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[1];    
    document.getElementById('toFighterLinkA').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[0];
    document.getElementById('toFighterLinkB').href = 'fighterCard/'+upcomingFightsNamesData.recordset[0].BoxerName[1]; 
    var fighterAName = document.getElementById('fighterAName').textContent;
    var fighterBName = document.getElementById('fighterBName').textContent;


    //overall records
    document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[0].Wins[0];
    document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].Losses[0];
    document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].Draws[0];
    document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[0].Wins[1];
    document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[0].Losses[1];
    document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[0].Draws[1];
    
    //stats - replace with loop
    document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[0].Height[0];
    document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[0].Height[1];
    document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[0].Reach[0];
    document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[0].Reach[1];
    document.getElementById('fighterAStance').textContent = upcomingFightsStatsData.recordset[0].Stance[0];
    document.getElementById('fighterBStance').textContent = upcomingFightsStatsData.recordset[0].Stance[1];    
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



    //last 5 fights
    var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
    var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);

    var i = 0;
    var j = 0;
    var fhcountA = 1;
    var fhcountB = 1;
    if(screen.width <= 420){
        document.getElementById("last5DateColumnA").style.display = 'none';
        document.getElementById("last5DateColumnB").style.display = 'none';
    }
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

            if ( fhcountA && (fhcountA % 3 === 2)) {
                testData.textContent = '';
                var fighterLink = document.createElement('a');
                fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                fighterLink.className = 'fighthistorytablecelllink'
                testData.appendChild(fighterLink);
            } 
            if ( fhcountA && (fhcountA % 3 === 1)) { 
                if(screen.width<=420){
                    testData.textContent ='';
                }
                else{
                    testRow.appendChild(testData);
                }
            } 
            else{
                testRow.appendChild(testData);
            }  
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
            if ( fhcountB && (fhcountB % 3 === 2)) {
                testData.textContent = '';
                var fighterLink = document.createElement('a');
                fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                fighterLink.className = 'fighthistorytablecelllink'
                testData.appendChild(fighterLink);
            } 
            if ( fhcountB && (fhcountB % 3 === 1)) { 
                if(screen.width<=420){
                    testData.textContent ='';
                }
                else{
                    testRow.appendChild(testData);
                }
            } 
            else{
                testRow.appendChild(testData);
            }  
            document.getElementById('Last5TableB').appendChild(testRow);
            fhcountB++;
        }
        j++;
    }
    }
    catch(exception){
        console.log(exception)
    }
}
async function nextFight(){
    if(upcomingFightCount !=2){
        try{
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
            //images
            try{
                document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].ImageReference[0];
                document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].ImageReference[1];
            }
            catch(exception){
                document.getElementById('fighterAImage').src = '/img/logo.png';
                document.getElementById('fighterBImage').src = '/img/logo.png';
            }
            //links
            document.getElementById('fighterbuttonAFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('fighterbuttonBFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];
            document.getElementById('fighterALink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('fighterBLink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];   
            document.getElementById('toFighterLinkA').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('toFighterLinkB').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1]; 
    
            //overall records
            document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Wins[0];
            document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Losses[0];
            document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Draws[0];
            document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Wins[1];
            document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Losses[1];
            document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Draws[1];   
        
            //stats
            document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[0];
            document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[1];
            document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[0];
            document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[1];
            document.getElementById('fighterAStance').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Stance[0];
            document.getElementById('fighterBStance').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Stance[1];   
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
        
            //last 5 fights
            var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
            var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);
    
            var i = 0;
            var j = 0;
            var fhcountA = 1;
            var fhcountB = 1;
    
            await clearlast5();
            if(screen.width <= 420){
                document.getElementById("last5DateColumnA").style.display = 'none';
                document.getElementById("last5DateColumnB").style.display = 'none';
            }
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
                    if ( fhcountA && (fhcountA % 3 === 2)) {
                        testData.textContent = '';
                        var fighterLink = document.createElement('a');
                        fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                        fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                        fighterLink.className = 'fighthistorytablecelllink'
                        testData.appendChild(fighterLink);
                    } 
                    if ( fhcountA && (fhcountA % 3 === 1)) { 
                        if(screen.width<=420){
                            testData.textContent ='';
                        }
                        else{
                            testRow.appendChild(testData);
                        }
                    } 
                    else{
                        testRow.appendChild(testData);
                    }  
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
                    if ( fhcountB && (fhcountB % 3 === 2)) {
                        testData.textContent = '';
                        var fighterLink = document.createElement('a');
                        fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                        fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                        fighterLink.className = 'fighthistorytablecelllink'
                        testData.appendChild(fighterLink);
                    } 
                    if ( fhcountB && (fhcountB % 3 === 1)) { 
                        if(screen.width<=420){
                            testData.textContent ='';
                        }
                        else{
                            testRow.appendChild(testData);
                        }
                    } 
                    else{
                        testRow.appendChild(testData);
                    }  
                    document.getElementById('Last5TableB').appendChild(testRow);
                    fhcountB++;
                }
                j++;
            }
        }
        catch(exception){
            console.log(exception)
        }
        }
}
async function previousFight(){
    if(upcomingFightCount != 0){
        try{
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
            //images
            try{
                document.getElementById('fighterAImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].ImageReference[0];
                document.getElementById('fighterBImage').src = upcomingFightsImagesData.recordset[upcomingFightCount].ImageReference[1];
            }
            catch(exception){
                document.getElementById('fighterAImage').src = '/img/logo.png';
                document.getElementById('fighterBImage').src = '/img/logo.png';
            }
            //links
            document.getElementById('fighterbuttonAFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('fighterbuttonBFull').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];
            document.getElementById('fighterALink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('fighterBLink').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1];   
            document.getElementById('toFighterLinkA').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[0];
            document.getElementById('toFighterLinkB').href = 'fighterCard/'+upcomingFightsNamesData.recordset[upcomingFightCount].BoxerName[1]; 
    
            //overall records
            document.getElementById('fighterAInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Wins[0];
            document.getElementById('fighterAInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Losses[0];
            document.getElementById('fighterAInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Draws[0];
            document.getElementById('fighterBInfoWins').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Wins[1];
            document.getElementById('fighterBInfoLosses').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Losses[1];
            document.getElementById('fighterBInfoDraws').textContent = upcomingFightsRecordsData.recordset[upcomingFightCount].Draws[1];   
            
            //stats
            document.getElementById('fighterAHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[0];
            document.getElementById('fighterBHeight').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Height[1];
            document.getElementById('fighterAReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[0];
            document.getElementById('fighterBReach').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Reach[1];
            document.getElementById('fighterAStance').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Stance[0];
            document.getElementById('fighterBStance').textContent = upcomingFightsStatsData.recordset[upcomingFightCount].Stance[1];   
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
            
            //last 5 fights
            var upcomingFightsLastFiveDataA = await fetchData('/getUpcomingFighterLastFiveFightsA/',fighterAName);
            var upcomingFightsLastFiveDataB = await fetchData('/getUpcomingFighterLastFiveFightsB/',fighterBName);
    
            var i = 0;
            var j = 0;
            var fhcountA = 1;
            var fhcountB = 1;
    
            await clearlast5();
            if(screen.width <= 420){
                document.getElementById("last5DateColumnA").style.display = 'none';
                document.getElementById("last5DateColumnB").style.display = 'none';
            }
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
                    if ( fhcountA && (fhcountA % 3 === 2)) {
                        testData.textContent = '';
                        var fighterLink = document.createElement('a');
                        fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataA.recordset[key][key1];
                        fighterLink.textContent = upcomingFightsLastFiveDataA.recordset[key][key1];
                        fighterLink.className = 'fighthistorytablecelllink'
                        testData.appendChild(fighterLink);
                    } 
                    if ( fhcountA && (fhcountA % 3 === 1)) { 
                        if(screen.width<=420){
                            testData.textContent ='';
                        }
                        else{
                            testRow.appendChild(testData);
                        }
                    } 
                    else{
                        testRow.appendChild(testData);
                    }   
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
                    if ( fhcountB && (fhcountB % 3 === 2)) {
                        testData.textContent = '';
                        var fighterLink = document.createElement('a');
                        fighterLink.href = 'fighterCard/'+upcomingFightsLastFiveDataB.recordset[key][key1];
                        fighterLink.textContent = upcomingFightsLastFiveDataB.recordset[key][key1];
                        fighterLink.className = 'fighthistorytablecelllink'
                        testData.appendChild(fighterLink);
                    } 
                    if ( fhcountB && (fhcountB % 3 === 1)) { 
                        if(screen.width<=420){
                            testData.textContent ='';
                        }
                        else{
                            testRow.appendChild(testData);
                        }
                    } 
                    else{
                        testRow.appendChild(testData);
                    }               
                    document.getElementById('Last5TableB').appendChild(testRow);
                    fhcountB++;
                }
                j++;
            }        
        }
        catch(exception){
            console.log(exception)
        }
        }
}