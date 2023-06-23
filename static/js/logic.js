// Create the map centered on a specific location
var map = L.map("map").setView([0, 0], 2);

// Add the tile layer for the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 18,
}).addTo(map);

// Fetch the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  // Loop through each earthquake feature and create a marker
  data.features.forEach(function (feature) {
    var mag = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];

    // Define the marker options based on magnitude and depth
    var markerOptions = {
      radius: mag * 2, // Adjust the size of the marker based on magnitude
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    // Create the marker and bind a popup with additional information
    var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions)
      .bindPopup(
        "<strong>Magnitude:</strong> " +
          mag +
          "<br/><strong>Depth:</strong> " +
          depth +
          " km"
      )
      .addTo(map);
  });

  // Define the legend control
  var legend = L.control({ position: "bottomright" });

  // Function to generate the legend HTML content
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [0, 10, 30, 50, 70, 90];
    var labels = [];

    // Loop through the depth ranges and create the legend labels
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(depths[i] + 1) +
        '"></i> ' +
        depths[i] +
        (depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km");
    }

    return div;
  };

  // Add the legend control to the map
  legend.addTo(map);

  // Function to determine the color based on depth
  function getColor(depth) {
    // Customize the color scheme based on your preference
    return depth > 90
      ? "#FF0000"
      : depth > 70
      ? "#FF4500"
      : depth > 50
      ? "#FF8C00"
      : depth > 30
      ? "#FFA500"
      : depth > 10
      ? "#FFD700"
      : "#FFFF00";
  }
});
