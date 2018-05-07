<?php
include "../connectdb.php";
$searchAny = $_GET['searchAny'];
if(!is_null($searchAny)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
    $query = "SELECT * FROM attractions_ploy WHERE attractionName LIKE '%$searchAny%' OR description LIKE '%$searchAny%' OR address LIKE '%$searchAny%' OR city LIKE '%$searchAny%' OR notes LIKE '%$searchAny%' ";
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