<div id="galleryContainer">
	<!-- top navigation bar -->
    <div id="bannerMod" class="navbar rounded-bottom d-flex">
        <div id="add">
			<a href="?page=mod" id="modViews" class="btn btn-info">Moderator Gallery</a>
			<div id="cent">
				<a href="javascript:runPhp(imgs)" id="del" class="btn btn-outline-info btnPad">Delete</a>
				<a href="javascript:approve()" id="appBtn" class="btn btn-outline-info btnPad">Approve</a>
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
				<select id="select2" class="custom-select custom-select-md" onchange="sortImg();sortBy();searchImgs()">
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
	
	<!-- developer tools -->
	<div id="holdSelect">
		<a id="sel" href="javascript:toggle()" class="btn btn-outline-warning btn-block">Select</a>
		<a id="unsel" style="display:none;" href="javascript:unselect()" class="btn btn-outline-light btn-block">Cancel</a>
	</div>

	<div class="container-fluid">
	
	<!-- lightbox -->
    <div id="hidden" class="mx-auto" style="display:none;">
		<div id="hold" class="mt-4">
			<a href="javascript:changeImg(-1)"><img id="next" src="images/next.png" alt="next"></a>
			<a href="javascript:changeImg(-2)"><img id="previous" src="images/previous.png" alt="previous"></a>
			<a href="javascript:exit()"><img id="x" src="images/x.png" alt="close"></a>
			<div id="bigImg">
				<img class="loaded" src="#" alt="Photo">
			</div>
		</div>
			<div id="lightboxInfo"></div>
    </div> <!-- lightbox (end) -->
        <p class="text-center text-white">Awaiting Approval</p>
        <br>
		<!-- thumbnails -->
        <div id="thumbsRow" class="row justify-content-center mx-auto">


