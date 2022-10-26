<?php
    //---------------------------------------------------
    // generates main pages of site & handles form inputs
    //---------------------------------------------------

    session_start();
    
    // check session variables
    if (!isset($_GET["page"])) {
        session_unset();
    } // if
    
	if (!isset($_SESSION["isEditor"])) {
		$_SESSION["isEditor"] = false;
	} // if
    
    if (isset($_SESSION["approvalPage"])) {
		unset($_SESSION["approvalPage"]);
	} // if
    
	$isEditor = $_SESSION["isEditor"];
	
	$firstname = $lastname = $photo = $description = $tags = $copyright = $access = "";
	$firstnameErr = $lastnameErr = $photoErr = $descriptionErr = $tagsErr = $copyrightErr = $accessErr = "";
	$isErrors = false;
	$file = "galleryinfo.json";
	
	// set variables from form if form has been submitted and fields are not empty
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		if (empty($_POST["firstname"])) {
			$firstnameErr = "First name is required";
			$isErrors = true;
		} else {
			$firstname = test_input($_POST["firstname"]);
		} // else
       
        if (empty($_POST["lastname"])) {
			$lastnameErr = "Last name is required";
			$isErrors = true;
		} else {
			$lastname = test_input($_POST["lastname"]);
		} // else
        
        if (empty($_POST["description"])) {
			$descriptionErr = "Description is required";
            $isErrors = true;
		} else {
			$description = test_input($_POST["description"]);
		} // else
        
        if (empty($_POST["tags"])) {
			$tagsErr = "Tags are required";
			$isErrors = true;
		} else {
			$tags = test_input($_POST["tags"]);
		} // else
        
        if (empty($_POST["copyright"])) {
			$copyrightErr = "Copyright release is required";
			$isErrors = true;
		} else {
			$copyright = $_POST["copyright"];
		} // else
        
        if (empty($_POST["access"])) {
			$accessErr = "Access type is required";
			$isErrors = true;
		} else {
			$access = $_POST["access"];
		} // else
        
        // checks photo and returns false if not valid
        $uploaded = uploadFile($photoErr, $isErrors);
        if($uploaded == false) {
			$isErrors = true;
		} // if
	} // if
	
	include "header.inc";
	
    // show the form if there are errors, 
	// or if the user wants to see the form
	if ($isErrors == true || isset($_GET["page"])
	&& $_GET["page"]== "upload") {
		include "form.inc";
		
	// update JSON file if form is successfully submitted
    } else if ($isErrors == false && $_SERVER["REQUEST_METHOD"] == "POST") {
        if(!file_exists($file)) {
            touch($file);   
        } else {
            
            // create one string from the file
            $jsonstring = file_get_contents($file);

            //decode the string from json to PHP array
            $phparray = json_decode($jsonstring, true);
        } // else
        
        // add form submission to data
        unset($_POST["submit"]);
        $_POST["approved"] = "false";
        $phparray [] = $_POST;

        // encode php array to formatted JSON
        $jsoncode = json_encode($phparray, JSON_PRETTY_PRINT);
         
        // write JSON to the file
        file_put_contents($file, $jsoncode);
        
        echo '<div id="success">Form successfully submitted</div><div id="return">Click <a href="index.php">here</a> to return to the gallery</div>';
		
	// show moderator gallery view
    } else if (isset($_GET["page"]) && $_GET["page"] == "mod" && $isEditor) {
        include "modhome.inc";
        
        $jsonstring = file_get_contents($file); 
		$phparray = json_decode($jsonstring, true);
        $imgs = glob("thumbnails/*");        
        $i = @sizeOf($phparray) - 1;
		for ($i; $i >= 0; $i--) {
            if ($phparray[$i]["approved"] == "true") {
                $href = str_replace("thumbnails/", "", $imgs[$i]);
                echo '<div style="display:block;" id="' . $href . '" class="col-auto spacing">';
                echo '<a onclick="selectImg(this)" href="javascript:displayLightbox(&quot;' . $href . '&quot;, true)">';
                echo '<img alt="' . $phparray[$i]["description"] .'" class="thumbs" src="' . $imgs[$i] . '"></a>';
				echo '<div class="contain" style="display:none;"><textarea class="form-control infos name" rows="1"></textarea><textarea class="form-control infos name" rows="1"></textarea><textarea class="form-control infos descTags" rows="2"></textarea><textarea class="form-control infos descTags" rows="2"></textarea></div></div>';
            } // if
        } // for
        echo "</div></div></div>";
		
	// show photos waiting to be approved in moderator view
	} else if (isset($_GET["page"]) && $_GET["page"] == "app" && $isEditor) {
		include "approval.inc";
		$_SESSION["approvalPage"] = "true";

        $jsonstring = file_get_contents($file); 
		$phparray = json_decode($jsonstring, true);
		$imgs = glob("thumbnails/*");        
		$i = @sizeOf($phparray) - 1;
		for ($i; $i >= 0; $i--) {
            if ($phparray[$i]["approved"] == "false") {
                $href = str_replace("thumbnails/", "", $imgs[$i]);
                echo '<div style="display:block;" id="' . $href . '" class="col-auto spacing">';
                echo '<a onclick="selectImg(this)" href="javascript:displayLightbox(&quot;' . $href . '&quot;)">';
                echo '<img style="display:block;" alt="' . $phparray[$i]["description"] .'" class="thumbs" src="' . $imgs[$i] . '"></a></div>';
            } // if
		} // for
		echo "</div></div></div>";
		
    // if user logged in, set session variable
    } else if (isset($_GET["page"]) && $_GET["page"] == "login") {
        $_SESSION["isEditor"] = true;
        header("LOCATION: index.php?page=mod");
        	
	// by default show public gallery	
	} else {
		if(!file_exists($file)) {
            touch($file);   
        } // if
		include "pubhome.inc";
		$jsonstring = file_get_contents($file); 
		$phparray = json_decode($jsonstring, true);
		$imgs = glob("thumbnails/*");      
		$i = @sizeOf($phparray) - 1;
		for ($i; $i >= 0; $i--) {
			if ($phparray[$i]["access"] == "public" && $phparray[$i]["approved"] == "true") {
				$href = str_replace("thumbnails/", "", $imgs[$i]);
				echo '<div id="' . $href . '" class="col-auto spacing">';
				echo '<a href="javascript:displayLightbox(&quot;' . $href . '&quot;)">';
				echo '<img alt="' . $phparray[$i]["description"] .'" class="thumbs" src="' . $imgs[$i] . '"></a></div>';
			} // if
		} // for
		echo "</div></div></div>";
	} // else

	include "footer.inc";
	
    // clean form data
	function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
	} // test_input
	
    // error checks user-selected image, & uploads it
    // returns false if image doesn't pass a check
	function uploadFile(&$photoErr, $isErrors) {
		$target_dir = "uploadedimages/";
		$target_file = $target_dir . basename($_FILES["photo"]["name"]);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		
		// if certain directories or files don't exist, create them
        if(!is_dir($target_dir)) {
            mkdir($target_dir, 0777);
        } // if
        
		if(!is_dir("thumbnails/")) {
            mkdir("thumbnails/", 0777);
        } // if
		
		if (!file_exists("identifier.txt")) {
            touch("identifier.txt");
			file_put_contents("identifier.txt", 1);
        } // if
		
		// check to see if an image has been submitted
		if(empty($_FILES["photo"]["tmp_name"])) {
			$photoErr = "Photo is required";
			return false;
		} // if
		
        // Check file size
		if ($_FILES["photo"]["size"] > 4000000) {
			$photoErr = "Your file must be 4MB or smaller";
			return false;
		} // if
        
        // Check if image file is a actual image or fake image
        if((imagecreatefromstring(file_get_contents($_FILES["photo"]["tmp_name"])) == false) 
            || ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg")) {
			$photoErr = "The file must be a JPG or PNG image";
			return false;
		} // if
		
        // If there were any errors so far, don't save the file
        if ($isErrors) {
            return false;
        } // if
      
        // Create a unique file identifier
        $new_file_name = "";
		$uniq_id = 0;
        
        // generate padding for unique id/file name
		$uniq_id = file_get_contents("identifier.txt");
		$zeroes = "";
		if ($uniq_id <= 9 && $uniq_id >= 0) {
			$zeroes = "000" . $uniq_id;
		} else if ($uniq_id <= 99 && $uniq_id >= 10) {
			$zeroes = "00" . $uniq_id;
		} else if ($uniq_id <= 999 && $uniq_id >= 100) {
			$zeroes = "0" . $uniq_id;
		} else if ($uniq_id <= 9999 && $uniq_id >= 1000) {
			$zeroes = $uniq_id;
		} // else if
		$new_file_name = $zeroes . "." . $imageFileType;

		
		// create a thumbnail
		if (make_thumbnail($imageFileType, $new_file_name) != true) {
			$photoErr = "Sorry, there was an error uploading your photo";
            return false;
        } // if
		
		// save big image and add uniq_id
        // & new_file_name variables to POST array
		if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_dir . $new_file_name)) {
			$_POST["UID"] = $zeroes;
			$_POST["imagefile"] = $new_file_name;
			file_put_contents("identifier.txt", ++$uniq_id);
		} else {
            $photoErr = "Sorry, there was an error uploading your photo";
            return false;
        } // else


		// return true if image successfully uploaded
        return true;
	} // uploadFile
	
	// generate thumbnail from image
	function make_thumbnail(&$imageFileType, &$new_file_name) {
		$new_w = 200;
		$new_h = 200;
		
		if ($imageFileType == "png") {
			if (@imagecreatefrompng($_FILES["photo"]["tmp_name"]) == false) {
                return false;
            } else {
                $source_img = @imagecreatefrompng($_FILES["photo"]["tmp_name"]);
            } // else
		} else {
			$source_img = imagecreatefromjpeg($_FILES["photo"]["tmp_name"]);
		} // else
        
	    // get height & width of original image
        // accounts for fake pngs by returning false if no dimensions can be found
		if (@imagesx($source_img)) {
			$orig_w = imagesx($source_img);
		} else {
			return false;
		} // else
		
		if (@imagesy($source_img)) {
			$orig_h = imagesy($source_img);
		} else {
			return false;
		} // else
			
		$w_ratio = ($new_w / $orig_w);
		$h_ratio = ($new_h / $orig_h);
			

        if ($orig_w > $orig_h ) { // landscape
            $crop_w = round($orig_w * $h_ratio);
            $crop_h = $new_h;
            $src_x = ceil( ( $orig_w - $orig_h ) / 2 );
            $src_y = 0;
        } else if ($orig_w < $orig_h ) { // portrait
            $crop_h = round($orig_h * $w_ratio);
            $crop_w = $new_w;
            $src_x = 0;
            $src_y = ceil( ( $orig_h - $orig_w ) / 2 );
        } else { // square
            $crop_w = $new_w;
            $crop_h = $new_h;
            $src_x = 0;
            $src_y = 0;	
        } // else
        
		// create the new thumbnail and add alpha channel if image is a png
        $dest_img = imagecreatetruecolor($new_w,$new_h);
		if ($imageFileType == "png") {
			imageAlphaBlending($dest_img, false);
			imageSaveAlpha($dest_img, true);
		} // if
        
        imagecopyresampled($dest_img, $source_img, 0 , 0 , $src_x, $src_y, $crop_w, $crop_h, $orig_w, $orig_h);
        
        // save as png or jpeg
		if ($imageFileType == "png") {
			if(imagepng($dest_img, "thumbnails/" . $new_file_name)) {
				imagedestroy($dest_img);
				imagedestroy($source_img);
				return true;
			} else {
				return false;
			} // else
		} else {
			if(imagejpeg($dest_img, "thumbnails/" . $new_file_name)) {
				imagedestroy($dest_img);
				imagedestroy($source_img);
				return true;
			} else {
				return false;
			} // else
		} // else
	} // make_thumbnail
?>