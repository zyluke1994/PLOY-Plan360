<?php  

 //delete.php  
 include "../connectdb.php";

 $data = json_decode(file_get_contents("php://input"));  
 if(count($data) > 0)  
 {  
      $templateID = $data->templateID;  
      $query = "DELETE FROM destinationPlanInfoTemplate_ploy WHERE templateID='$templateID'";  
      if(mysqli_query($connect, $query))  
      {  
           echo 'Entry Deleted';  
      }  
      else  
      {  
           echo 'Error';  
      }  
 }  
 ?>  