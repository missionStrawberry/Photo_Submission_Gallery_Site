 <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Grad Baby Photo Submission</title>
	<link rel="stylesheet" href="bootstrap.min.css">
	<link rel="stylesheet" href="style.css"> 
    <link href="https://fonts.googleapis.com/css?family=Amatic+SC&display=swap" rel="stylesheet">
	<script src="form.js"></script>
	<script src="jquery-3.4.1.min.js"></script>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
  </head>
    <body <?php if (!isset($_GET['page']) || ($_GET["page"] != "delete" && $_GET['page'] != "upload" && $_GET["page"] != "album")) { echo 'onload="getJson()"';};?>> 