// ----------------------------------------------------------------------------
// ----------------This is the form-map.js (main javascript file) for the
// form.html It is essential for loading the map and the layers of the map.
// It also defines the behavior of the sidebar and table.----------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/dom",
    "dojo/on",
    "esri/dijit/Search",
    "esri/graphic",
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
    Search,
    Graphic
  ) {

    //----------------------------------------------------------------------------
    // Setup the basic map
    //----------------------------------------------------------------------------

    var map = new Map("map", {
      center: [-73.75, 44],
      zoom: 7,
      basemap: "topo-vector"
    });

    //----------------------------------------------------------------------------
    // Create feature layers
    //----------------------------------------------------------------------------

    // MLA feature layer
    var MLAURL = "https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/1";
    var MLAFeatureLayer = new FeatureLayer(MLAURL, {
      mode: FeatureLayer.MODE_ONDEMAND,
      visible: false,
      outFields: ["AgreementNumber", "LicenseHolder", "LH_Type", "LH_Address",
        "LH_City", "LH_State", "LH_Zip", "Remarks"
      ],
      id: "MLAtable"
    });

    // ATT A occupations feature layer
    var OccupationsFeatureLayer = new FeatureLayer("https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/0", {
      mode: FeatureLayer.MODE_AUTO,
      outFields: ["FromMP", "ToMP", "VAL_Parcel", "VAL_STA", "Town", "OccupationType",
        "OccupationElevation", "OccupationHWYROW", "OccupationCoID", "WireType", "WireSize",
        "PipeType", "PipeSize", "PipePressurized", "PipeDepth", "PoleCount", "AnchorCount",
        "GuyCount", "BracePoleCount", "ManholeCount", "VaultCount", "PedCount", "Fee", "Remarks"
      ],
      id: "AttAFC"
    });

    //----------------------------------------------------------------------------
    // Setup License Holder text search box
    //----------------------------------------------------------------------------

    var search = new Search({
      sources: [{
        featureLayer: MLAFeatureLayer,
        outFields: ["*"],
        displayField: "LicenseHolder",
        suggestionTemplate: "${LicenseHolder}: (${AgreementNumber})",
        name: "License Holders",
        placeholder: "example: Amtrak",
      }],
    }, "LicenseHolder");

    search.startup();

    //----------------------------------------------------------------------------
    // When search results are returned, populate the form field values.
    // Add ability to clear all of the boxes
    //----------------------------------------------------------------------------

    // Returned OBJECTID variable. Needs to be outside function(e) so it can be reused
    var resultsOID;

    // Populate the form fields:
    on(search, "search-results", function(e) {
      document.getElementById("LicenseHolder_input").value = "";
      resultsOID = e.results[0][0].feature.attributes['OBJECTID'];
      console.log(resultsOID);
      dom.byId('LicenseHolder_input').value = e.results[0][0].feature.attributes['LicenseHolder'];
      dom.byId('AgreementNumber').value = e.results[0][0].feature.attributes['AgreementNumber'];
      dom.byId('LicenseType').value = e.results[0][0].feature.attributes['LicenseType'];
      dom.byId('LH_Type').value = e.results[0][0].feature.attributes['LH_Type'];
      dom.byId('LH_Address').value = e.results[0][0].feature.attributes['LH_Address'];
      dom.byId('LH_City').value = e.results[0][0].feature.attributes['LH_City'];
      dom.byId('LH_State').value = e.results[0][0].feature.attributes['LH_State'];
      dom.byId('LH_Zip').value = e.results[0][0].feature.attributes['LH_Zip'];
      dom.byId('Remarks').value = e.results[0][0].feature.attributes['Remarks'];
    });

    // add listener for clear search box X
    var searchClear = document.getElementsByClassName("searchClear");
    searchClear[0].addEventListener("click", clear);

    function clear() {
      document.getElementById("LicenseHolder_input").value = "";
      document.getElementById('AgreementNumber').value = "";
      document.getElementById('LicenseType').value = "";
      document.getElementById('LH_Type').value = "";
      document.getElementById('LH_Address').value = "";
      document.getElementById('LH_City').value = "";
      document.getElementById('LH_State').value = "";
      document.getElementById('LH_Zip').value = "";
      document.getElementById('Remarks').value = "";
    }
    //----------------------------------------------------------------------------
    // don't think this is needed right now. comment out to check
    // // add QueryTask
    //
    // var MLAqueryTask = new QueryTask(MLAURL);
    //
    // var MLAquery = new Query();
    //   MLAquery.outFields = ["AgreementNumber","LicenseHolder", "LH_Type","LH_Address","LH_City","LH_State","LH_Zip","Remarks"];
    //
    // // on(document.getElementById("execute"), "click", execute);
    //
    // function execute() {
    //   MLAquery.where = "LicenseHolder LIKE '%" + dom.byId("LicenseHolder").value + "%'";
    //   MLAqueryTask.execute(MLAquery, showResults);
    // };
    //
    // function showResults (results) {
    //   var resultItems = [];
    //   var resultCount = results.features.length;
    //   for (var i = 0; i < resultCount; i++) {
    //     var featureAttributes = results.features[i].attributes;
    //     for (var attr in featureAttributes) {
    //       console.log(featureAttributes[attr]);
    //     }
    //   }
    // };


    //----------------------------------------------------------------------------
    // Create the feature table at the bottom of the map
    //----------------------------------------------------------------------------

    function loadTable() {
      // make map halfsize and display footer
      document.getElementById('footer').style.display = "block";
      document.getElementById('map').style.height = "50%";

      OccupationsTable = new FeatureTable({
        featureLayer: OccupationsFeatureLayer,
        outFields: ["FromMP", "ToMP", "VAL_Parcel", "VAL_STA", "Town", "OccupationType", "OccupationElevation", "OccupationHWYROW", "OccupationCoID", "WireType", "WireSize", "PipeType", "PipeSize", "PipePressurized", "PipeDepth", "PoleCount", "AnchorCount", "GuyCount", "BracePoleCount", "ManholeCount", "VaultCount", "PedCount", "Fee", "Remarks"],
        map: map
      }, 'footer');

      OccupationsTable.startup();
    };

    //----------------------------------------------------------------------------
    // Setup MLA form button actions
    //----------------------------------------------------------------------------

    // variables
    var updateFeaturesURL = 'http://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/1/updateFeatures?f=json&features=';
    var addFeaturesURL = 'http://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/dev_Attachment_A/FeatureServer/1/addFeatures?f=json&features=';

    var formData = [];
    var kind = "";

    // add listener for update button
    var update = document.getElementById('updateMLA');
    update.addEventListener("click", updateMLA);

    // add listener for add new button
    var newMLA = document.getElementById('newMLA');
    newMLA.addEventListener("click", addMLA);

    // function for Update button
    function updateMLA() {
      getAttributes("update");
      updateFeaturesURL += formData;
      console.log(formData);
      // $.post(updateFeaturesURL);
    };

    // function for Add New button
    function addMLA() {
      getAttributes("add");
      addFeaturesURL += formData;
      console.log(formData);
      // $.post(addFeaturesURL);
    };

    // Grab the attributes and build a JSON string that will be passed to the Update and Add functions
    function getAttributes(kind) {
      formData = "";
      console.log(kind);
      formData += '{"attributes": {';
      if (kind == "update") {
        formData += "'OBJECTID' : " + resultsOID + ","
      }
      formData += "'LicenseHolder': '" + document.getElementById('LicenseHolder_input').value + "',";
      formData += "'AgreementNumber': '" + document.getElementById('AgreementNumber').value + "',";
      formData += "'LicenseType': '" + document.getElementById('LicenseType').value + "',";
      formData += "'LH_Type': '" + document.getElementById('LH_Type').value + "',";
      formData += "'LH_Address': '" + document.getElementById('LH_Address').value + "',";
      formData += "'LH_City': '" + document.getElementById('LH_City').value + "',";
      formData += "'LH_State': '" + document.getElementById('LH_State').value + "',";
      formData += "'LH_Zip': '" + document.getElementById('LH_Zip').value + "',";
      formData += "'Remarks': '" + document.getElementById('Remarks').value + "'";
      formData += "}}"
    }
  });
