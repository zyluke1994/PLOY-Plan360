<?php

$filename = $_FILES['file']['name'];
$meta = $_POST;
//echo $filename[0];
$destination = $meta['targetPath'].$filename;
$filenameDetail = $meta['filenameDetail'];
echo $filenameDetail.$filename;
$destination = $meta['targetPath'].$filenameDetail.$filename;



if (move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
    echo "File is valid, and was successfully uploaded.\n";
  } else {
     echo "Upload failed";
  }

  echo "</p>";
  echo '<pre>';
  echo 'Here is some more debugging info:';
  print_r($_FILES);
  print "</pre>";

?>