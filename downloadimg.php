<?php
    //-------------------------
    // downloads selected image
    //-------------------------


    session_start();
    $isEditor = $_SESSION["isEditor"];
    
    // only download if moderator
    if ($isEditor) { 
        $file = basename($_POST['img']); 
        $filePath = 'uploadedimages/' . $file;
        
        // Download the file.
        ob_clean();
        ob_end_flush();
        header('Content-Type: application/octet-stream');
        header('Content-disposition: attachment; filename=' . $file);
        header('Content-Length: ' . filesize($filePath));
        flush();
        readfile($filePath);
        exit;
    } // if
?>