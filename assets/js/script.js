var weatherDetailContainer = document.querySelector("#cityWeather");
var searchBtn = document.querySelector("#searchBtn");
var citySearchDiv = document.querySelector("#input-group");
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#cityInput");
var forecastContainerEl = document.querySelectorAll("#forecast-container");
var searchHistoryBtn = document.querySelectorAll("#search-history-btn");
var cities = [];


var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if (city){
        getWeather(city);
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

var getWeather = function(city) {
    // api key to access OpenWeatherAPI
    var apiKey = "fb391254eaf5ba6d50837043f03d0791";
    // format the api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl).then(response => response.json())
    .then(data => {
        console.log(data)
        displayWeather(data);
    });
};


var displayWeather = function(weatherDisplaying) {
    weatherDetailContainer.textContent = "";

    // display city name when searched
    var currentCity = document.createElement('h2');
    currentCity.textContent = weatherDisplaying.name;
    weatherDetailContainer.appendChild(currentCity);

    // display actual date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment().format("MM D, YYYY h:mm a") + ") ";
    currentCity.appendChild(currentDate);

    // display icon for the weather
    var image = document.createElement('img');
    image.src = 
    currentCity.appendChild(image);

    // create span to include temperature data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weatherDisplaying.main.temp + " °F";
    weatherDetailContainer.appendChild(temperatureEl);

    // display the humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weatherDisplaying.main.humidity + " %";
    weatherDetailContainer.appendChild(humidityEl);

    // display the wind speed
    var windEl = document.createElement("span");
    windEl.textContent = "Wind: " + weatherDisplaying.wind.speed + " MPH";
    weatherDetailContainer.appendChild(windEl);

    // display the UV index
    var lat = weatherResults.coord.lat;
    var long = weatherResults.coord.lon;
    uvIndex(lat, lon);
}

var uvIndex = function(lat, lon) {
    var apiKey = "fb391254eaf5ba6d50837043f03d0791";
    // api url for the uv index function
    var apiUrl = ``

    //make request to url
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            displayUvIndex(data);
        });
    });
    console.log(lon);
    console.log(lat);
}

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    // change colors of UV index depending on the value/status of the city
    if(index.value <=2) {
        uvIndexValue.style.backgroundColor = "green";
    } else if(index.value > 2 && index.value<=8){
        uvIndexValue.style.backgroundColor = "yellow";
    } else if(index.value >8){
        uvIndexValue.style.backgroundColor = "red";
    };

    // append uv index values to the weather container
    uvIndexEl.appendChild(uvIndexValue);
    weatherDetailContainer.appendChild(uvIndexEl);
}