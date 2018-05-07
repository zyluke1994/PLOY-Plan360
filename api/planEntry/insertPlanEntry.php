<?php

//insertPlan.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));

if(count($data)>0){
    $attractionID = mysqli_real_escape_string($connect, $data->attractionID);
    $visitStart = mysqli_real_escape_string($connect, $data->visitStart);
    $visitEnd= mysqli_real_escape_string($connect, $data->visitEnd);
    $previousAttractionID= mysqli_real_escape_string($connect, $data->previousAttractionID);
    $timeToTravel= mysqli_real_escape_string($connect, $data->timeToTravel);
    $planID= mysqli_real_escape_string($connect, $data->planID);
    $inputBy= mysqli_real_escape_string($connect, $data->inputBy);
    $planEntryMemo= mysqli_real_escape_string($connect, $data->planEntryMemo);

    $query = "INSERT INTO planEntry_ploy (attractionID, visitStart, visitEnd, previousAttractionID,timeToTravel,planID,inputBy, planEntrymemo) 
     VALUES ('$attractionID','$visitStart','$visitEnd','$previousAttractionID','$timeToTravel','$planID','$inputBy','$planEntryMemo')";
    if(mysqli_query($connect,$query)){
        echo "Data Inserted...";
    }
    else{
        echo "Error...";
    }
}

?>