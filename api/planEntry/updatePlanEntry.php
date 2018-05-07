<?php

//insertAttraction.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
$visitStart = $_REQUEST['visitStart'];
$visitEnd = $_REQUEST['visitEnd'];
$previousAttractionID = $_REQUEST['previousAttractionID'];
 $timeToTravel = $_REQUEST['timeToTravel'];
    $planID = $_REQUEST['planID'];
    $inputBy= $_REQUEST['inputBy'];
    $planEntrymemo= $_REQUEST['planEntrymemo'];
   $updateType = $_REQUEST['updateType'];
   $entryID = $_REQUEST['entryID'];
   $visitStartShift= $_REQUEST['visitStartShift'];
   $visitEndShift=$_REQUEST['visitEndShift'];
   $visitStartActual=$_REQUEST['visitStartActual'];
    $visitEndActual=$_REQUEST['visitEndActual'];
    $planEntrymemo =$_REQUEST['planEntrymemo'];
    $reservationFileLocation =$_REQUEST['reservationFileLocation'];

if(count($data)>0){
    $visitStart = mysqli_real_escape_string($connect, $data->visitStart);
    $visitEnd = mysqli_real_escape_string($connect, $data->visitEnd);
    $entryID = mysqli_real_escape_string($connect, $data->entryID);
    $inputBy = mysqli_real_escape_string($connect, $data->inputBy);
    
    $updateType = mysqli_real_escape_string($connect, $data->updateType);
    $visitStartShift = mysqli_real_escape_string($connect, $data->visitStartShift);
    $visitEndShift = mysqli_real_escape_string($connect, $data->visitEndShift);
    $visitStartActual = mysqli_real_escape_string($connect, $data->visitStartActual);
    $visitEndActual = mysqli_real_escape_string($connect, $data->visitEndActual);
    $planEntrymemo = mysqli_real_escape_string($connect, $data->planEntrymemo);
    $reservationFileLocation = mysqli_real_escape_string($connect, $data->reservationFileLocation);

}

if($updateType=="updateTime"){
    $query = "UPDATE planEntry_ploy SET visitStart = '$visitStart', visitEnd = '$visitEnd', inputBy ='Test2', planEntrymemo ='$planEntrymemo', inputBy ='$inputBy', reservationFileLocation = '$reservationFileLocation' WHERE entryID = '$entryID'";
    if(mysqli_query($connect,$query)){
        echo "Entry Updated...";
    }
    else{
        echo "Error...";
    }
}
else if($updateType=="updateVisitStartShift"){
    $query = "UPDATE planEntry_ploy SET visitStartShift = '$visitStartShift' WHERE entryID = '$entryID'";
    if(mysqli_query($connect,$query)){
        echo "Entry Updated...";
    }
    else{
        echo "Error...";
    }
}
else if($updateType=="updateVisitEndShift"){
    $query = "UPDATE planEntry_ploy SET visitEndShift = '$visitEndShift' WHERE entryID = '$entryID'";
    if(mysqli_query($connect,$query)){
        echo "Entry Updated...";
    }
    else{
        echo "Error...";
    }
}
else if($updateType=="updateVisitStartActual"){
    $query = "UPDATE planEntry_ploy SET visitStartActual = '$visitStartActual' WHERE entryID = '$entryID'";
    if(mysqli_query($connect,$query)){
        echo "Entry Updated...";
    }
    else{
        echo "Error...";
    }
}
else if($updateType=="updateVisitEndActual"){
        echo "enter update ";

    $query = "UPDATE planEntry_ploy SET visitEndActual = '$visitEndActual' WHERE entryID = '$entryID'";
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

