<?php

//insertAttraction.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
//$attractionName = $dbhandle->real_escape_string($data->attractionName);
//$query = "INSERT INTO attractions_ploy (attractionName) VALUES ('$attractionName')";
//$dbhandle->query($query);
if(count($data)>0){
        $planID = mysqli_real_escape_string($connect, $data->planID);
    $tripName = mysqli_real_escape_string($connect, $data->tripName);
    $tripStart= mysqli_real_escape_string($connect, $data->tripStart);
    $tripEnd= mysqli_real_escape_string($connect, $data->tripEnd);
    $tripOrigin= mysqli_real_escape_string($connect, $data->tripOrigin);
    $tripStops= mysqli_real_escape_string($connect, $data->tripStops);
    $tripFinalDestination= mysqli_real_escape_string($connect, $data->tripFinalDestination);
    $planStart= mysqli_real_escape_string($connect, $data->planStart);
    $planDeadline= mysqli_real_escape_string($connect, $data->planDeadline);
    $notes= mysqli_real_escape_string($connect, $data->notes);
    $inputBy= mysqli_real_escape_string($connect, $data->inputBy);
    $briefing = mysqli_real_escape_string($connect, $data->briefing);
    $packing = mysqli_real_escape_string($connect, $data->packing);
    $weather= mysqli_real_escape_string($connect, $data->weather);
    $aboutDestination= mysqli_real_escape_string($connect, $data->aboutDestination);
    $dressing= mysqli_real_escape_string($connect, $data->dressing);
    $payments= mysqli_real_escape_string($connect, $data->payments);
    $electronics= mysqli_real_escape_string($connect, $data->electronics);
    $medical= mysqli_real_escape_string($connect, $data->medical);
    $timeZone= mysqli_real_escape_string($connect, $data->timeZone);
    $language= mysqli_real_escape_string($connect, $data->language);
    $transportation= mysqli_real_escape_string($connect, $data->transportation);
    $telecommunication = mysqli_real_escape_string($connect, $data->telecommunication);
    $hotel = mysqli_real_escape_string($connect, $data->hotel);
    $shopping= mysqli_real_escape_string($connect, $data->shopping);
    $electricity= mysqli_real_escape_string($connect, $data->electricity);
    $drinkingWater= mysqli_real_escape_string($connect, $data->drinkingWater);
    $dining= mysqli_real_escape_string($connect, $data->dining);
    $tips= mysqli_real_escape_string($connect, $data->tips);
    $publicAreas= mysqli_real_escape_string($connect, $data->publicAreas);
    $culture= mysqli_real_escape_string($connect, $data->culture);
    $religion= mysqli_real_escape_string($connect, $data->religion);
    $borderSecurity= mysqli_real_escape_string($connect, $data->borderSecurity);
    $safety = mysqli_real_escape_string($connect, $data->safety);
    $driving = mysqli_real_escape_string($connect, $data->driving);
    $locals= mysqli_real_escape_string($connect, $data->locals);
    $airport= mysqli_real_escape_string($connect, $data->airport);
    $usefulPhone= mysqli_real_escape_string($connect, $data->usefulPhone);
    $others= mysqli_real_escape_string($connect, $data->others);
    $suggestions= mysqli_real_escape_string($connect, $data->suggestions);
    $updateType = mysqli_real_escape_string($connect, $data->updateType);
    $planFileLocation = mysqli_real_escape_string($connect, $data->planFileLocation);

if($updateType == "updateDestinationInfo"){
    $query = "UPDATE planToCustomer_ploy SET  briefing = '$briefing',
     packing = '$packing', 
     weather ='$weather', 
     aboutDestination ='$aboutDestination',
     dressing ='$dressing', 
     payments ='$payments', 
     electronics ='$electronics', 
     medical ='$medical', 
     timeZone='$timeZone', 
     language='$language',
     transportation = '$transportation', 
     telecommunication = '$telecommunication', 
     hotel ='$hotel', 
     shopping ='$shopping',
     electricity ='$electricity', 
     drinkingWater ='$drinkingWater', 
     dining ='$dining', 
     tips ='$tips', 
     publicAreas='$publicAreas', 
     culture ='$culture',
     religion = '$religion', 
     borderSecurity = '$borderSecurity', 
     safety ='$safety', 
     driving ='$driving',
     locals ='$locals', 
     airport ='$airport', 
     usefulPhone ='$usefulPhone', 
     others ='$others', 
     suggestions ='$suggestions'
  WHERE planID = '$planID'";

if(mysqli_query($connect,$query)){
    echo "Data Updated...";
}
else{
    echo "Error...";
}
}else if($updateType == "updatePlanFileLocation"){
    $query = "UPDATE planToCustomer_ploy SET planFileLocation = '$planFileLocation' WHERE planID = '$planID'";
    if(mysqli_query($connect,$query)){
        echo "Data Updated...";
    }
    else{
        echo "Error...";
    }
}
else{
    $query = "UPDATE planToCustomer_ploy SET  tripName = '$tripName', 
    tripStart = '$tripStart', 
    tripEnd ='$tripEnd', 
    tripOrigin ='$tripOrigin',
 tripStops ='$tripStops', 
 tripFinalDestination ='$tripFinalDestination', 
 planStart ='$planStart', 
 planDeadline ='$planDeadline', 
 notes='$notes', 
 inputBy ='$inputBy'
  WHERE planID = '$planID'";

if(mysqli_query($connect,$query)){
    echo "Data Updated...";
}
else{
    echo "Error...";
}
}
   
}

?>

