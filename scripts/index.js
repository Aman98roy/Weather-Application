// /* **********************************************
// **
// ** UI Elements Module
// **
// ** - this module will be responsible for controling UI Elements like 'menu'
// ** ******************************************** */

const UI = (function () {
    let menu = document.querySelector("#menu-container");

    // show the app and hide the loading screen
    const showApp = () => {
        document.querySelector("#app-loader").classList.add("display-none");
        document.querySelector("main").removeAttribute("hidden");
    };

    // hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector("#app-loader").classList.remove("display-none");
        document.querySelector("main").setAttribute("hidden", "true");
    };

    // show menu
    const _showMenu = () => (menu.style.right = 0);

     // hide menu
    // get menu width in % 
    const _hideMenu = () => menu.style.right = '-' + Math.round(menu.offsetWidth / window.innerWidth * 100) + '%'

    const _toggleHourlyWeather = () => {
        let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
            arrow = document.querySelector("#toggle-hourly-weather").children[0],
            visible = hourlyWeather.getAttribute("visible"),
            dailyWeather = document.querySelector("#daily-weather-wrapper");

        if (visible == "false") {
            hourlyWeather.setAttribute("visible", "true");
            hourlyWeather.style.bottom = 0;
            arrow.style.transform = "rotate(180deg)";
            dailyWeather.style.opacity = 0;
        } else if (visible == "true") {
            hourlyWeather.setAttribute("visible", "false");
            hourlyWeather.style.bottom = "-100%";
            arrow.style.transform = "rotate(0deg)";
            dailyWeather.style.opacity = 1;
        } else
            console.error(
                "Unknown state of the hourly weather panel and visible attribute"
            );
    };

    // show alert 'no city found'
    const noCityFoundAlert = () => {
        let alert = document.querySelector("#alert-city-not-foud");
        alert.style.bottom = '20px';

        // hide the alert after 2 seconds
        setTimeout(() => { alert.style.bottom = '-50px' }, 2000)
    }


    const drawWeatherData = (data, location) => {

        let currentlyData = data.current,
            dailyData = data.daily,
            hourlyData = data.hourly,
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon,
            hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
            hourlyWeatherModel,
            hourlyIcon;



        // set current weather
        // ===================
        // set current location
        document.querySelectorAll(".location-label").forEach((e) => {
            e.innerHTML = location;
        });


        let iconName = currentlyData.weather[0].icon;

        // set the background
        document.querySelector('main').style.backgroundImage = `url("./assets/images/bg-images/${currentlyData.weather[0].main}.jpg")`;

        // set the icon
        let str1 = "http://openweathermap.org/img/wn/";
        let str2 = "@2x.png";
        let url = str1.concat(iconName, str2);
        document.querySelector("#currentlyIcon").setAttribute('src', url);
        // set summary
        document.querySelector("#summary-label").innerHTML = currentlyData.weather[0].main;

        // set temperature from Fahrenheit -> Celcius

        // console.log(currentlyData.temp);
        document.querySelector("#degrees-label").innerHTML = Math.round(
            currentlyData.temp - 273.15) + '&#176;'

        // set humidty
        document.querySelector("#humidity-label").innerHTML = Math.round(currentlyData.humidity) + '%';
        // set wind speed
        document.querySelector("#wind-speed-label").innerHTML = (currentlyData.wind_speed * 1.6093).toFixed(1) + ' kph';

        // set daily weather
        // ===================
        while (dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1])
        }

        for (let i = 0; i <= 6; i++) {
            // clone the node and remove display none close
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');
            // set the day
            day = weekDays[new Date(dailyData[i].dt * 1000).getDay()]
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            // set min/max temperature for the next days in Celcius
            maxMinTemp = Math.round(dailyData[i].temp.max - 273.15) + '&#176;' + '/' + Math.round(dailyData[i].temp.min - 273.15) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
            // set daily icon
            dailyIcon = dailyData[i].weather[0].icon;
            dailyUrl = str1.concat(dailyIcon, str2);
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', dailyUrl);
            // append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        }

        dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

         // set hourly weather
        // ===================
        while (hourlyWeatherWrapper.children[1]) {
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1])
        }

        for (let i = 0; i <= 24; i++) {
            // clone the node and remove display none close
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove('display-none');
            // set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyData[i].dt * 1000).getHours() + ":00";

            // set temperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round(hourlyData[i].temp - 273.15) + '&#176;';
            // set the icon
            hourlyIcon = hourlyData[i].weather[0].icon;
            hourlyUrl = str1.concat(hourlyIcon, str2);
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', hourlyUrl);

            // append model
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
        }

        UI.showApp();

    };
    // menu events
    document.querySelector("#open-menu-btn").addEventListener("click", _showMenu);
    document
        .querySelector("#close-menu-btn")
        .addEventListener("click", _hideMenu);

    // hourly-weather wrapper event
    document
        .querySelector("#toggle-hourly-weather")
        .addEventListener("click", _toggleHourlyWeather);

    // export
    return {
        showApp,
        loadApp,
        drawWeatherData,
        noCityFoundAlert
    };
})();

// /* **********************************************
// **
// ** Local Storage Api
// **
// ** - this module will be responsible for saving, retriving and deleting the cities added by user
const LOCALSTORAGE = (function () {

    let savedCities = [];

    const save = (city) => {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    };

    const get = () => {
        if (localStorage.getItem('savedCities') != null)
            savedCities = JSON.parse(localStorage.getItem('savedCities'));
    }

    const remove = (index) => {
        if (index < savedCities.length) {
            savedCities.splice(index, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
        }
    }

    const getSavedCities = () => savedCities;

    return {
        save,
        get,
        remove,
        getSavedCities
    }
})();

// /* **********************************************
// **
// ** Saved Cities module
// **
// ** - this module will be responsible for showing on the UI saved cities from the local storage
// ** and from here user will be able to delete or switch between the city he wants to see data
// ** ******************************************** */
const SAVEDCITIES = (function(){
    let container = document.querySelector("#saved-cities-wrapper");

    const drawCity = (city) => {
        let cityBox = document.createElement('div'),
            cityWrapper = document.createElement('div'),
            deleteWrapper = document.createElement('div'),
            cityTextNode = document.createElement('h1'),
            deleteBtn = document.createElement('button');

        cityBox.classList.add('saved-city-box','flex-container');
        cityTextNode.innerHTML = city;
        cityTextNode.classList.add('set-city');
        cityWrapper.classList.add('ripple','set-city');
        cityWrapper.append(cityTextNode);
        cityBox.append(cityWrapper);

        deleteBtn.classList.add('ripple','remove-saved-city');
        deleteBtn.innerHTML = '-';
        deleteWrapper.append(deleteBtn);
        cityBox.append(deleteWrapper);

        container.append(cityBox);
    };
    
    const _deleteCity = (cityHTMLBtn) => {
        let nodes = Array.prototype.slice.call(container.children),
            cityWrapper = cityHTMLBtn.closest('.saved-city-box'),
            cityIndex = nodes.indexOf(cityWrapper);
        LOCALSTORAGE.remove(cityIndex);
        cityWrapper.remove();

    }

    // click event on minus button
    // add an event on the document, because these elements will be created dinamically
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-saved-city')) {
            _deleteCity(event.target);
        }
    });

     // click event on a city from menu 
     document.addEventListener('click', function (event) {
        if (event.target.classList.contains('set-city')) {
            let nodes = Array.prototype.slice.call(container.children),
                cityWrapper = event.target.closest('.saved-city-box'),
                cityIndex = nodes.indexOf(cityWrapper),
                savedCities = LOCALSTORAGE.getSavedCities();

            WEATHER.getWeather(savedCities[cityIndex], false);
        }
    });

    return {
        drawCity
    }

})();






// /* **********************************************
// **
// ** Get location Module
// **
// ** - this module will be responsible for getting the data about the location to search for weather
// ** ******************************************** */

const GETLOCATION = (function () {
    let location;

    const locationInput = document.querySelector("#location-input"),
        addCityBtn = document.querySelector("#add-city-btn");

    const _addCity = () => {
        location = locationInput.value;
        locationInput.value = "";
        addCityBtn.setAttribute("disabled", "true");
        addCityBtn.classList.add("disabled");

        // get weather data
        WEATHER.getWeather(location, true)
    };

    locationInput.addEventListener("input", function () {
        let inputText = this.value.trim();

        if (inputText != "") {
            addCityBtn.removeAttribute("disabled");
            addCityBtn.classList.remove("disabled");
        } else {
            addCityBtn.setAttribute("disabled", "true");
            addCityBtn.classList.add("disabled");
        }
    });

    addCityBtn.addEventListener("click", _addCity);
})();

/* **********************************************
**
** Get Weather data
**
// ** - this module will aquire weather data and then it will pass to another module which will put the data on UI
// ** ******************************************** */

const WEATHER = (function () {
    const openWeather = "633415ed1e31e98008e7c260aa57e8bb",
        geocoderKey = "5581bfda5a044e9b8fe91bc5fc6d5eab";

    const _getGeocodeURL = (location) =>
        `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

    const _getOpenWeatherURL = (lat, lng) =>
        `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=exclude=minutely&appid=${openWeather}`;

    const _getOpenWeatherData = (url, location) => {
        axios
            .get(url)
            .then((res) => {
                console.log(res);
                UI.drawWeatherData(res.data, location)
            })
            .catch((err) => {
                console.error(); (err);
            });
    };

    const getWeather = (location,save) => {
        UI.loadApp();

        let geocodeURL = _getGeocodeURL(location);

        axios
            .get(geocodeURL)
            .then((res) => {
                console.log(res);
                if (res.data.results.length == 0) {
                    console.error("Invalid Location");
                    UI.showApp();
                    UI.noCityFoundAlert();
                    return;
                }

                if (save) {
                    LOCALSTORAGE.save(location);
                    SAVEDCITIES.drawCity(location);
                }

                let lat = res.data.results[0].geometry.lat,
                    lng = res.data.results[0].geometry.lng;

                let openWeatherURL = _getOpenWeatherURL(lat, lng);

                _getOpenWeatherData(openWeatherURL, location);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return {
        getWeather,
    };
})();

// /* **********************************************
// **
// ** Init
// **
// ** 
// ** ******************************************** */

// when the app has finished loading the content, images, files .....
window.onload = function () {
    // get items from local storage and store them inside "savedCities" array
    LOCALSTORAGE.get();
    // get that array and store it in a variable for ease of use
    let cities = LOCALSTORAGE.getSavedCities();
    // check if there were any elements inside the local storage
    if (cities.length != 0) {
        // if so then draw each saved city inside the menu
        cities.forEach((city) => SAVEDCITIES.drawCity(city));
        // get weather for the last city added
        WEATHER.getWeather(cities[cities.length - 1], false)
    }
    // show the app in case that local storage was empty
    else UI.showApp();

}