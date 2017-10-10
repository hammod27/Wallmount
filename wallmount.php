<?php

include 'env_var.php';

try{
    $typeOfUrl = $_GET['type'];
    if($typeOfUrl == 'brownLine'){
      $url = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?mapid=40800&key=" . $api_key_train_tracker . "&outputType=JSON";
    }
    if($typeOfUrl == 'redLine'){
      $url = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?mapid=40630&key=" . $api_key_train_tracker . "&outputType=JSON";
    }
    if($typeOfUrl == '156bus'){
      $url = "http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=" . $api_key_bus_tracker . "&stpid=1412&format=json";
    }
    if($typeOfUrl == 'weather'){
      $url = "http://api.wunderground.com/api/abc9adf6b98ab958/conditions/q/60610.json";
    }
    if($typeOfUrl == 'forecast'){
      $url = "http://api.wunderground.com/api/abc9adf6b98ab958/forecast/q/60610.json";
    }
    $response = file_get_contents($url);
    echo $response;
}
catch(Exception $e) {
  echo 'Message: ' .$e->getMessage();
}
?>