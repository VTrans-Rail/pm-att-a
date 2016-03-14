require(["esri/map", "dojo/domReady!"], function(Map) {
  var map = new Map("map", {
    center: [-73.75, 44],
    zoom: 7,
    basemap: "topo-vector"
  });
});
