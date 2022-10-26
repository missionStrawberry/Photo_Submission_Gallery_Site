<?php
    //-------------------------
    // deletes selected images
    //-------------------------

    $jsonstring = file_get_contents("galleryinfo.json");
    $phparr = json_decode($jsonstring, true);
	$file; // name of image to delete
	
	// go through array of images to delete
    foreach ($_POST["deleteThese"] as $img) {
        $file = basename($img);
		
		// find delete image(s) to delete
        if(is_file("uploadedimages/" . $file) && is_file("thumbnails/" . $file)) {
            
            // delete image
            unlink("uploadedimages/" . $file);
            unlink("thumbnails/" . $file);
            
            // delete JSON if images are deleted
            $i = 0; // index of JSON to remove
            foreach ($phparr as $arr) {
                if ($arr["imagefile"] == $file)  {
                    unset($phparr[$i]);
                    $phparr = array_values($phparr);
                    $jsonstring = json_encode($phparr, JSON_PRETTY_PRINT);
                    break;
                } // if
                $i++;
            } // for
        } // if
	} // for
    
    // save changed JSON
    file_put_contents("galleryinfo.json", $jsonstring);
?>