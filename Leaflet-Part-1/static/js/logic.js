// Create initial map object
var myMap = L.map("map", {
  center: [33.02577301700473, -96.84155426096407],
  zoom: 5
});

// create a tile layer 
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 18,
  id: "mapbox/light-v11",
  accessToken: api_key
}).addTo(myMap);

// get circle color for each magnitude 
function getColor(magnitude){
  switch(true){
      case (magnitude <= 5):
          return '#ea2c2c'; 
          break;
      case (magnitude <= 4):
          return '#ea822c';  
          break;
      case (magnitude <= 3):
          return '#ee9c00';  
          break;
      case (magnitude <= 2):
          return '#eecc00';  
          break;
      case (magnitude <= 1):
          return '#d4ee00';  
          break;
      default:
          return '#98ee00';  
          break;
  }
}

// set radius of the magnitude
function getRadius(magnitude){
  switch(true){
      case (magnitude <= 1):
          return 5;
          break;
      case (magnitude <= 2):
          return 7;
          break;
      case (magnitude <= 3):
          return 9;
          break;
      case (magnitude <= 4):
          return 11;
          break;
      case (magnitude <= 5):
          return 13;
          break;
      case (magnitude > 5):
          return 15;
          break;
      default:
          return 1;
          break;
  }
}  

// past 7 days 
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

// past 30 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(queryUrl).then(function(data){

  L.geoJson(data,{
      pointToLayer: function (feature, latlng) {
          // Create a circle marker
          return L.circleMarker(latlng, {
              radius: getRadius(feature.properties.mag), 
              fillColor: getColor(feature.properties.mag), 
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
          });
      },
      onEachFeature: function(feature, layer){
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
      }
  }).addTo(myMap);
  
 // Create a legend
 var legend = L.control({position: 'bottomright'});
 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create('div', 'info legend'),
         mag = [0, 1, 2, 3, 4, 5]
    
     div.innerHTML += "<h4>Magnitude Level</h4><hr>"
     // loop through
     for (var i = 0; i < mag.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
             mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
     }
     return div;
 };
 legend.addTo(myMap);  
  

});
