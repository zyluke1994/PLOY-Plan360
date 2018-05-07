<?php  
 //delete.php  

 include "../connectdb.php";

 $data = json_decode(file_get_contents("php://input"));  
 if(count($data) > 0)  
 {  
      $attractionID = $data->attractionID;  
      $query = "DELETE FROM attractions_ploy WHERE attractionID='$attractionID'";  
      if(mysqli_query($connect, $query))  
      {  
           echo 'Data Deleted';  
      }  
      else  
      {  
           echo 'Error';  
      }  
 }  
 ?>  