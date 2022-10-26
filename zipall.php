<?php
    //----------------------------------------------
    // zips all images & sends zip file for download
    //----------------------------------------------

    session_start();
    $isEditor = $_SESSION["isEditor"];
    
    // only zip & download if moderator
    if ($isEditor) {
        $files = array(); // locations of all uploaded photos

        // read the directory uploadedimages & 
        // add each image location to $files
        if (is_dir("uploadedimages/")) {	
                $filenames = glob("uploadedimages/*");
                foreach($filenames as $fname) {
                    if(is_file($fname)) {
                        $files[] = $fname;
                    } // if
                } // foreach
             } // if

        //var_dump($files); // check the content of files is correct

        $zipname = 'images.zip';  // name of file to download
        $zip = new ZipArchive;
        $zip->open($zipname, ZipArchive::CREATE);
        
        // add images to zip
        foreach ($files as $file) {
            $zip->addFile($file);
        } // for

        $zip->close();

        // Download zipped file
        ob_clean();
        ob_end_flush();
        header('Content-Type: application/zip');
        header('Content-disposition: attachment; filename='.$zipname);
        header('Content-Length: ' . filesize($zipname));
        flush();
        readfile($zipname);
    } // if
?>