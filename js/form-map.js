require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "dojo/dom-construct",
  "dojo/dom",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/lang",
  "dijit/registry",
  "dijit/form/Button",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dijit/form/TextBox",
  "dojo/domReady!"
],
function(Map, FeatureTable) {

  var map = new Map("map", {
    center: [-73.75, 44],
    zoom: 7,
    basemap: "topo-vector"
  });

  map.on("load", loadTable);

  function loadTable(){
    console.log("Map loaded, starting table.");

    // Create the feature layer
    var myFeatureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Warren_College_Trees/FeatureServer/0",
    {
      mode: FeatureLayer.MODE_ONDEMAND,
      visible: true,
      outFields: ["*"],
      id: "fLayer"
    });

    console.log("myFeatureLayer");

    map.addLayer(myFeatureLayer);

    myFeatureTable = new FeatureTable({
      featureLayer : myFeatureLayer,
      outFields:  ["*"],
      map : map
    }, 'footer');

    myFeatureTable.startup();

    on(myFeatureTable, "load", function(evt){
      console.log("The load event - ", evt);
    });
  };
});
