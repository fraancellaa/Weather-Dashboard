var searchBtn = document.querySelector("#searchBtn");
var citySearchDiv = document.querySelector("#input-group");
var forecastContainerEl = document.querySelector("#forecast-container");
var weatherDetailContainer = document.querySelector("#cityWeather");
var searchHistoryBtn = document.querySelector("#search-history-btn")
var cityInputEl = document.querySelector("#cityInput");
var cityFormEl= document.querySelector("#city-search-form");
var cities = [];


var formSubmitHandler = function(event){
    event.preventDefault();
  
    var city = cityInputEl.value.trim();
    if (city){
        getCityWeather(city);
        fiveDayForecast(city);
        cities.unshift({city});
        
        cityInputEl.value = "";
        // a city must be entered
    } else {
        alert("A city must be entered");
    }
    saveSearch();
    searchHistory(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    // api key to weather api
    var apiKey = "fb391254eaf5ba6d50837043f03d0791";
      // format the api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

     // make a request to url
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => { 
            console.log(data)
            displayCityWeather(data);
        });
};

var displayCityWeather = function(weatherDisplaying) {
    weatherDetailContainer.textContent= "";  

    //display the city
    var currentCity = document.createElement('h2');
    currentCity.textContent = weatherDisplaying.name;
    weatherDetailContainer.appendChild(currentCity);

    //display actual date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment().format("MMM D, YYYY h:mm a") + ") ";
    currentCity.appendChild(currentDate);

    //display icon for the weather
   var weatherImage = document.createElement('img');
   image.src = ` http://openweathermap.org/img/wn/${weatherDisplaying.weather[0].icon}@2x.png`
   currentCity.appendChild(weatherImage);

    // display the temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weatherDisplaying.main.temp + " °F";
   weatherDetailContainer.appendChild(temperatureEl);

   //display humidity
   var humidityEl = document.createElement('span');
   humidityEl.textContent = "Humidity: " + weatherDisplaying.main.humidity + " %";
   weatherDetailContainer.appendChild(humidityEl);

   //display the wind speed
   var windEl = document.createElement('span');
   windEl.textContent = "Wind: " + weatherDisplaying.wind.speed + " MPH";
   weatherDetailContainer.appendChild(windEl);

   //lat and lon values needed for api call in uvIndex function
   var lat = weatherDisplaying.coord.lat;
   var lon = weatherDisplaying.coord.lon;
   uvIndex(lat,lon);
}

var uvIndex = function(lat, lon) {
    var apiKey = "fb391254eaf5ba6d50837043f03d0791";
    // api url for uv index
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

   
    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

// change colors of UV index depending on the values/status of the city
    if(index.value <=2){
        uvIndexValue.style.backgroundColor = "green";
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.style.backgroundColor = "yellow"
    }
    else if(index.value >8){
        uvIndexValue.style.backgroundColor = "red";
    };
// append uv index values to the weather container
    uvIndexEl.appendChild(uvIndexValue);
    weatherDetailContainer.appendChild(uvIndexEl);
}

// create var for the 5 day forecast

var fiveDayForecast = function(city) {
    forecastContainerEl.textContent = ""
    var apiKey = "fb391254eaf5ba6d50837043f03d0791";
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(response => response.json())
        .then(data => { 
            console.log(data)
            displayFiveDayForecast(data);
        });
    };


var displayFiveDayForecast = function(weatherDisplaying) {
    var forecast = weatherDisplaying.list;
    for(var i = 5; i < forecast.length; i= i + 8){
    var everydayForecast = forecast[i];
   
    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";


    //display the date for the next 5 days from day entered
    var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(everydayForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       // show the icon for the weather
       var forecastIcon = document.createElement('img');
       forecastIcon.src = ` http://openweathermap.org/img/wn/${everydayForecast.weather[0].icon}@2x.png`
       forecastIcon.style.width = '30%';
       forecastEl.appendChild(forecastIcon);

        //display the temperature for the 5 days
        var forecastTemperature = document.createElement('span');
        forecastTemperature.textContent = "Temperature: " + everydayForecast.main.temp + " °F";
        forecastTemperature.classList = "card-body";
        forecastEl.appendChild(forecastTemperature);

        //display the wind for the 5 days
        var forecastWind = document.createElement('span');
        forecastWind.textContent = "Wind: " + everydayForecast.wind.speed + " MPH";
        forecastWind.classList = "card-body";
        forecastEl.appendChild(forecastWind);

        //display the humidity for the 5 days
        var forecastHumidity = document.createElement('span');
        forecastHumidity.textContent = "Humidity: " + everydayForecast.main.humidity + " %";
        forecastHumidity.classList = "card-body";
        forecastEl.appendChild(forecastHumidity);


       //append all
       forecastContainerEl.appendChild(forecastEl);
    }
}


var searchHistory = function(searchHistory) {
    
    var searchHistoryEl = document.createElement('button');
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.setAttribute("data-city", searchHistory);
    searchHistoryEl.setAttribute("type", "submit");

    searchHistoryBtn.prepend(searchHistoryEl);
}

var previousSearch = function(event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityWeather(city);
        fiveDayForecast(city);
    }
}



cityFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryBtn.addEventListener("click", previousSearch);