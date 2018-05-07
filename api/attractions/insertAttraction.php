<?php
//insertAttraction.php

include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
//$attractionName = $dbhandle->real_escape_string($data->attractionName);
//$query = "INSERT INTO attractions_ploy (attractionName) VALUES ('$attractionName')";
//$dbhandle->query($query);
if(count($data)>0){
    $attractionName = mysqli_real_escape_string($connect, $data->attractionName);
    $country = mysqli_real_escape_string($connect, $data->country);
    $state= mysqli_real_escape_string($connect, $data->state);
    $city= mysqli_real_escape_string($connect, $data->city);
    $GPS= mysqli_real_escape_string($connect, $data->gps);
    $category= mysqli_real_escape_string($connect, $data->category);
    $duration= mysqli_real_escape_string($connect, $data->duration);
    $address= mysqli_real_escape_string($connect, $data->address);
    $phone= mysqli_real_escape_string($connect, $data->phone);
    $website= mysqli_real_escape_string($connect, $data->website);
    $ticket= mysqli_real_escape_string($connect, $data->ticket);
    $parking= mysqli_real_escape_string($connect, $data->parking);
    $publicTrans= mysqli_real_escape_string($connect, $data->publicTrans);
    $hours= mysqli_real_escape_string($connect, $data->hours);
    $details= mysqli_real_escape_string($connect, $data->details);
    $notes= mysqli_real_escape_string($connect, $data->notes);
    $photoURL1= mysqli_real_escape_string($connect, $data->photoURL1);
    $photoURL2= mysqli_real_escape_string($connect, $data->photoURL2);
    $recommend= mysqli_real_escape_string($connect, $data->recommend);
    $reservation= mysqli_real_escape_string($connect, $data->reservation);
    $updatedBy= mysqli_real_escape_string($connect, $data->updatedBy);


    $query = "INSERT INTO attractions_ploy (attractionName, country, state, city,
     GPSCoordinates, category, durationSuggest, address, phone, website, ticketInfo, parkingInfo, publicTransport,
     hours, description, notes, picture1URL, picture2URL, recommendRating, reservationNeeded,updatedBy) 
     VALUES ('$attractionName', '$country','$state','$city','$GPS','$category','$duration','$address','$phone','$website','$ticket',
     '$parking','$publicTrans','$hours','$details','$notes','$photoURL1','$photoURL2','$recommend','$reservation','$updatedBy')";
    if(mysqli_query($connect,$query)){
        echo "Data Inserted...";
    }
    else{
        echo "Error...";
    }
}

?>

