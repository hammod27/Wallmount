var jsonObject;
var url = '../python/wallmount.php';

$(document).ready(function(){
    //Date & time info
    setInterval(function() {
        setTime();
        setDate();
    }, 1000); 

    //Train info
    getBrownLineInformation();
    getRedLineInformation();
    setInterval(function() {
        getBrownLineInformation();
        getRedLineInformation();
    }, 60 * 1000 + 100);

    //Bus info
    setInterval(function() {
        get156BusInformation();
    }, 60 * 1000 + 100);

    //Weather info
    getWeatherInformation();
    getForecastInformaiton();
    setInterval(function(){
        getWeatherInformation();
        getForecastInformaiton();
    }, 10 * 60 * 1000);

    //Calendar info
    setInterval(function(){
        parent.frames['myCalendar'].src = parent.frames['myCalendar'].src;
    }, 60 * 60 * 1000);
});

/**
 * Time & Date information
 */
var setTime = function(){
    $('.time').empty();
    $('.time').append(moment().format('h:mm A'));
}

var setDate = function(){
    $('.date').empty();    
    $('.date').append(moment().format('dddd, MMMM Do'));
}

/**
 * Brown line information
 */
var getBrownLineInformation = function(){
    $.ajax({
        type: 'GET',
        url: url + '?type=brownLine',
        dataType: 'json',
        success: function(rsp){
            buildBrownLineHtml(rsp.ctatt.eta)
        }
    });
}

var buildBrownLineHtml = function(etaArray){
    $('.brownLineHereLeft').empty();
    $('.brownLineHereRight').empty();
    for(var i = 0; i < etaArray.length; i++){
        var direction = etaArray[i].destNm;
        var arrivalTime = etaArray[i].arrT;
        if(direction == 'Loop'){
            $('.brownLineHereLeft').append('<div>' + moment(arrivalTime).format('h:mm A') + getTime(moment(arrivalTime)) + '</div><br/>');
        } else {
            $('.brownLineHereRight').append('<div>' + moment(arrivalTime).format('h:mm A') + getTime(moment(arrivalTime)) + '</div><br/>');
        }
    }
}

/**
 * Red line information
 */
var getRedLineInformation = function(){
    $.ajax({
        type: 'GET',
        url: url + '?type=redLine',
        dataType: 'json',
        success: function(rsp){
            buildRedLineHtml(rsp.ctatt.eta)
        }
    });
}

var buildRedLineHtml = function(etaArray){
    $('.redLineHereLeft').empty();
    $('.redLineHereRight').empty();
    for(var i = 0; i < etaArray.length; i++){
        var direction = etaArray[i].destNm;
        var arrivalTime = etaArray[i].arrT;
        if(direction == '95th/Dan Ryan'){
            $('.redLineHereLeft').append('<div>' + moment(arrivalTime).format('h:mm A') + getTime(moment(arrivalTime)) + '</div><br/>');
        } else {
            $('.redLineHereRight').append('<div>' + moment(arrivalTime).format('h:mm A') + getTime(moment(arrivalTime)) + '</div><br/>');
        }
    }
}

/**
 * Get/format time for train display
 */
var getTime = function(momentArrivalTime){
    var x = moment.utc(momentArrivalTime.diff(moment())).format('mm');
    var minuteLable = (x == '01') ? 'min' : 'mins';
    var timeDifference = '';

    if(x == '00'){
        timeDifference = ' (Due)';
    } else if (x.substring(0,1) == '0') {
        timeDifference = ' (' + x.substring(1,2) + ' ' + minuteLable + ')';
    } else {
        timeDifference = ' ('+ x + ' ' + minuteLable + ')';
    }

    return timeDifference;
}

/**
 * 156 bus information
 */
var get156BusInformation = function(){
    $.ajax({
        type: 'GET',
        url: url + '?type=156bus',
        dataType: 'json',
        success: function(rsp){
            build156BusHtml(rsp['bustime-response']);
        }
    });
}

/**
 * Build 156 information
 */
var build156BusHtml = function(prediction){
    $('.156BusHere').empty();
    if(prediction.error){
        $('.156BusHere').append('<div>' + 'No busses incoming' + '</div><br/>');
    } else {
        for(var i = 0; i < prediction.prd.length; i++){
            var arrivalDateTime = prediction.prd[i].prdtm;
            var arrivalTime = arrivalDateTime.substring(arrivalDateTime.indexOf(' ') + 1, arrivalDateTime.length);
            $('.156BusHere').append('<div>' + moment(arrivalTime, 'HH:mm').format('h:mm A') + getTime(moment(arrivalTime, 'HH:mm').add(1,'m')) + '</div><br/>');
        }
    }
}

/**
 * Weather information
 */
var getWeatherInformation = function(){
    $.ajax({
        type: 'GET',
        url: url + '?type=weather',
        dataType: 'json',
        success: function(rsp){
            buildWeatherHtml(rsp)
        }
    });
}

var buildWeatherHtml = function(data){
    $('.weatherHere').empty();
    $("#currentWeatherImage").attr("src",data.current_observation.icon_url);
    $('.weatherHere').append(data.current_observation.weather + ' ' + data.current_observation.temp_f + '\u00B0 F');
}

var getForecastInformaiton = function(){
    $.ajax({
        type: 'GET',
        url: url + '?type=forecast',
        dataType: 'json',
        success: function(rsp){
            buildForecastHtml(rsp)
        }
    });
}

var buildForecastHtml = function(data){
    var forecastDays = data.forecast.simpleforecast.forecastday;
    var tomorrowForecast = forecastDays[1];
    var dayTwoForecast = forecastDays[2];
    var dayThreeForecast = forecastDays[3];

    $('.tomorrowForecast').empty();
    $('.tomorrowForecast').append(tomorrowForecast.conditions + '<br/> High: ' + tomorrowForecast.high.fahrenheit + '\u00B0 F' + ' Low: ' + tomorrowForecast.low.fahrenheit + '\u00B0 F');
    $("#tomorrowForecastImage").attr("src",tomorrowForecast.icon_url);
    
    $('.dayTwoForecast').empty();
    $('.dayTwoForecast').append(dayTwoForecast.conditions + '<br/> High: ' + dayTwoForecast.high.fahrenheit + '\u00B0 F' + ' Low: ' + dayTwoForecast.low.fahrenheit + '\u00B0 F');
    $("#dayTwoForecastImage").attr("src",dayTwoForecast.icon_url);
    $("#dayTwoTitle").text(dayTwoForecast.date.weekday);
    
    $('.dayThreeForecast').empty();
    $('.dayThreeForecast').append(dayThreeForecast.conditions + '<br/> High: ' + dayThreeForecast.high.fahrenheit + '\u00B0 F' + ' Low: ' + dayThreeForecast.low.fahrenheit + '\u00B0 F');
    $("#dayThreeForecastImage").attr("src",dayThreeForecast.icon_url);
    $("#dayThreeTitle").text(dayThreeForecast.date.weekday);
}