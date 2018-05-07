<?php

//insertAttraction.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));
//$attractionName = $dbhandle->real_escape_string($data->attractionName);
//$query = "INSERT INTO attractions_ploy (attractionName) VALUES ('$attractionName')";
//$dbhandle->query($query);
if(count($data)>0){
$templateID = mysqli_real_escape_string($connect, $data->templateID);
    $version = mysqli_real_escape_string($connect, $data->version);
    $updatedBy= mysqli_real_escape_string($connect, $data->updatedBy);
    $destinationCity= mysqli_real_escape_string($connect, $data->destinationCity);
    $destinationCountry= mysqli_real_escape_string($connect, $data->destinationCountry);
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
    $usefulPhone= mysqli_real_escape_string($connect, $data->usefulPhone);
    $others= mysqli_real_escape_string($connect, $data->others);
    $suggestions= mysqli_real_escape_string($connect, $data->suggestions);
    $updateType = mysqli_real_escape_string($connect, $data->updateType);
    
    $query = "UPDATE destinationPlanInfoTemplate_ploy SET  briefing = '$briefing',
     packing = '$packing', 
     weather ='$weather', 
     aboutDestination ='$aboutDestination',
     dressing ='$dressing', 
     payments ='$payments', 
     electronics ='$electronics', 
     medical ='$medical', 
     timeZone='$timeZone', 
     language ='$language',
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
     usefulPhone ='$usefulPhone', 
     others ='$others', 
     suggestions ='$suggestions',
     destinationCity= '$destinationCity',
     destinationCountry= '$destinationCountry',
     updatedBy = '$updatedBy',
     version ='$version'
  WHERE templateID = '$templateID'";

if(mysqli_query($connect,$query)){
    echo "Data Updated...";
}
else{
    echo "Error...";
}
}


?>