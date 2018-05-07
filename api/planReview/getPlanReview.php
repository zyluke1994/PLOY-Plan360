<?php

include "../connectdb.php";
$planToReviewID = $_GET['planToReviewID'];
$status = $_GET['status'];

if(!is_null($planToReviewID)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM planReview_ploy WHERE planToReviewID = $planToReviewID  ORDER BY requestedDate DESC LIMIT 1";
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
else if(!is_null($status)){
  // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM planReview_ploy WHERE status = '$status' AND valid ='TRUE' ";  
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
 $query = "SELECT * FROM planReview_ploy";  
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
