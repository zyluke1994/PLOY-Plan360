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
    $attractionID = mysqli_real_escape_string($connect, $data->attractionID);
    $google_places_id= mysqli_real_escape_string($connect, $data->google_places_id);
    $foursquare_places_id= mysqli_real_escape_string($connect, $data->foursquare_places_id);

    $query = "UPDATE attractions_ploy SET attractionName = '$attractionName', country = '$country', state ='$state', city ='$city',
     GPSCoordinates ='$GPS', category ='$category', durationSuggest ='$duration', address ='$address', phone='$phone', website ='$website', 
     ticketInfo ='$ticket', parkingInfo ='$parking', publicTransport ='$publicTrans', hours ='$hours', description ='$details',
      notes= '$notes', picture1URL ='$photoURL1', picture2URL='$photoURL2', recommendRating='$recommend', reservationNeeded ='$reservation',google_places_id = '$google_places_id',foursquare_places_id='$foursquare_places_id'
      WHERE attractionID = '$attractionID'";

    
    if(mysqli_query($connect,$query)){
        echo "Data Updated...";
    }
    else{
        echo "Error...";
    }
}

?>

