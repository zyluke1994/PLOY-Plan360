<?php

//insertPlan.php
include "../connectdb.php";
$data = json_decode(file_get_contents("php://input"));

if(count($data)>0){
    $destinationCity = mysqli_real_escape_string($connect, $data->destinationCity);
    $destinationCountry = mysqli_real_escape_string($connect, $data->destinationCountry);
    $updatedBy= mysqli_real_escape_string($connect, $data->updatedBy);
    $version= mysqli_real_escape_string($connect, $data->version);
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
    

    $query = "INSERT INTO destinationPlanInfoTemplate_ploy (destinationCity, destinationCountry, updatedBy, version,briefing,packing,weather, aboutDestination,dressing, payments, electronics, medical,timeZone,language,transportation, telecommunication,hotel, shopping, electricity,drinkingWater,dining,tips, publicAreas,culture, religion, borderSecurity, safety,driving,locals,usefulPhone, others,suggestions) 
     VALUES ('$destinationCity','$destinationCountry','$updatedBy','$version','$briefing','$packing','$weather','$aboutDestination','$dressing','$payments','$electronics','$medical','$timeZone','$language','$transportation','$telecommunication','$hotel','$shopping','$electricity','$drinkingWater','$dining','$tips','$publicAreas','$culture','$religion','$borderSecurity','$safety','$driving','$locals','$usefulPhone','$others','$suggestions')";
    if(mysqli_query($connect,$query)){
        echo "Data Inserted...";
    }
    else{
        echo "Error...";
    }
}

?>