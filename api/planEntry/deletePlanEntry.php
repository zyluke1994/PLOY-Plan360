<?php  

 //delete.php  
 include "../connectdb.php";

 $data = json_decode(file_get_contents("php://input"));  
 if(count($data) > 0)  
 {  
      $entryID = $data->entryID;  
      $query = "DELETE FROM planEntry_ploy WHERE entryID='$entryID'";  
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