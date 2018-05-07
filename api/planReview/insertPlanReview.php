<?php

//insertPlan.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));

if(count($data)>0){
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
    $queryUpdateInvalid = "UPDATE planReview_ploy SET valid = 'FALSE' WHERE planToReviewID = '$planToReviewID'";
    if(mysqli_query($connect,$queryUpdateInvalid)){
        echo "Invaid Updated...";
    }
    else{
        echo "Error...";
    }
    $query = "INSERT INTO planReview_ploy (planToReviewID, planName,clientID,clientName,requester, reviewer, status,requestedDate,reviewedDate,statusNotes, valid) 
     VALUES ('$planToReviewID', '$planName','$clientID','$clientName','$requester','$reviewer','$status','$requestedDate','$reviewedDate','$statusNotes','$valid')";
    if(mysqli_query($connect,$query)){
        echo "Data Inserted...";
    }
    else{
        echo "Error...";
    }
}

?>