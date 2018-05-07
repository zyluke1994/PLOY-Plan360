<?php

include "../connectdb.php";
$planID = $_GET['planID'];
if(!is_null($planID)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM planEntry_ploy WHERE planID = $planID";
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
 $query = "SELECT * FROM planEntry_ploy";  
 $result = mysqli_query($connect, $query);  
 if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 }  
}
 ?>  
