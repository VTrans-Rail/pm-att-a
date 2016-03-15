require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "dojo/domReady!"
],
function(Map, FeatureLayer, FeatureTable) {

  var map = new Map("map", {
    center: [-73.75, 44],
    zoom: 7,
    basemap: "topo-vector"
  });

  map.on("load", loadTable);

  function loadTable(){
    // Create the feature layer
    var myFeatureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Warren_College_Trees/FeatureServer/0",
    {
      mode: FeatureLayer.MODE_ONDEMAND,
      visible: true,
      outFields: ["*"],
      id: "fLayer"
    });

    myFeatureTable = new FeatureTable({
      featureLayer : myFeatureLayer,
      outFields:  ["Collected","Crew","Status","Spp_Code", "Height", "Cmn_Name","Sci_Name","Street","Native"],
      map : map
    }, 'footer');

    myFeatureTable.startup();
  };
});

function showTable(){
  document.getElementById('footer').style.display = "block";
  document.getElementById('map').style.height = "50%";
};
