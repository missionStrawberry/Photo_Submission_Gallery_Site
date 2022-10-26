//-------------------------------------------------------------------
// handles search, sort, filter, lightbox,approving images,
// ajax calls to update/obtain various info, & associated css changes
//-------------------------------------------------------------------

// in ajax success call to submit changes make sure data not null & data.length > 0 then make error visible
// when lightbox or edit all is closed make it hidden

var results = []; // all JSON data
var searchResults = []; // JSON data from search or sort performed
var xmlhttp = new XMLHttpRequest();
var url = (window.location.href).substring(0, (window.location.href).lastIndexOf("/")) + "/galleryinfo.php";
var toDelete = []; // images to be deleted by moderator
var imgs = []; // used to delete thumbnails
var lightbox = true; // false when thumbnail should be selected instead of showing its lightbox
var index; // index of the JSON info to change from lightbox
var isModhome = false; // true if on moderator gallery
var editAll = false; // true if in edit views for all images
var searchTerms; // string that user searched for
var clear = false; // true if search needs to be cleared

xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        results = JSON.parse(xmlhttp.responseText);
    } // if
}

// displays user-selected photo name in file input of form
function showFileName() {
    document.getElementById("fileLabel").innerHTML = document.getElementById('file').value.replace('C:\\fakepath\\', '');
    document.getElementById("fileLabel").classList.remove("text-secondary");
} // showFileName

// exits lightbox & its edit views
function exit() {
    if (isModhome) {
        document.getElementById("editBtn").href = "javascript:edit()";
        document.getElementById("editBtn").innerHTML = "Edit";
        document.getElementById("change").style.display = "none";
        document.getElementById("lightboxInfo").style.display = "block";
        document.getElementById("msgHolder").style.display = "none";
    } // if
    document.getElementById("hidden").style.display = "none";
} // exit

// updates results array
function getJson() {
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    // user can press 'ENTER' key to search
    var input = document.getElementById("search");
    if (input != null) {
        input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("searchButton").click();
            } // if
        });
    } // if
} // getJson

// show the lightbox with big image
function displayLightbox(oldSrc) {
    if (lightbox) {
        var newSrc = "uploadedimages/" + oldSrc;
        var loaded = document.getElementsByClassName("loaded");

        // display edit button if in moderator gallery
        if (isModhome) {
            document.getElementById("editBtn").href = "javascript:edit()";
            document.getElementById("editBtn").innerHTML = "Edit";
            document.getElementById("change").style.display = "none";
            document.getElementById("lightboxInfo").style.display = "block";
        } // if

        // clear lightbox JSON
        document.getElementById("lightboxInfo").innerHTML = "";

        loaded[0].src = newSrc;
        loaded[0].id = "big_" + oldSrc;

        // finds the JSON info for the image
        for (var i = 0; i < results.length; i++) {
            if (results[i].imagefile.search(oldSrc) != -1) {
                displayResults(i);
                break;
            } // if
        } // for

        document.getElementById("hidden").style.display = "block";
    } // if
} // displayLightbox

// shows the information for the lightbox
function displayResults(i) {
    var out = "";

    // gets the firstname, lastname, description, & tags for the image
    out += results[i].firstname + ' ' + results[i].lastname
        + '<br>' + results[i].description + '<br>' + results[i].tags;

    index = i;
    document.getElementById("lightboxInfo").innerHTML = out;
} // displayResults

// shows edit fields for all images
function loadEdits() {
    var infos = document.getElementsByClassName("infos");
    var containers = document.getElementsByClassName("contain");

    searchResults = results.slice();
    searchImgs();
    
    // hide error message
    document.getElementById("submitMsg").style.display = "none";

    // puts image data into fields
    for (var j = 0; j < searchResults.length; j++) {
        var thumbDiv = document.getElementById(searchResults[j].imagefile);
        var container = thumbDiv.children[1];
        var childInfos = container.children;
        childInfos[0].value = searchResults[j].firstname;
        childInfos[1].value = searchResults[j].lastname;
        childInfos[2].value = searchResults[j].description;
        childInfos[3].value = searchResults[j].tags;
        container.style.display = "block";
    } // for

    disableNav();
    // disable 'delete' button & show submit/exit
    document.getElementById("del").href = "#";
    document.getElementById("del").classList.add("disabled");
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("editsBtn").href = "javascript:submitChanges()";
    document.getElementById("editsBtn").innerHTML = "submit changes";
    document.getElementById("exBtn").style.display = "inline-block";

    editAll = true;
} // loadEdits

// visually & physically stop navbar functionality
function disableNav() {
    document.getElementById("select2").disabled = true;
    document.getElementById("select").disabled = true;

    // check to see if in moderator gallery
    if (document.getElementById("dow") != null) {
        document.getElementById("dow").href = "#";
        document.getElementById("dow").classList.add("disabled");
    } else {
		
		// else in awaiting approval & make approve more noticeable
		document.getElementById("appBtn").classList.remove("btn-outline-info");
		document.getElementById("appBtn").classList.add("btn-outline-warning");
	} // else

    // certain buttons to disable if not selecting images
    if (lightbox) {
        document.getElementById("sel").href = "#";
        document.getElementById("unsel").href = "#";
        document.getElementById("sel").classList.add("disabled");
        document.getElementById("unsel").classList.add("disabled");
    } // if

    document.getElementById("log").href = "#";
    document.getElementById("log").classList.add("disabled");
    document.getElementById("modViews").href = "#";
    document.getElementById("modViews").classList.add("disabled");
    document.getElementById("search").disabled = true;
    document.getElementById("searchButton").disabled = true;
} // disableNav

// visually & physically start navbar functionality
function enableNav() {
    document.getElementById("select2").disabled = false;
    document.getElementById("select").disabled = false;

    // check to see if in moderatory gallery
    if (document.getElementById("dow") != null) {
        document.getElementById("dow").href = "javascript:downloadZip()";
        document.getElementById("dow").classList.remove("disabled");
    } else {
		// else in awaiting approval
		document.getElementById("appBtn").classList.remove("btn-outline-warning");
		document.getElementById("appBtn").classList.add("btn-outline-info");
	} // else

    // certain buttons to enable if not selecting images
    if (lightbox) {
        document.getElementById("sel").href = "javascript:toggle()";
        document.getElementById("unsel").href = "javascript:unselect()";
        document.getElementById("sel").classList.remove("disabled");
        document.getElementById("unsel").classList.remove("disabled");
    } // if

    document.getElementById("log").href = "index.php";
    document.getElementById("log").classList.remove("disabled");
    document.getElementById("modViews").href = "?page=app";
    document.getElementById("modViews").classList.remove("disabled");
    document.getElementById("search").disabled = false;
    document.getElementById("searchButton").disabled = false;
} // enableNav


// close edit all view
function exitEdits() {
    var containers = document.getElementsByClassName("contain");
    enableNav();
    
    // enable delete button
    document.getElementById("del").href = "javascript:runPhp(imgs)";
    document.getElementById("del").classList.remove("disabled");
    
    document.getElementById("editBtn").style.display = "inline-block";
    document.getElementById("editsBtn").href = "javascript:loadEdits()";
    document.getElementById("editsBtn").innerHTML = "Edit All";

    // hides the divs holding all text areas
    for (var i = 0; i < containers.length; i++) {
        containers[i].style.display = "none";
    } // for
    document.getElementById("exBtn").style.display = "none";
} // exitEdits

// shows edit fields for lightbox image
function edit() {
    var fields = document.getElementsByClassName("info");

    fields[0].value = results[index].firstname;
    fields[1].value = results[index].lastname;
    fields[2].value = results[index].description;
    fields[3].value = results[index].tags;

    document.getElementById("editBtn").href = "javascript:submitChanges()";
    document.getElementById("editBtn").innerHTML = "Submit Changes";
    document.getElementById("lightboxInfo").style.display = "none";
    document.getElementById("change").style.display = "block";
    document.getElementById("msgHolder").style.display = "none";

    editAll = false;
} // edit

// shows public, private, or all images
function sortBy() {
    searchResults = [];
    var type = null;
    var typeElement = document.getElementById("select2");
    if (typeElement == null) {
        type = "public";
    } else {
        type = document.getElementById("select2").value;
    } // else
    for (var i = 0; i < results.length; i++) {
        if (results[i].access.search(type) != -1) {
            searchResults.push(results[i]);
            document.getElementById(results[i].imagefile).style.display = "block";
        } else {
            document.getElementById(results[i].imagefile).style.display = "none";
        } // else
    } // for
} // sortBy

// sort images by first name, last name, or most recent
function sortImg() {
    var type = document.getElementById("select").value;
    if (!searchResults.length) {
        searchResults = results.slice();
    } // if

    results.sort(function (a, b) {
        var textA = "";
        var textB = "";
        if (type == "first") {
            textA = a.firstname.toUpperCase();
            textB = b.firstname.toUpperCase();
        } else if (type == "last") {
            textA = a.lastname.toUpperCase();
            textB = b.lastname.toUpperCase();
        } else {
            textA = a.UID;
            textB = b.UID;
            var compareResult = textA.localeCompare(textB);
            if (compareResult == -1) {
                return 1;
            } else if (compareResult == 1) {
                return -1;
            } else {
                return 0;
            } // else
        } // else
        return textA.localeCompare(textB);
    });

    // Update the order of the thumbnails
    var thumbs = document.getElementById("thumbsRow");
    for (var i = 0; i < results.length; i++) {
        var currentThumb = thumbs.children[i];
        currentThumb.id = results[i].imagefile;
        currentThumb.firstChild.href = "javascript:displayLightbox(\""
            + results[i].imagefile + "\")";
        var currentImg = currentThumb.firstChild.firstChild;
        currentImg.alt = results[i].description;
        currentImg.src = "thumbnails/" + results[i].imagefile;
    } // for
} // sortImg

// search images by tags, name, or description
function searchImgs() {
    newSearchResults = [];

    // use user's search terms if x in search bar not clicked
    if (!clear) {
        searchTerms = document.getElementById("search").value;
        searchTerms = searchTerms.toLowerCase();
    } // if

    var id;

    // redo thumbnail order
    sortImg();
    sortBy();

    // looks for search matches
    for (var i = 0; i < searchResults.length; i++) {
        if (!searchResults[i].tags.toLowerCase().includes(searchTerms) && !searchResults[i].description.toLowerCase().includes(searchTerms)
            && !searchResults[i].firstname.toLowerCase().includes(searchTerms) && !searchResults[i].lastname.toLowerCase().includes(searchTerms)) {
            document.getElementById(searchResults[i].imagefile).style.display = "none";
        } else {
            document.getElementById(searchResults[i].imagefile).style.display = "block";
            newSearchResults.push(searchResults[i]);
        } // else
    } // for

    searchResults = newSearchResults.slice();

    if (clear) {
        clear = false;
    } // if
} // searchImgs

// change lightbox when previous and next arrows clicked
function changeImg(num) {
    var currentImg = document.getElementsByClassName("loaded")[0].id;
    var s = currentImg.split("_");
    currentImg = s[1];

    if (!searchResults.length) {
        searchResults = results.slice();
    } // if

    // finds the image to change to
    for (var i = 0; i < searchResults.length; i++) {
        if (searchResults[i].imagefile.search(currentImg) != -1) {
            switch (num) {
                case -1:
                    if ((i + 1) >= searchResults.length) {
                        displayLightbox(searchResults[0].imagefile);
                    } else {
                        displayLightbox(searchResults[i + 1].imagefile);
                    }
                    break;
                case -2:
                    if ((i - 1) < 0) {
                        displayLightbox(searchResults[searchResults.length - 1].imagefile);
                    } else {
                        displayLightbox(searchResults[i - 1].imagefile);
                    } // else
            } // switch
            break;
        } // if
    } // for
} // changeImg

// runs delete.php when delete button clicked
function runPhp() {
    $.ajax({
        type: "POST",
        url: 'delete.php',
        data: { deleteThese: toDelete },
        success: function () {
            removeImg();
            removeResults();
            removeSearchResults();
            toDelete = [];
            imgs = [];
        }
    });
} // runPhp

// Removes images listed in toDelete from results
function removeResults() {
    var imgName = "";
    toDelete.forEach(element => {
        imgName = element.substring(element.lastIndexOf('/') + 1);
        var i = 0;
        for (var i = 0; i < results.length; i++) {
            if (results[i].imagefile.localeCompare(imgName) == 0) {
                results.splice(i, 1);
                break;
            } // if
        } // for
    });
} // removeResults

// Removes images listed in toDelete from searchResults
function removeSearchResults() {
    if (!searchResults.length) {
        return;
    } // if
    var imgName = "";
    toDelete.forEach(element => {
        imgName = element.substring(element.lastIndexOf('/') + 1);
        var i = 0;
        for (var i = 0; i < searchResults.length; i++) {
            if (searchResults[i].imagefile.localeCompare(imgName) == 0) {
                searchResults.splice(i, 1);
                break;
            } // if
        } // for
    });
} // removeSearchResults

// runs approve.php when approve button clicked
function approve() {
    $.ajax({
        type: "POST",
        url: 'approve.php',
        data: { approveThese: toDelete },
        success: function () {
            removeImg();
            toDelete = [];
            imgs = [];
        }
    });
} // approve

// removes thumbnail from HTML so page doesn't have to be reloaded
function removeImg() {
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].parentNode.removeChild(imgs[i]);
    } // for
} // removeImg

// selects/deselects images
function selectImg(img) {
    if (!lightbox) {
        if (toDelete.includes(img.firstElementChild.src)) {
            toDelete.splice(toDelete.indexOf(img.firstElementChild.src), 1);
            imgs.splice(imgs.indexOf(img.parentElement), 1);
            img.firstElementChild.style.borderStyle = "hidden";
        } else {
            toDelete.push(img.firstElementChild.src);
            imgs.push(img.parentElement);
            img.firstElementChild.style.border = "thick solid #f0AD4E";
        } // else
    } // if
} // selectImg

// deletes lightbox image in moderator view
function deleteLightbox() {
    var img = document.getElementsByClassName("loaded")[0];
    var sourceId = img.id.split("_");
    var thumb = document.getElementById(sourceId[1]);
    toDelete.push(img.src);
    imgs.push(thumb);
    runPhp(imgs);
    exit();
} // deleteLighbox

// unselects all images when 'cancel' clicked
function unselect() {
    var urls = []; // im
    var img; // image name
    var children = []; // children of div containing img

    // visually unselects all selected images
    for (var i = 0; i < toDelete.length; i++) {
        urls = toDelete[i].split('/');
        img = urls[urls.length - 1];
        children = document.getElementById(img).childNodes;
        children[0].firstElementChild.style.borderStyle = "none";
    } // for

    // exits selection mode
    lightbox = true;

    // reset select buttons & clear images to delete
    toDelete = [];
    imgs = [];
    enableNav();
    
    // check if in moderator gallery to reset editBtn
    if (document.getElementById("dow") != null) {
        document.getElementById("editsBtn").href = "javascript:loadEdits()";
        document.getElementById("editsBtn").classList.remove("disabled");
    } // if
    
    // reset 'delete' button        
    document.getElementById("del").classList.remove("btn-outline-warning");
    document.getElementById("del").classList.add("btn-outline-info");
    
    document.getElementById("unsel").style.display = "none";
} // unselect

// switches between selecting images & showing lightbox in moderator view
function toggle() {
    lightbox = lightbox ? false : true;

    if (!lightbox) {
        disableNav();
        
        // check if in moderator gallery
        if (document.getElementById("dow") != null) {
            document.getElementById("editsBtn").href = "#";
            document.getElementById("editsBtn").classList.add("disabled");
        } // if
        document.getElementById("del").classList.remove("btn-outline-info");
        document.getElementById("del").classList.add("btn-outline-warning");
        document.getElementById("unsel").style.display = "block";
    } else {
        enableNav();
        
        // check if in moderator gallery
        if (document.getElementById("dow") != null) {
            document.getElementById("editsBtn").href = "javascript:loadEdits()";
            document.getElementById("editsBtn").classList.remove("disabled");
        } // if
        document.getElementById("del").classList.remove("btn-outline-warning");
        document.getElementById("del").classList.add("btn-outline-info");
        document.getElementById("unsel").style.display = "none";
    } // else
} // toggle

// zip & download file of all images
function downloadZip() {
    $.ajax({
        type: "POST",
        url: 'zipall.php',
        success: function (data) {

            // get the sent zip file to download
            var a = document.createElement('a');
            a.setAttribute('href', 'images.zip');
            a.setAttribute('download', 'images.zip');

            var aj = $(a);
            aj.appendTo('body');
            aj[0].click();
            aj.remove();
        }
    });
} // downloadZip

// clears search on press of the x button
function clearSearch() {
    $('input[type=search]').on('search', function () {
        searchTerms = "";
        clear = true;
        searchImgs();
    });
} // clearSearch

// download image in lightbox view
function downloadImg() {
    var img = document.getElementsByClassName("loaded")[0].src;
    var file = img.substring(img.lastIndexOf('/') + 1);
    var filename = 'uploadedimages/' + file;
    $.ajax({
        type: "POST",
        url: 'downloadimg.php',
        data: { "img": img },
        success: function (data) {

            // get the sent image to download
            var a = document.createElement('a');
            a.setAttribute('href', filename);
            a.setAttribute('download', file);

            var aj = $(a);
            aj.appendTo('body');
            aj[0].click();
            aj.remove();
            exit();
        }
    });
} // downloadImg

// stores changed edit info
function changeInfo(first, last, desc, tag) {
    this.firstname = first;
    this.lastname = last;
    this.description = desc;
    this.tags = tag;
} // changeInfo

// stores changed edit info & id of data to change
function changeId(id, changeInfo) {
    this.id = id;
    this.changeInfo = changeInfo;
} // changeId

// update JSON edited by moderator
function submitChanges() {
    var changes = [];

    // stores info to changes array differently whether user edited in lightbox or all
    if (!editAll) {
        var info = document.getElementsByClassName('info');
        var loaded = document.getElementsByClassName('loaded');
        var id = loaded[0].id;
        
        // store changes in array to be passed to PHP
        changes[0] = new changeId(id, new changeInfo(info[0].value, info[1].value, info[2].value, info[3].value));

    } else {
        var infos = document.getElementsByClassName("infos");
        var containers = document.getElementsByClassName("contain");

        if (!searchResults.length) {
            searchResults = results.slice();
        } // if

        // store changes in array to be passed to PHP
        for (var j = 0; j < searchResults.length; j++) {
            var id = searchResults[j].imagefile;
            var thumbDiv = document.getElementById(id);
            var container = thumbDiv.children[1];
            var childInfos = container.children;
            changes.push(new changeId(id, new changeInfo(childInfos[0].value, childInfos[1].value, childInfos[2].value, childInfos[3].value)));
        } // for
    } // else

    // run submit.php to update galleryinfo.json
    $.ajax({
        type: "POST",
        url: 'submit.php',
        data: { info: changes },
        success: function (data) {
            console.log(data);
            isModhome = true;
            updateResultsAfterSubmit(data, info, changes);
            if (!editAll) {
                displayLightbox(results[index].imagefile);
            } // if

            // Update thumbnails
            searchResults = results.slice();
            searchImgs();
            exitEdits();
            
            // display error messages if needed
            if (data != null && data.length > 0) {
                if (editAll) {
                    document.getElementById("submitMsg").style.display = "block";
                } else {
                    document.getElementById("msgHolder").style.display = "block";
                } // else
            } // if
        }
    });
} // submitChanges

function updateResultsAfterSubmit(data, info, changes) {
    if (!editAll) {
        if (!data.includes(results[index].imagefile)) {
            
            // update results with new edits
            results[index].firstname = info[0].value;
            results[index].lastname = info[1].value;
            results[index].description = info[2].value;
            results[index].tags = info[3].value;
        } // if
    } else {
        
        // update results with the new edits
        for (var j = 0; j < changes.length; j++) {
            var id = document.getElementById(changes[j].id).id;
            for (var i = 0; i < results.length; i++) {
                if (id.localeCompare(results[i].imagefile) == 0 && !data.includes(id)) {
                    results[i].firstname = changes[j].changeInfo.firstname;
                    results[i].lastname = changes[j].changeInfo.lastname;
                    results[i].description = changes[j].changeInfo.description;
                    results[i].tags = changes[j].changeInfo.tags;
                    break;
                } // if
            } // for
        } // for
    } // else
        
    searchResults = results.slice();
    searchImgs();
    
} //updateResultsAfterSubmit