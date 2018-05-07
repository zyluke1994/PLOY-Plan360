<?php

//insertAttraction.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
//$attractionName = $dbhandle->real_escape_string($data->attractionName);
//$query = "INSERT INTO attractions_ploy (attractionName) VALUES ('$attractionName')";
//$dbhandle->query($query);
$firstName = $_REQUEST['firstName'];
$lastName = $_REQUEST['lastName'];
$birthday = $_REQUEST['birthday'];
$email = $_REQUEST['email'];
$phone = $_REQUEST['phone'];
$occupancy = $_REQUEST['occupancy'];
$rating = $_REQUEST['rating'];
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$customerNotes = $_REQUEST['customerNotes'];
$inputBy = $_REQUEST['inputBy'];
$fullName = $firstName.' '.$lastName;

if(count($data)>0){
    $firstName = mysqli_real_escape_string($connect, $data->firstName);
    $lastName = mysqli_real_escape_string($connect, $data->lastName);
    $birthday= mysqli_real_escape_string($connect, $data->birthday);
    $email= mysqli_real_escape_string($connect, $data->email);
    $phone= mysqli_real_escape_string($connect, $data->phone);
    $occupancy= mysqli_real_escape_string($connect, $data->occupancy);
    $rating= mysqli_real_escape_string($connect, $data->rating);
    $username= mysqli_real_escape_string($connect, $data->username);
    $password= mysqli_real_escape_string($connect, $data->password);
    $customerNotes= mysqli_real_escape_string($connect, $data->customerNotes);
    $inputBy= mysqli_real_escape_string($connect, $data->inputBy);
    $fullName=$firstName.' '.$lastName;

    
}
$checkUsernameQuery = "SELECT * FROM customers_ploy WHERE username = '$username'";
   $result = mysqli_query($connect, $checkUsernameQuery);  
    if(mysqli_num_rows($result) > 0)  {
        echo "Username Exists";
    }else{
$query = "INSERT INTO customers_ploy (firstName, lastName, fullName, birthday, email,
     phone, occupancy, rating, username, password,customerNotes,inputBy) 
     VALUES ('$firstName', '$lastName','$fullName','$birthday','$email','$phone','$occupancy','$rating','$username','$password','$customerNotes','$inputBy')";
    if(mysqli_query($connect,$query)){
        echo "Data Inserted...";
    }
    else{
        echo "Error...";
    }
    }

?>

