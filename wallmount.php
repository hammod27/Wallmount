<?php
include 'env_var.php';
include 'brownLineCache.php';
include 'redLineCache.php';
include 'busLineCache.php';

try{
    $typeOfUrl = $_GET['type'];

    $brownLineFileName = 'brownLineCache.php';
    $redLinefileName = 'redLineCache.php';
    $busfileName = 'busCache.php';
    $fileTextStart = '<?php ';
    $fileTextEnd = ' ?>';

    switch($typeOfUrl) {
        case 'brownLine':
            $url = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?mapid=40800&key=" . $api_key_train_tracker . "&outputType=JSON";
            if(date("Y/m/d H:i") == $brownLineCacheTime){
                $response = $brownLineCacheValue;
            } 
            else {
                $response = file_get_contents($url);
                file_put_contents($brownLineFileName, $fileTextStart . "\$brownLineCacheTime = \"" . date("Y/m/d H:i") . "\"; " . "\$brownLineCacheValue = '" . $response . "';" . $fileTextEnd);
            }
            break;
        case 'redLine':
            $url = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?mapid=40630&key=" . $api_key_train_tracker . "&outputType=JSON";
            if(date("Y/m/d H:i") == $redLineCacheTime){
                $response = $redLineCacheValue;
            } 
            else {
                $response = file_get_contents($url);
                file_put_contents($redLineFileName, $fileTextStart . "\$redLineCacheTime = \"" . date("Y/m/d H:i") . "\"; " . "\$redLineCacheValue = '" . $response . "';" . $fileTextEnd);
            }
            break;
        case '156bus':
            $url = "http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=" . $api_key_bus_tracker . "&stpid=1412&format=json";
            if(date("Y/m/d H:i") == $busCacheTime){
                $response = $busCacheValue;
            } 
            else {
                $response = file_get_contents($url);
                file_put_contents($busFileName, $fileTextStart . "\$busCacheTime = \"" . date("Y/m/d H:i") . "\"; " . "\$busCacheValue = '" . $response . "';" . $fileTextEnd);
            }
            break;
        case 'weather':
            $url = "http://api.wunderground.com/api/abc9adf6b98ab958/conditions/q/60610.json";
            $response = file_get_contents($url);
            break;
        case 'forecast':
            $url = "http://api.wunderground.com/api/abc9adf6b98ab958/forecast/q/60610.json";
            $response = file_get_contents($url);
            break;
    }

    echo $response;
}
catch(Exception $e) {
    echo 'Message: ' .$e->getMessage();
}
?>