<?php
    //-------------------------------
    // update JSON of edited image(s)
    //-------------------------------

    $jsonstring = file_get_contents("galleryinfo.json");
    $phparr = json_decode($jsonstring, true);
    $i; // index of $phparr to change
    $errors = array();
    $isErrors = false;
    
    // find the correct info to change
	foreach ($_POST['info'] as $info) {
        $id = str_replace("big_", "", $info['id']); // get plain image name

        // check if any of the fields are empty
        if (empty(test_input($info['changeInfo']['firstname']))
                || empty(test_input($info['changeInfo']['lastname']))
                || empty(test_input($info['changeInfo']['description']))
                || empty(test_input($info['changeInfo']['tags']))) {
            $errors [] = $id;
            $isErrors = true;
        } else {
            for ($i = sizeof($phparr) - 1; $i >= 0; $i--) {
                if ($phparr[$i]['imagefile'] == $id) {
                    $phparr[$i]['firstname'] = test_input($info['changeInfo']['firstname']);
                    $phparr[$i]['lastname'] = test_input($info['changeInfo']['lastname']);
                    $phparr[$i]['description'] = test_input($info['changeInfo']['description']);
                    $phparr[$i]['tags'] = test_input($info['changeInfo']['tags']);
                } // if
            } // for
        } // else
	} // foreach
    
    // re-index array
    $phparr = array_values($phparr);
    
    // save changed JSON
    $jsonstring = json_encode($phparr, JSON_PRETTY_PRINT);
    file_put_contents("galleryinfo.json", $jsonstring);
    
    // return errors if any
    echo json_encode($errors);
    
    // clean user-entered data
	function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
	} // test_input
?>