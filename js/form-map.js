require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dojo/dom",
  "dojo/on",
  "esri/dijit/Search",
  "dojo/domReady!"
],
function(
  Map,
  FeatureLayer,
  FeatureTable,
  Query,
  QueryTask,
  dom,
  on,
  Search
){

// Setup basic map
  var map = new Map("map", {
    center: [-73.75, 44],
    zoom: 7,
    basemap: "topo-vector"
  });

  // Create the feature layers

  // MLA feature layer
  var MLAURL = "http://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/1";
  var MLAFeatureLayer = new FeatureLayer(MLAURL,
  {
    mode: FeatureLayer.MODE_ONDEMAND,
    visible: false,
    outFields: ["AgreementNumber","LicenseHolder", "LH_Type","LH_Address",
    "LH_City","LH_State","LH_Zip","Remarks"],
    id: "MLAtable"
  });

  // ATT A occupations feature layer
  var OccupationsFeatureLayer = new FeatureLayer("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/0",
  {
    mode: FeatureLayer.MODE_AUTO,
    outFields: ["FromMP","ToMP","VAL_Parcel","VAL_STA","Town","OccupationType",
    "OccupationElevation","OccupationHWYROW","OccupationCoID","WireType","WireSize",
    "PipeType","PipeSize","PipePressurized","PipeDepth","PoleCount","AnchorCount",
    "GuyCount","BracePoleCount","ManholeCount","VaultCount","PedCount","Fee","Remarks"],
    id: "AttAFC"
  });

  // add listener for license holder search
  var LH_SearchBox = document.getElementById("LicenseHolder");
  // LH_SearchBox.addEventListener("change",execute);


  // Make License Holder text box a search box

  var search = new Search({
    sources: [{
      featureLayer: MLAFeatureLayer,
      outFields: ["LicenseHolder","AgreementNumber"],
      displayField: "LicenseHolder",
      suggestionTemplate: "${LicenseHolder}: (${AgreementNumber})",
      name: "License Holders",
      placeholder: "example: Amtrak",
      enableSuggestions: true
  }],
    
  }, "LicenseHolder");

  search.startup();

  // add QueryTask

  var MLAqueryTask = new QueryTask(MLAURL);

  var MLAquery = new Query();
    MLAquery.outFields = ["AgreementNumber","LicenseHolder", "LH_Type","LH_Address","LH_City","LH_State","LH_Zip","Remarks"];

  on(dom.byId("execute"), "click", execute);

  function execute() {
    LH_Value = dom.byId("LicenseHolder").value;
    console.log(LH_Value);
    MLAquery.where = "LicenseHolder LIKE '%" + dom.byId("LicenseHolder").value + "%'";
    console.log(MLAquery.where);
    MLAqueryTask.execute(MLAquery, showResults);
  };

  function showResults (results) {
    var resultItems = [];
    var resultCount = results.features.length;
    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;
      for (var attr in featureAttributes) {
        console.log(featureAttributes[attr]);
      }
    }
  };

  // Show table at the bottom half of the map div
  function loadTable(){
    // make map halfsize and display footer
    document.getElementById('footer').style.display = "block";
    document.getElementById('map').style.height = "50%";

    OccupationsTable = new FeatureTable({
      featureLayer : OccupationsFeatureLayer,
      outFields: ["FromMP","ToMP","VAL_Parcel","VAL_STA","Town","OccupationType","OccupationElevation","OccupationHWYROW","OccupationCoID","WireType","WireSize","PipeType","PipeSize","PipePressurized","PipeDepth","PoleCount","AnchorCount","GuyCount","BracePoleCount","ManholeCount","VaultCount","PedCount","Fee","Remarks"],
      map : map
    }, 'footer');

    OccupationsTable.startup();
  };

  function MLAQuery(LH_Name){

  };
});
