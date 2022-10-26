<div id="galleryContainer">
    <!-- top navigation bar -->
    <div id="bannerMod" class="navbar rounded-bottom d-flex">
		<div id="add">
			<a href="?page=app" id="modViews" class="btn btn-info">Awaiting Approval</a>
			<div id="cent">
				<a id="del" href="javascript:runPhp(imgs)" class="btn btn-outline-info">Delete</a>
				<a id="dow" href="javascript:downloadZip()" class="btn btn-outline-info">Download All</a>
			</div>
		</div>
		
		<div class="d-flex navSearch"> <!-- search and log out -->
			<div class="input-group" id="searchBar">
				<input onchange="clearSearch()" id="search" type="search" class="form-control" placeholder="Search by name, tags, or description">
				<div class="input-group-append">
					<button class="btn btn-warning form-control" type="button" id="searchButton" onclick="searchImgs()">
					<i class="material-icons">
					search
					</i>
				  </button>
				</div>
			</div>
			<a href="index.php" id="log" class="btn btn-info form-control">Log Out</a>
		</div> <!-- search and log out (end)-->
        
		<div id="drop"> <!-- dropdown sort and filter -->
			<div id="topDrop">
				<label for="select2" id="sort2" class="text-warning mr-2">Filter by:</label>
				<select id="select2" class="custom-select custom-select-md" onchange="sortBy();searchImgs()">
					<option selected value="p">All</option>
					<option value="public">Public</option>
					<option value="private">Private</option>
				</select>
			</div>
			
			<div id="botDrop">
				<label for="select" id="sort" class="text-warning">Sort by:</label>
				<select id="select" class="custom-select custom-select-md" onchange="sortImg();sortBy();searchImgs()">
					<option value="date" selected>Most recent</option>
					<option value="first">First name</option>
					<option value="last">Last name</option>
					
				</select>
			</div>
		</div> <!-- dropdown sort and filter (end) -->
	
    </div> <!-- top navigation bar (end) -->
    <br><br><br><br><br><br>
	<!-- developer tools-->
    <div id="holdSelect">
		<a id="sel" href="javascript:toggle()" class="btn btn-outline-warning btn-block">Select</a>
		<a id="unsel" style="display:none;" href="javascript:unselect()" class="btn btn-outline-light btn-block">Cancel</a>
	</div>
    
	<div id="holdEdits">
        <a href="javascript:loadEdits()" id="editsBtn" class="btn btn-outline-warning btn-block">Edit All</a>
        <a href="javascript:exitEdits();" id="exBtn" class="btn btn-outline-light btn-block">Exit View</a>
    </div>
    

	
	<div class="container-fluid">
	<!-- lightbox -->
    <div id="hidden" class="mx-auto" style="display:none;">
		<div class="d-flex justify-content-center mt-2">
			<a href="javascript:isModhome = true;deleteLightbox()" class="btn btn-info mr-2 ml-2">Delete</a>
			<a href="javascript:isModhome = true;downloadImg()" class="btn btn-info mr-2 ml-2">Download</a>
			<a href="javascript:edit()" id="editBtn" class="btn btn-outline-warning mr-2 ml-2">Edit</a>
		</div>
		<div id="hold">
			<a href="javascript:changeImg(-1)"><img id="next" src="images/next.png" alt="next"></a>
			<a href="javascript:changeImg(-2)"><img id="previous" src="images/previous.png" alt="previous"></a>
			<a href="javascript:isModhome = true;exit()"><img id="x" src="images/x.png" alt="close"></a>
			<div id="bigImg">
				<img class="loaded" src="#" alt="Photo">
			</div>
            <div id="msgHolder"> <!-- submit error message-->
                <span id="lightboxMsg" class="text-warning rounded"> 
                    Could not submit edits. One or more fields were empty
                </span>
            </div>
		</div>
        <div id="change" style="display:none;" class="container">
			<div class="row flex-nowrap mb-1">
				<textarea class="form-control info name" rows="1" id="name1"></textarea>
				<textarea class="form-control info name" rows="1" id="name2"></textarea>
			</div>
			<textarea class="form-control info descTags row" rows="2" id="describe"></textarea>
			<textarea class="form-control info descTags row" rows="2" id="tagging"></textarea>
		</div>
		<div id="lightboxInfo"></div>
	</div> <!-- lightbox (end) -->
        <p class="text-center text-white">Moderator Gallery</p>
        <div id="submitMsg" class="text-warning"> <!-- submit error message-->
            Note: entries with empty fields were not submitted
        </div>
        <br>
		<!-- thumbnails -->
        <div id="thumbsRow" class="row justify-content-center mx-auto">