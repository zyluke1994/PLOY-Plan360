<?php

//connectdb.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

define("HOSTNAME", "localhost:8889");
define("USERNAME", "test");
define("PASSWORD", "test");
define("DATABASE", "ploy360db");
$connect = mysqli_connect("localhost:8889", "test","test","plan360db");
//$connect = mysqli_connect("localhost", "ylukmamv_plan360","iMZ7G3DXtgGf","ylukmamv_ploy") or die("Unable to connect");
?>