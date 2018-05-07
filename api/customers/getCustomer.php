<?php

include "../connectdb.php";
$username = $_GET['username'];
$password = $_GET['password'];
$getType = $_GET['getType'];
$inputBy = $_GET['inputBy'];
$customerID = $_GET['customerID'];

$data = json_decode(file_get_contents("php://input"));
if(count($data)>0){
    $username = mysqli_real_escape_string($connect, $data->username);
    $password = mysqli_real_escape_string($connect, $data->password);
    $getType = mysqli_real_escape_string($connect, $data->getType);
    $inputBy = mysqli_real_escape_string($connect, $data->inputBy);
    $customerID = mysqli_real_escape_string($connect, $data->customerID);
    
}
if(!is_null($username)&& !is_null($password)){
  $query = "SELECT * FROM customers_ploy WHERE username = '$username' AND password =  '$password'";
   $result = mysqli_query($connect, $query);  
    if(mysqli_num_rows($result) > 0)  
 {  

      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 } else{
     echo "Username or Password Incorrect";
 } 
}else if(!is_null($username)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM customers_ploy WHERE username = '$username'";
   $result = mysqli_query($connect, $query);  

    if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 }else{
     echo "Error";
 }  
}else if(!is_null($customerID)){
    // $attractionID = mysqli_real_escape_string($connect, $attractionID->attractionID);
  $query = "SELECT * FROM customers_ploy WHERE customerID = '$customerID'";
   $result = mysqli_query($connect, $query);  

    if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 }else{
     echo "Error";
 }  
}else if($getType=="getMyCustomers"){
    //select.php 
 $output = array();  
 $query = "SELECT * FROM customers_ploy where inputBy ='$inputBy' ";  
 $result = mysqli_query($connect, $query);  
 if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_array($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 } 

}else if($getType=="getPlanner"){
    //select.php 
 $output = array();  
 $query = "SELECT * FROM authenticate_ploy";  
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
 $query = "SELECT * FROM customers_ploy";  
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
