require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "esri/tasks/query",
  "dojo/domReady!"
],
function(Map, FeatureLayer, FeatureTable, MLAQuery) {

  var map = new Map("map", {
    center: [-73.75, 44],
    zoom: 7,
    basemap: "topo-vector"
  });

  // map.on("load", loadTable);

  // add listener for license holder search
  var LH_SearchBox = document.getElementById("LicenseHolder");
  console.log(LH_SearchBox)
  LH_SearchBox.addEventListener("change",loadTable);

  function loadTable(){
    // make map halfsize and display footer
    document.getElementById('footer').style.display = "block";
    document.getElementById('map').style.height = "50%";

    // Create the feature layer
    var MLAFeatureLayer = new FeatureLayer("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/dev_Attachment_A/FeatureServer/1",
    {
      mode: FeatureLayer.MODE_ONDEMAND,
      visible: false,
      outFields: ["AgreementNumber","LicenseHolder", "LH_Type","LH_Address","LH_City","LH_State","LH_Zip","Remarks"],
      id: "MLAtable"
    });

    var OccupationsFeatureLayer = new FeatureLayer("http://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/dev_Attachment_A/FeatureServer/0",
      {
        mode: FeatureLayer.MODE_AUTO,
        outFields: ["FromMP","ToMP","VAL_Parcel","VAL_STA","Town","OccupationType","OccupationElevation","OccupationHWYROW","OccupationCoID","WireType","WireSize","PipeType","PipeSize","PipePressurized","PipeDepth","PoleCount","AnchorCount","GuyCount","BracePoleCount","ManholeCount","VaultCount","PedCount","Fee","Remarks"],
        id: "AttAFC"
      });

    OccupationsTable = new FeatureTable({
      featureLayer : OccupationsFeatureLayer,
      outFields: ["FromMP","ToMP","VAL_Parcel","VAL_STA","Town","OccupationType","OccupationElevation","OccupationHWYROW","OccupationCoID","WireType","WireSize","PipeType","PipeSize","PipePressurized","PipeDepth","PoleCount","AnchorCount","GuyCount","BracePoleCount","ManholeCount","VaultCount","PedCount","Fee","Remarks"],
      map : map
    }, 'footer');

    OccupationsTable.startup();
  };

  // function MLAQuery(LH_Name){
  //
  // }
});

// function showTable(){
//   document.getElementById('footer').style.display = "block";
//   document.getElementById('map').style.height = "50%";
// };
