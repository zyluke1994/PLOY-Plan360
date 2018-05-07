<?php
include "../connectdb.php";
$attractionID = $_GET['attractionID'];
if(!is_null($attractionID)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM attractions_ploy WHERE attractionID = $attractionID";
   $result = mysqli_query($connect, $query);  

    if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 }  
}else{
     //select.php  
 $output = array();  
 $query = "SELECT * FROM attractions_ploy";  
 $result = mysqli_query($connect, $query);  
 if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 }  
};

 ?>  

