function loadPageName() {
    var docTitle = document.title;
    var pageName = document.getElementById("pageName");
    //var pageNameMobile = document.getElementById("pageNameMobile");
    var homeLink = document.getElementById("homeLink");
    var fighterCatalogueLink = document.getElementById("fighterCatalogueLink");

    pageName.innerHTML = docTitle + "&ensp;&#8595;";
    //pageNameMobile.innerHTML = docTitle;
    if (docTitle == "Home") {
        console.log("if doctitle = home");
        homeLink.style.display = 'none';
        loadDefaultUpcomingFightsData();
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
function loadDefaultUpcomingFightsData() {
    //var x = document.getElementById("testText");
    var fightName = document.getElementById("upComingFightName");
    var fightDivision = document.getElementById("upComingFightDivision");
    var fightLocation = document.getElementById("upComingFightLocation");
    var fightDate = document.getElementById("upComingFightDate");

    fetch('../dbfile.json')
        .then((response) => {
        return response.json();
        })
        .then((myJson) => {
            console.log(myJson);
            fightLocation.innerHTML = myJson.objects[5].rows[0][3];
            fightDate.innerHTML = myJson.objects[5].rows[0][4];
            fightDivision.innerHTML = myJson.objects[5].rows[0][5];
            fightName.innerHTML = myJson.objects[0].rows[0][1] +" vs "+myJson.objects[0].rows[1][1];
    });
}
function start() {
    loadPageName();
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
