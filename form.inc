<div id="container">
    <p>Baby Photo Submission</p>
    <form method="post" id="form" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>" enctype="multipart/form-data">

        <div class="inputs">
            <input type="text" name="firstname" id="firstName" class="form-control" placeholder="First name" value="<?php if(isset($_POST['firstname'])) { echo $_POST['firstname']; }?>">
            <span id="firstErr" class="form-text text-warning"><?php echo $firstnameErr;?></span>
        </div>

        <div class="inputs">
            <input id="lastName" type="text" name="lastname" class="form-control" placeholder="Last name" value="<?php if(isset($_POST['lastname'])) { echo $_POST['lastname']; }?>">
            <span id="lastErr" class="text-warning"><?php echo $lastnameErr;?></span>
        </div>

        <div class="custom-file" id="upload">
            <input name="photo" id="file" type="file" class="custom-file-input" onchange="showFileName()">
            <span id="photoErr" class="text-warning"><?php echo $photoErr;?></span>
            <label id="fileLabel" class="custom-file-label text-secondary" for="inlineCheckbox2">Select a photo
            </label>
        </div>

        <div class="inputs">
			<textarea id="description" name="description" class="form-control" placeholder="Describe your photo" rows="5"><?php if(isset($_POST['description'])) { echo $_POST['description']; }?></textarea>
			<span id="descriptionErr" class="text-warning"><?php echo $descriptionErr;?></span>
	    </div>
	  
		<div class="inputs">
			<textarea id="tags" name="tags" class="form-control" placeholder="Tag your photo (separate each one with a comma)" rows="5"><?php if(isset($_POST['tags'])) { echo $_POST['tags']; }?></textarea>
			<span id="tagsErr" class="text-warning"><?php echo $tagsErr;?></span>
		</div>

        <div class="custom-control custom-checkbox">
            <input class="custom-control-input" type="checkbox" name="copyright" id="copy" <?php if(isset($copyright) && $copyright=='on' ) { echo "checked";}?>>
            <label class="custom-control-label" for="copy">I retain the copyright to this image and release it for use on this site</label>
            <div id="release" class="text-warning inputs">
                <?php echo $copyrightErr;?>
            </div>
        </div>

        <div class="custom-control custom-radio custom-control-inline">
            <input class="custom-control-input" type="radio" name="access" id="inlineCheckbox1" <?php if (isset($access) && $access=="public" ) echo "checked";?> value="public">
            <label class="custom-control-label" for="inlineCheckbox1">Public</label>
        </div>

        <div class="custom-control custom-radio custom-control-inline">
            <input class="custom-control-input" type="radio" name="access" id="inlineCheckbox2" <?php if (isset($access) && $access=="private" ) echo "checked";?> value="private">
            <label class="custom-control-label" for="inlineCheckbox2">Private</label>
        </div>

        <div id="access" class="text-warning">
            <?php echo $accessErr;?>
        </div>

        <div id="submits">
            <button id="submitButton" type="submit" value="Submit" class="btn btn-warning btn-lg" name="submit">Submit</button>
            <a id="home" href="index.php" class="btn btn-info">Back to Gallery</a>
        </div>

    </form>

    <br>
</div>