<?php

//insertAttraction.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
$reviewID = $_REQUEST['reviewID'];
$planToReviewID = $_REQUEST['planToReviewID'];
$planName = $_REQUEST['planName'];
$clientID = $_REQUEST['clientID'];
 $clientName = $_REQUEST['clientName'];
    $requester = $_REQUEST['requester'];
    $reviewer= $_REQUEST['reviewer'];
    $status= $_REQUEST['status'];
   $requestedDate = $_REQUEST['requestedDate'];
   $reviewedDate = $_REQUEST['reviewedDate'];
   $statusNotes= $_REQUEST['statusNotes'];
   $valid=$_REQUEST['valid'];
   $updateType = $_REQUEST['updateType'];
  

if(count($data)>0){
    $reviewID = mysqli_real_escape_string($connect, $data->reviewID);
    $planToReviewID = mysqli_real_escape_string($connect, $data->planToReviewID);
    $planName = mysqli_real_escape_string($connect, $data->planName);
    $clientID = mysqli_real_escape_string($connect, $data->clientID);
    $clientName = mysqli_real_escape_string($connect, $data->clientName);
    $requester = mysqli_real_escape_string($connect, $data->requester);
    $reviewer= mysqli_real_escape_string($connect, $data->reviewer);
    $status= mysqli_real_escape_string($connect, $data->status);
    $requestedDate= mysqli_real_escape_string($connect, $data->requestedDate);
    $reviewedDate= mysqli_real_escape_string($connect, $data->reviewedDate);
    $statusNotes= mysqli_real_escape_string($connect, $data->statusNotes);
    $valid= mysqli_real_escape_string($connect, $data->valid);
    $updateType = mysqli_real_escape_string($connect, $data->updateType);

}

if($updateType=="updateStatus"){
    $query = "UPDATE planReview_ploy SET status = '$status', reviewer = '$reviewer', reviewedDate = '$reviewedDate', statusNotes = '$statusNotes' WHERE reviewID = '$reviewID'";
    if(mysqli_query($connect,$query)){
        echo "Entry Updated...";
    }
    else{
        echo "Error...";
    }
}
else{
    echo "change time only at this time. ";
}


?>
