<?php
    //-------------------------------------------
    // provides correctly filtered JSON data of images to JavaScript
    //-------------------------------------------

    session_start();
    $isEditor = $_SESSION["isEditor"];
    $isApprovalPage = "false";
    if (isset($_SESSION["approvalPage"])) {
		$isApprovalPage = $_SESSION["approvalPage"];
	} // if
    
    $jsonstring = file_get_contents("galleryinfo.json");
    $phparr = json_decode($jsonstring, true);
	$access;
	
    // Remove non-public entries if not logged in & non-approved entries
    $i = sizeof($phparr) - 1;
    for ($i; $i >= 0; $i--) {
        if ($phparr[$i]['approved'] == $isApprovalPage) {
            unset($phparr[$i]);
        } else if (!$isEditor) {
            if ($phparr[$i]['access'] == "private")  {
                unset($phparr[$i]);
            } // if
        } // if
    } // for

    $phparr = array_values($phparr); // re-index array
    $phparr = array_reverse($phparr); // so JSON is sorted by most recent
    
    // save and output changed JSON
    $jsonstring = json_encode($phparr, JSON_PRETTY_PRINT);
    echo $jsonstring;
?>