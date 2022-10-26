<?php
    //-------------------------
    // approves selected images
    //-------------------------

    $jsonstring = file_get_contents("galleryinfo.json");
    $phparr = json_decode($jsonstring, true);
	$file;
	
	// go through array of images to approve
    foreach ($_POST["approveThese"] as $img) {
        $file = basename($img);
		
		// approve image(s)
        if(is_file("uploadedimages/" . $file) && is_file("thumbnails/" . $file)) {

            // update the JSON for the approved image
            $i = 0; // index of JSON to remove
            foreach ($phparr as $arr) {
                if ($arr["imagefile"] == $file)  {
                    $phparr[$i]['approved'] = "true";
                    $phparr = array_values($phparr);
                    break;
                } // if
                $i++;
            } // for
        } // if
	} // for
    
    // save the changed JSON
    $jsonstring = json_encode($phparr, JSON_PRETTY_PRINT);
    file_put_contents("galleryinfo.json", $jsonstring);
?>