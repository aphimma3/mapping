// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.mag) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        var color;
          if (feature.properties.mag < 2 ) {
            color = 'red'
            } else if (feature.properties.mag < 4) {
            color = "orange"
            } else if (feature.properties.mag < 6) {
            color = "yellow"
            } else if (feature.properties.mag < 8) {
            color = "green"
            } else  {
            color = "blue"
            }
           var circleOptions = {
              radius: 3*feature.properties.mag,
              fillColor: color,
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
            return L.circleMarker(latlng, circleOptions);
          }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiYXBoaW1tYXNvbmUiLCJhIjoiY2sxZG4wNHpyMDVuejNjbXFubnQ1NmtpaiJ9.toy2lWcfSslnUZl_JcgTzQ"
  });

  var basicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: "pk.eyJ1IjoiYXBoaW1tYXNvbmUiLCJhIjoiY2sxZG4wNHpyMDVuejNjbXFubnQ1NmtpaiJ9.toy2lWcfSslnUZl_JcgTzQ"
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Basic Map": basicmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// function getColor(x) {
//   return x < 2 ? 'red' :
//         x < 4  ? 'orange' :
//         x < 6  ? 'yellow' :
//         x < 8  ? 'green' :
//         x < 10  ? 'blue' :
//                   'purple';
// }
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//   var div = L.DomUtil.create('div', 'info legend'),
//   scores = [0, 2, 4, 6, 8, 10],
//   labels = [];

//     for (var i = 0; i < scores.length; i++) {
//       div.innerHTML +=
//       '<i style="background:' + getColor(scores[i]) + '"> ' +
//         scores[i] + (scores[i + 1] ? '&ndash;' + scores[i + 1] + '</i><br>' : '+');
//   }

// return div;
// };
// legend.addTo(myMap);
// }

