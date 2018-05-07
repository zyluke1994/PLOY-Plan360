<?php

$fileName = $_GET['fileName'];



    $b64Doc = base64_encode(file_get_contents('../assets/Uploads/plan/'.$fileName));

echo $b64Doc;


?>