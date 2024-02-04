class weatherPoint {
  constructor (cityName, lat, long, temp, hum, wind, deg, precip, clouds, baro, measure)
  {
     this.cityName = cityName;
     this.lattitude = lat;
     this.longitude = long;
     this.temperature = temp;
     this.humidity = hum;
     this.windSpeed = wind;
     this.windDirecion = deg;
     this.precipitation = precip;
     this.cloudPercent = clouds;
     this.barometric = baro;
     this.measure = measure;
  }
  makeHTML(idNumber){
    let tmpCityContainer = document.getElementById("grid-containerCities");
    //
    let tmpCityChild = document.createElement("div");
    tmpCityChild.className = ("cityChild");
    tmpCityChild.id = "C" + idNumber;
    //
    let vTemp = Number(this.temperature);
    if (currMeasure == "metric") {vTemp = ((9*vTemp)/5) + 32}

    if (vTemp < 32) {tmpCityChild.style = "background-color: hsl(230, 91%, 50%)"}
    else if (vTemp < 45)  {tmpCityChild.style = "background-color: hsl(162, 96%, 32%)"}
    else if (vTemp < 60)  {tmpCityChild.style = "background-color: hsl(290, 88%, 35%)"}
    else if (vTemp < 75)  {tmpCityChild.style = "background-color: hsl(327, 93%, 37%)"}
    else {tmpCityChild.style = "background-color: hsl(0, 72%, 41%)"}
    //
    let tmpInner = document.createElement("div");
    tmpInner.className = "innerdiv";
    //
    let tmpHeader = document.createElement("div");
    tmpHeader.className = "cwhead";
    tmpHeader.innerHTML = `<strong>${this.cityName}</strong>`;
    //    
    let tmpPara = document.createElement("p");
    tmpPara.className = "cwbody";
    let vwind = " MPH";
    let vtemp = " deg F" 
    if (currMeasure == "metric") {vwind = " KPH";
                                   vtemp = " deg C"};
    //
    tmpPara.innerHTML = 
    `<strong>Temperature:</strong> ${this.temperature}${vtemp}<br>` +
    `<strong>Humidity:</strong> ${this.humidity}%<br>` +
    `<strong>Wind Speed:</strong> ${this.windSpeed}${vwind}<br>` +
    `<strong>Wind Dir:</strong> ${this.windDirecion} deg<br>` +
    `<strong>Precip:</strong> ${this.precipitation}<br>` +
    `<strong>Cloud Percent:</strong> ${this.cloudPercent}%<br>` +
    `<strong>Barometric:</strong> ${this.barometric} hPa<br>` +
    `<strong>Lat:</strong> ${this.lattitude}<br>` +
    `<strong>Lon:</strong> ${this.longitude}<br>` +
    `<strong>Measure:</strong> ${this.measure}`;
    let tmpImage = document.createElement("div");
    tmpImage.className = "image";
    
    if (this.precipitation.indexOf("snow") > -1) 
    {
     tmpImage.innerHTML = '<img src="./images/snowy.png" alt="snowy">';
    }
    else
    if (this.precipitation.indexOf("rain") > -1) 
       {
        tmpImage.innerHTML = '<img src="./images/rainy.png" alt="rainy">';
       }
    else if (Number(this.cloudPercent) == 0) 
       {
        tmpImage.innerHTML = '<img src="./images/sunny.png" alt="sunny">';
       }
    else if (Number(this.cloudPercent) == 100) 
       {
        tmpImage.innerHTML = '<img src="./images/cloudy.png" alt="cloudy">';
       }
    else {tmpImage.innerHTML = '<img src="./images/prtlycloudy.png" alt="prtlycloudy">';}
    tmpImage.innerHTML = `${Math.round(Number(this.temperature))}&deg` + tmpImage.innerHTML;

    let tmpTrash = document.createElement("img");
    tmpTrash.className = "trash";
    tmpTrash.id = "T" + idNumber;
    tmpTrash.src= "./images/trash.png" 
    tmpTrash.alt= "trash";
    tmpTrash.addEventListener("click", deleteCity);
    
    tmpInner.appendChild(tmpImage);
    tmpInner.appendChild(tmpHeader);
    tmpInner.appendChild(tmpPara);
    tmpInner.appendChild(tmpTrash);
    tmpCityChild.appendChild(tmpInner);
    tmpCityContainer.appendChild(tmpCityChild);
  }
}

function setAPIParams(latt, long) {
  const urlbase = "https://api.openweathermap.org/data/2.5/weather?"
  const latbase = "&lat=";
  const longbase = "&lon=";
  const unitsbase = "&units=";
  const CWapikey = "&appid=69b8b0e64651687e2191a6a07b2f7f2d";
  let URLlong = urlbase + latbase + latt + longbase + long + unitsbase + currMeasure + CWapikey;
  return URLlong;
}

  function retrieveWeather(city, apiURL) {
    fetch(apiURL,
         { mode: "cors" })
    .then((res) => {res.json()
      .then((data) => {createCityInstance(city,data)})
    })
    .catch((err) => {
      console.error(err);
        })
    }

    function showCity(cityArrIndex) 
    {
      allWeatherPoints[cityArrIndex].makeHTML(currentCityID);
      currentCityID++;
    }

    function deleteCity(event) 
    {
      document.getElementById("C" + event.srcElement.id.substring(1)).remove();
    }

  function createCityInstance(cityName, data)  
  { 
    const vlat = data.coord.lat;
    const vlong = data.coord.lon;
    let vtemp = data.main.temp;
    const vhum = data.main.humidity;
    let vwind = data.wind.speed;
    const vdeg = data.wind.deg;
    const vprecip = data.weather[0].description;
    const vclouds = data.clouds.all;
    const vbaro = data.main.pressure;
    const vmeasure = currMeasure;

    allWeatherPoints.push(new weatherPoint
          (cityName, vlat, vlong, vtemp, vhum, vwind, vdeg, vprecip, vclouds, vbaro, vmeasure));

    showCity(allWeatherPoints.length - 1);
  };

function showFavWeather(event)
 {
  let vFavLoc = event.srcElement.id.substring(1);
  retrieveWeather(favorites[vFavLoc].City, 
               setAPIParams(favorites[vFavLoc].lat,
                            favorites[vFavLoc].lon));
 }

function showFavorites() 
{
   let tmpFav = document.getElementById("cwFavbody");
   tmpFav.innerHTML = "";

   for (vint = 0; vint < favorites.length; vint++)
         {
          let tmpPar = document.createElement("p");
          tmpPar.id = "F" + vint;
          tmpPar.innerHTML = `${favorites[vint].City}`;
          tmpPar.addEventListener("click", showFavWeather);
          tmpFav.append(tmpPar);
         }
  }

function toggleMeasure() {
    
    document.getElementById("grid-measure").innerHTML = `<i>See ${currMeasure}</i>`;
    if (currMeasure == "metric") {currMeasure = "imperial"}
    else {currMeasure = "metric"}    
  }

function callNewCity()
{
  const tmpCity = document.getElementById("newcity");
  const tmpLat = document.getElementById("lattitude");
  const tmpLon = document.getElementById("longitude");
  favorites.push({City: tmpCity.value, lat:tmpLat.value, lon:tmpLon.value});
  showFavorites();
  retrieveWeather(tmpCity.value, setAPIParams(tmpLat.value, tmpLon.value));
}
//MAIN ROUTINE -----------------
document.getElementById("grid-measure").addEventListener("click", toggleMeasure);
document.getElementById("button-city").addEventListener("click", callNewCity);

//Globals
let allWeatherPoints = [];
let currMeasure = "imperial";
let currentCityID = 0;
let favorites =[
  {City: "Bangor", lat: 44.808147, lon: -68.795013},
  {City: "Bismarck", lat: 46.825905, lon: -100.778275},
  {City: "Chicago", lat: 41.8781, lon:-87.6298},
  {City: "Dallas", lat: 32.8021266, lon: -96.7888529},
  {City: "Detroit", lat: 42.329543, lon: -83.043720},
  {City: "Erie", lat: 42.0609518, lon:-80.1434488},
  {City: "Key West", lat: 24.555059, lon: -81.779984},
  {City: "Las Vegas", lat: 36.171960, lon:-115.1035},
  {City: "LA", lat: 34.052235, lon: -118.243683},
  {City: "NYC", lat: 40.7128, lon:-74.0060},
  {City: "Oahu", lat: 21.31560, lon: -157.858093},
  {City: "Phoenix", lat: 33.448376, lon: -112.074036},
  {City: "Pittsburgh", lat: 40.4419818524075, lon: -79.9746356538228},
  {City: "San Francisco", lat: 37.773972, lon:-122.431297},
  {City: "Seattle", lat: 47.6061, lon:-122.3328}
  ];
 
  showFavorites();