let map = L.map('map').setView([30, 15], 2)
// map.fitWorld();
//baselayer
let baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
baseLayer.addTo(map);
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data &copy; OpenStreetMap contributors';
// var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});
var osm2 = new L.TileLayer(osmUrl, {
  minZoom: 0,
  maxZoom: 13,
  attribution: osmAttrib
});
let testData = {
  max: 8,
  data: []
};




var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 2,
  "maxOpacity": .5,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',

  // gradient: {
  //   // enter n keys between 0 and 1 here
  //   // for gradient color customization
  //   '.25': '#adf479',
  //   '.5': 'green',
  //   '.75': 'yellow',
  //   '.95': 'red'
  // },
  // which field name in your data represents the data value - default "value"
  valueField: 'value'
};


var heatmapLayer = new HeatmapOverlay(cfg);
heatmapLayer.addTo(map);

window.setInterval(function () {
  /// call your function here
  // console.log("loaded agian");
  document.getElementById('spinner').className = "show";
  getCustomData();

}, 5000);



function getCustomData() {
  let baseUrl = "https://opensky-network.org/api/states/all";
  let url = `${baseUrl}`;
  $.ajax({
    url: url,
    success: function (data) {
      var res = convertToGeoJSON(data);
      heatmapLayer.setData(testData);
      document.getElementById('spinner').className = "hide";
    }
  })

  function convertToGeoJSON(input) {
    //convert input to Object, if it is of type string
    //empty the existing array
    testData.data = [];
    if (typeof (input) == "string") {
      input = JSON.parse(input);
    }
    for (var i = 0; i < input.states.length; i++) {
      var ele = input.states[i];
      // debugger;
      testData.data.push({
        lat: ele[6],
        lng: ele[5],
        value: 1
      })
    }
    return testData;
  }
}
var miniMap = new L.Control.MiniMap(osm2).addTo(map);

// document.getElementById("color").style.backgroundImage = 'linear-gradient(#000000, #ffffff)'


// Element.prototype.setGradient = function( fromColor, toColor ){

//   var canvas = document.createElement('canvas');
//   var ctx    = canvas.getContext('2d');
//   var b      = this.getBoundingClientRect();
//   var grd    = ctx.createLinearGradient(0, 0, b.width, 0);

//   canvas.width = b.width;
//   canvas.height = b.height;

//   grd.addColorStop(0, fromColor);
//   grd.addColorStop(1, toColor);

//   ctx.fillStyle = grd;
//   ctx.fillRect(0, 0, b.width, b.height);

//   this.style.backgroundImage = 'url('+canvas.toDataURL()+')';
// }
// document.getElementById('color').setGradient('#ff0000', '#00ff00');