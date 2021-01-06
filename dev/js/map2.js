	
    ICON_SIZE_fav       = 90;
    wareSizeClass_fav    = "";
    zoom_map_fav         = 4.7;
    divResultsFHD_fav    = "";
    boxPieChartFHD_fav   = "";
    clickOptimizeFHD_fav = "";
    mapLineweight_fav    = 3;	
	cockroach_fav = 3;
	
///////////////////////////////////////////////////////////////
///////////////////// CREATE THE MAP //////////////////////////
///////////////////////////////////////////////////////////////

	var map2 = L.map('map2', {    // Positions the map by latitude and longitude
        center: [35.75, 43.8],
        zoomSnap: 0.1,

        zoom: 8.5,
        zoomDelta: 0.1,
        zoomControl: false
			
		});
		
    map2.doubleClickZoom.disable();
    
	geojson = L.geoJson(iraq, {
        style: styleIraq,
    }).addTo(map2)
	
// add an OpenStreetMap tile layer
var mapDark_fav =  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

	id: 'mapbox/dark-v9',

})

var mapStreets_fav = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    id: 'mapbox.streets',
})

map2.addLayer(mapDark_fav);

map2.on('zoomend', function(event) {
    map.setZoom(event.target._zoom + 5 - 4.7);
	
});

map2.on('moveend', function(event) {
   if(flag_center == ""){
		flag_center = "map2";
		map.setView(map2.getCenter());
   }else{
		flag_center = "";
   }
});



////////////////////////////////////////////////IRAQ ICONS///////////////////////////////////////

cidade.forEach(function (e, i) {
    cidade[i][5] = L.marker([e[2], e[3]], {
        icon: L.divIcon({
            iconSize: new L.Point(130),
            iconAnchor: new L.Point(-1, 50),
            html: ` <div id = 'map2Icon${e[0]}' class = 'cidadeCirculo2'><i class="fas fa-circle"></i></div>

            <div id = 'wareSizeFAV${e[0]}' class = 'wareSize waresizeAparece' >
            <i class="fas fa-square"></i></div>
            </div>
                    <div class = 'cidadeCirculo'><i class="far fa-square"></i></div>
                    <div id = 'map2Icon2${e[0]}'  class = 'cidadeIcon' onmouseover = "destacaIcon('${e[0]}','---')" onmouseout =  "destacaIcon2('${e[0]}')">
                    <i class="fas fa-city"></i></div>`,
            className: `divCidade`
        })

    }).addTo(map2)
})

campo.forEach(function (e, i) {
    //L.marker([e[2], e[3]]).addTo(map)
    if(aA.indexOf(i) != -1){
        x = "agencyA"
    }else if(aB.indexOf(i)!= -1){
        x = "agencyB"
    }else{
        x = "agencyC"
    }
    campo[i][5] = L.marker([e[2], e[3]], {
        icon: L.divIcon({
            iconSize: new L.Point(130),
            iconAnchor: new L.Point(-1, 50),
            html: ` <div id = 'map2Icon${e[0]}' class = 'campoCirculo2  ${x}'><i class="fas fa-circle"></i></div>

            <div id = 'wareSizeFAV${e[0]}' class = 'wareSize waresizeAparece' >
            <i class="fas fa-circle"></i></div>
            </div>
                    <div class = 'campoCirculo'><i class="far fa-circle"></i></div>
                    <div id = 'map2Icon2${e[0]}'  class = 'campoIcon' onmouseover = "destacaIcon('${e[0]}','${e[4]}')" onmouseout =  "destacaIcon2('${e[0]}')">
                    <i class="fas fa-users"></i></div>`,
            className: `divCampo`
        })

    }).addTo(map2)
})

ponto.forEach(function (e, i) {
    ponto[i][5] = L.marker([e[2], e[3]], {
        icon: L.divIcon({
            iconSize: new L.Point(130),
            iconAnchor: new L.Point(-1, 50),
            html: `<i class="ponto fas fa-circle"></i>`,
            className: `divPonto`
        })

    }).addTo(map2)
})


arco.forEach(function (e, i) {
origem = e[0]
destino = e[1]
//console.log(origem[2])
L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { color: 'black', fill: true }).addTo(map2);
})




/////////////////////////////////////////////////////////////////////////////////////////////////


var mapTitle2 = L.control({position: 'topright'});

    mapTitle2.onAdd = function (map2) {
    this._div = L.DomUtil.create('div', 'mapTitle'); // create a div with a class "info"
    this.update();
    return this._div;
};	


mapTitle2.update = function (props) {
    this._div.innerHTML =   '<div class = "textOnMap" style = "color: rgb(255, 255, 0)">'+
								'<h1><b>Scenario <span id = "titleSce2"></span></b><br>'+
								'<i class="fas fa-dollar-sign"></i> / <i class="fas fa-shipping-fast"></i>: <span id = "mapTitle_W2"></span>'+
							'</h1></div>';

};

mapTitle2.addTo(map2);

	
