var map;

require([
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "esri/geometry/webMercatorUtils",
  "esri/map",
  "dojo/dom-construct",
  "dojo/dom",
  "dojo/parser",
  "dojo/ready",
  "dojo/on",
  "dojo/_base/lang",
  "dijit/registry",
  "dijit/form/Button",
  "dijit/layout/ContentPane",
  "dijit/layout/BorderContainer",
  "dijit/form/TextBox"
], function (
  FeatureLayer, FeatureTable, webMercatorUtils, Map,
  domConstruct, dom, parser, ready, on,lang,
  registry, Button, ContentPane, BorderContainer, TextBox
) {
  parser.parse();

  ready(function(){

    var myFeatureLayer;
    var map = new Map("map",{
      basemap: "dark-gray"
    });

    map.on("load", loadTable);

    function loadTable(){

      // Create the feature layer
      myFeatureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Warren_College_Trees/FeatureServer/0", {
        mode: FeatureLayer.MODE_ONDEMAND,
        visible: true,
        outFields: ["*"],
        id: "fLayer"
      });

      //set map extent
      on(myFeatureLayer, "load", function(evt){
        var extent = myFeatureLayer.fullExtent;
        if (webMercatorUtils.canProject(extent, map)) {
          map.setExtent( webMercatorUtils.project(extent, map) );
        }
      });

      map.addLayer(myFeatureLayer);

      myFeatureTable = new FeatureTable({
        "featureLayer" : myFeatureLayer,
        "outFields":  ["Collected","Crew","Status","Spp_Code", "Height", "Cmn_Name","Sci_Name","Street","Native"],
        "map" : map
      }, 'myTableNode');

      myFeatureTable.startup();

      on(myFeatureTable, "load", function(evt){
        console.log("The load event - ", evt);
      });

      myFeatureTable.on("show-statistics", function(evt){
        console.log("show-statistics avgfield - ", evt.statistics.avgField);
        console.log("show-statistics countfield - ", evt.statistics.countField);
        console.log("show-statistics maxfield - ", evt.statistics.maxField);
        console.log("show-statistics minfield - ", evt.statistics.minField);
        console.log("show-statistics stddevfield - ", evt.statistics.stddevField);
        console.log("show-statistics sumfield - ", evt.statistics.sumField)
      });

      myFeatureTable.on("row-select", function(evt){
        console.log("select event - ", evt[0].data);
      });

      myFeatureTable.on("row-deselect", function(evt){
        console.log("deselect event - ", evt[0].data);
      });

      myFeatureTable.on("refresh", function(evt){
        console.log("refresh event - ", evt);
      });

      myFeatureTable.on("column-resize", function(evt){
        //triggered by ColumnResizer extension
        console.log("column-resize event- ", evt);
      });

      myFeatureTable.on("column-state-change", function(evt){
        // triggered by ColumnHider extension
        console.log("column-state-change event - ", evt);
      });

      myFeatureTable.on("sort", function(evt){
        console.log("sort event - ", evt);
      });

      myFeatureTable.on("filter", function(evt){
        console.log("filter event - ", evt);
      });
    }
  });
});
