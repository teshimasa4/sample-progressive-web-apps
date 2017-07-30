

(function() {
  'use strict';

  var app = {};

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

  module.init();

  document.getElementById('word').addEventListener('blur', function() {
    document.getElementById('title').innerHTML = '';

    var key = app.getKey();
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;

    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json.query.results;
            results.key = key;
            results.created = json.query.created;
            app.updateForecastCard(results);
          });
        }
      });
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.created = response.query.created;
          app.updateForecastCard(results);
        }
      } else {
        // app.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  });

  app.getKey = function() {
    var city = document.getElementById('word').value;
    if (city == 1) {
      return '2357536';
    } else if (city == 2) {
      return '2367105';
    } else if (city == 3) {
      return '2379574';
    } else {
      return '2459115';
    }
  };

  app.updateForecastCard = function(data) {
    document.getElementById('title').innerHTML = data.channel.title;
  };
  
  document.getElementById('save').addEventListener('click', function() {
    var key = document.getElementById('word').value;
    var value = document.getElementById('title').innerHTML;

    module.add(key, value);
    module.getAll(document.getElementById('result'));
  });

})();
