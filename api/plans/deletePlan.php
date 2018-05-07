<?php  

 //delete.php  
 include "../connectdb.php";

 $data = json_decode(file_get_contents("php://input"));  
 if(count($data) > 0)  
 {  
      $planID = $data->planID;  
      $query = "DELETE FROM planToCustomer_ploy WHERE planID='$planID'";  
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