<div id="galleryContainer">
    <!-- top navigation bar-->
    <div id="banner" class="navbar rounded-bottom d-flex">
		<a href="?page=upload" id="toForm" class="btn btn-info">Upload</a>
		
		<div class="d-flex navSearch">
			<div class="input-group" id="searchBar2">
			    <input onchange="clearSearch()" id="search" type="search" class="form-control" placeholder="Search by name, tags, or description">
				<div class="input-group-append">
				    <button class="btn btn-warning form-control" type="button" id="searchButton" onclick="sortImg();searchImgs()">
					    <i class="material-icons">
						search
						</i>
				    </button>
				</div>
			</div>
			<a href="?page=login" id="log" class="btn btn-info form-control">Log In</a>
		</div>
		
		<div id="sortImg">
			<label for="select" id="sort" class="text-warning mr-2">Sort Images:</label>
			<select id="select" class="custom-select" onchange="sortImg();searchImgs()">
				<option value="date" selected>Most recent</option>
				<option value="first">First name</option>
				<option value="last">Last name</option>
			</select>
		</div>
    </div> <!-- top navigation bar (end)-->
    <br><br><br><br><br><br>
	<div class="container-fluid">
	
	<!-- lightbox -->
    <div id="hidden" class="mx-auto" style="display:none;">
		<div id="hold">
			<a href="javascript:changeImg(-1)"><img id="next" src="images/next.png" alt="next"></a>
			<a href="javascript:changeImg(-2)"><img id="previous" src="images/previous.png" alt="previous"></a>
			<a href="javascript:exit()"><img id="x" src="images/x.png" alt="close"></a>
			<div id="bigImg">
				<img class="loaded mt-5" src="#" alt="Photo">
			</div>
		</div>
		<div id="lightboxInfo"></div>
    </div> <!-- lightbox (end) -->
        <p class="text-center text-white">Public Gallery</p>
        <br>
		<!-- thumbnails (finished by PHP) -->
        <div id="thumbsRow" class="row justify-content-center mx-auto">


