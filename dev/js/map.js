/////////////////////////////////////////////////////////////////

ID_CONSTANT = 60000;
BLOCK_USER  = 0;
var coords = [];

// Global Options:
Chart.defaults.global.defaultFontColor = '#fff';
Chart.defaults.global.defaultFontSize = 16;

///////////////////////////////////////////////////////////////
///////////////  VARS FOR 4K AND FULL HD //////////////////////
///////////////////////////////////////////////////////////////


	
    ICON_SIZE        = 110;
    wareSizeClass    = "";
    zoom_map         = 9;
    divResultsFHD    = "";
    boxPieChartFHD   = "";
    clickOptimizeFHD = "";
    mapLineweight    = 3;	
	cockroach = 3;
	




///////////////////////////////////////////////////////////////
///////////////////// CREATE THE MAP //////////////////////////
///////////////////////////////////////////////////////////////



var map = L.map('map', {
	center: [35.75, 43.8],
	zoomSnap: 0.1,
	zoom: 8.9,
	zoomDelta: 0.1,
	zoomControl: false
});

geojson = L.geoJson(iraq, {
	style: styleIraq,
}).addTo(map)

function styleIraq(feature) {
	return {
		weight: 5,
		opacity: 1,
		color: '#000',
		fillColor: '#EADFCE',
		fillOpacity: 0.5,
	}
}
		
	map.doubleClickZoom.disable();
	
	



var mapStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	id: 'mapbox.streets',
})


var mapDark =  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

	id: 'mapbox/dark-v9',

})


map.addLayer(mapDark);


map.on('zoomend', function(event) {
    map2.setZoom(event.target._zoom - 5 + 4.7);
	
});

flag_center = "";

map.on('moveend', function(event) {
   if(flag_center == ""){
		flag_center = "map";
		map2.setView(map.getCenter());
   }else{
		flag_center = "";
   }
});
 


////////////////////////////////////////////////IRAQ ICONS///////////////////////////////////////

    const campo = []
        campo[0] = ["Narziglia", "MODM", 36.618981, 43.309526, '3158']
        campo[1] = ["Zelikan", "MODM", 36.488783, 43.514031, '266']
        campo[2] = ["Hasansham-U3", "UNHCR", 36.29206, 43.7345, '1936']
        campo[3] = ["Hasansham-M2", "MODM", 36.36927, 43.70412, '5953']
        campo[4] = ["Hasansham-M1", "MODM", 36.32807, 43.62371, '1560']
        campo[5] = ["Chamakor", "UNHCR", 36.25312, 43.52575, '2400']
        campo[6] = ["Hasansham-U2", "UNHCR", 36.17539, 43.60234, '7000']
        campo[7] = ["Debaga-2", "UNHCR", 35.90406, 43.82184, '1500']
        campo[8] = ["Debaga-1", "MODM", 35.86897, 43.92656, '2397']
        campo[9] = ["Debaga-Std", "UNHCR", 35.79546, 43.83048, '400']
        campo[10] = ["Hammam-al-Alil-1", "UNHCR", 36.10413083, 43.23802722, '4000']
        campo[11] = ["Hammam-al-Alil-2", "MODM", 36.16203389, 43.24697056, '4672']
        campo[12] = ["As-Salamyiah", "2: N.Gov&UNHCR", 36.153736, 43.320886, '6544']
        campo[13] = ["Qayyarah-Air", "IOM", 35.787337, 43.308476, '10000']
        campo[14] = ["Qayyarah-Jad-ah", "MODM", 35.742061, 43.265796, '15350']
        campo[15] = ["Haj-Ali", "IOM", 35.721975, 43.3320083, '7435']
        campo[16] = ["Laylan-1", "UNHCR", 35.32956667, 44.53015972, '949']
        campo[17] = ["Laylan-2", "MODM", 35.32956667, 44.45015972, '810']
        campo[18] = ["Al-Shamah-1", "UNDP", 34.8272554, 43.4583479, '415']
        campo[19] = ["Al-Alam-1", "2: MoMD&UNHCR", 34.82321, 43.60615, '1250']
        campo[20] = ["Al-Alam-2", "UNHCR", 34.898708, 43.578686, '500']
        campo[21] = ["Al-Alam-3", "MODM", 34.7387, 43.62263, '750']
        campo[22] = ["Al-Shamah-2", "MODM",	34.7327474, 43.4583479, '715']
        campo[23] = ["Qaymawa", "UNHCR", 36.40342, 43.54424, '1030']
 

    const cidade = []
        cidade[0] = ["Erbil", "", 36.20629, 44.00886, ""]
        cidade[1] = ["Dahuk", "", 36.8679, 42.94748, ""]
        cidade[2] = ["Tikrit", "", 34.61872, 43.65672, ""]
        cidade[3] = ["Kirkuk", "", 35.46557, 44.38039, ""]
        cidade[4] = ["Al-Hamdaniya", "", 36.17912, 43.40001, ""]

    const ponto = []
        ponto[0] = [,,34.77365, 43.53829]
        ponto[1] = [,,35.03648, 43.48082]
        ponto[2] = [,,35.38144, 44.16471]
        ponto[3] = [,,35.40159, 44.48606]
        ponto[4] = [,,35.486, 43.33114]
        ponto[5] = [,,35.77175, 43.89555]
        ponto[6] = [,,36.47387, 43.56936]
        ponto[7] = [,,35.85093, 43.86232]
        ponto[8] = [,,35.78077, 43.12211]
        ponto[9] = [,,35.92325, 43.40913]
        ponto[10] = [,,36.05659, 43.4911]
        ponto[11] = [,,36.11874, 43.10659]
        ponto[12] = [,,36.35094, 43.25351]
        ponto[13] = [,,36.32773, 43.68564]
        ponto[14] = [,,36.22581, 43.57029]
        ponto[15] = [,,36.27675, 43.64994]
        ponto[16] = [,,36.64035, 43.49556]
        ponto[17] = [,, 35.78809, 43.36956]       

       
        
    const arco = []
    arco[0] = [ponto[0], cidade[2],'black']
    arco[1] = [ponto[0], ponto[1],'black']
    arco[2] = [ponto[0], campo[22],'black']
    arco[3] = [ponto[0], campo[18],'black']
    arco[4] = [ponto[0], campo[20],'black']
    arco[5] = [ponto[0], campo[19],'black']
    arco[6] = [ponto[0], campo[21],'black']
    arco[7] = [cidade[2], ponto[2],'black']
    arco[8] = [cidade[3], ponto[2],'black']
    arco[9] = [ponto[3], ponto[2],'black']   
    arco[10] = [ponto[3], cidade[3],'black']   
    arco[11] = [ponto[3], campo[16],'black']  
    arco[12] = [ponto[3], campo[17],'black']  
    arco[13] = [ponto[2], ponto[1],'black']  
    arco[14] = [ponto[4], ponto[1],'black']  
    arco[15] = [ponto[2], ponto[5],'black']   
    arco[16] = [ponto[2], ponto[5],'black']  
    arco[17] = [ponto[17], ponto[7],'black']  
    arco[18] = [campo[23], ponto[6],'black']   
    arco[19] = [cidade[3], ponto[5],'black']  
    arco[20] = [campo[7], ponto[7],'black']   
    arco[21] = [campo[8], ponto[7],'black']     
    arco[22] = [campo[9], ponto[7],'black'] 
    arco[23] = [ponto[5], ponto[7],'black']         
    arco[24] = [ponto[4], ponto[8],'black']   
    arco[25] = [campo[13], ponto[8],'black']   
    arco[26] = [campo[14], ponto[8],'black'] 
    arco[27] = [campo[15], ponto[17],'black']  
    arco[28] = [ponto[8], ponto[9],'black'] 
    arco[29] = [ponto[10], ponto[9],'black']         
    arco[30] = [ponto[10], ponto[7],'black'] 
    arco[31] = [cidade[0], ponto[7],'black'] 
    arco[32] = [cidade[0], cidade[3],'black'] 
    arco[33] = [cidade[0], ponto[10],'black'] 
    arco[34] = [cidade[4], campo[12],'black'] 
    arco[35] = [ponto[11], ponto[9],'black'] 
    arco[36] = [ponto[11], campo[10],'black'] 
    arco[37] = [ponto[11], campo[11],'black'] 
    arco[38] = [ponto[11], ponto[12],'black'] 
    arco[39] = [cidade[4], ponto[12],'black'] 
    arco[40] = [cidade[1], ponto[12],'black'] 
    arco[41] = [cidade[1], campo[0],'black'] 
    arco[42] = [ponto[13], campo[2],'black'] 
    arco[43] = [ponto[13], campo[3],'black'] 
    arco[44] = [ponto[13], campo[4],'black'] 
    arco[45] = [ponto[14], campo[5],'black'] 
    arco[46] = [ponto[14], campo[6],'black'] 
    arco[47] = [ponto[14], ponto[15],'black'] 
    arco[48] = [ponto[14], cidade[4],'black'] 
    arco[49] = [ponto[15], ponto[13],'black'] 
    arco[50] = [ponto[15], ponto[12],'black'] 
    arco[51] = [ponto[10], cidade[4],'black'] 
    arco[52] = [campo[15], ponto[4],'black'] 
    arco[53] = [cidade[0], ponto[15],'black'] 
    arco[54] = [campo[1], ponto[6],'black']     
    arco[55] = [campo[0], ponto[12],'black']   
    arco[56] = [campo[0], ponto[16],'black'] 
    arco[57] = [cidade[0], ponto[16],'black'] 
    arco[58] = [ponto[6], ponto[16],'black'] 
    arco[59] = [ponto[6], ponto[13],'black'] 
    arco[60] = [ponto[6], ponto[12],'black'] 
    arco[61] = [ponto[17], ponto[9],'black'] 


    cidade.forEach(function (e, i) {
      //  L.marker([e[2], e[3]]).addTo(map)
        cidade[i][5] = L.marker([e[2], e[3]], {
            icon: L.divIcon({
                iconSize: new L.Point(130),
                iconAnchor: new L.Point(-1, 50),
                //` <div class = 'cidadeName'>${e[0]}</div>
				html: ` <div id = 'mapIcon${e[0]}' class = 'cidadeCirculo2' >
							<i class="fas fa-square"></i>
						</div>

						<div id = 'wareSize${e[0]}' class = 'wareSize waresizeAparece' >
							<i class="fas fa-circle"></i></div>
						</div>

						<div class = 'cidadeCirculo'>
							<i class="far fa-square"></i>
						</div>

						<div id = 'mapIcon2${e[0]}'  class = 'cidadeIcon' onmouseover = "destacaIcon('${e[0]}','---')" onmouseout =  "destacaIcon2('${e[0]}')">
						<i class="fas fa-city"></i></div>`,
                className: `divCidade`
            })

        }).addTo(map)
	})
	aA = [1,2,4,5,7, 19,10,17]
	aB = [8,14,11, 21,18]
	aC = [13,9,15,16,20,22,23,3, 12, 0, 6]
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
				html: ` <div id = 'mapIcon${e[0]}' class = 'campoCirculo2 ${x}'>
							<i class="fas fa-circle" ></i>
						</div>

						<div id = 'wareSize${e[0]}' class = 'wareSize waresizeAparece' >
						<i class="fas fa-circle"></i></div>
						</div>

						<div class = 'campoCirculo'>
							<i class="far fa-circle"></i>
						</div>

						<div id = 'mapIcon2${e[0]}'  class = 'campoIcon' onmouseover = "destacaIcon('${e[0]}','${e[4]}')" onmouseout =  "destacaIcon2('${e[0]}')">
						<i class="fas fa-users"></i></div>`,
                className: `divCampo`
            })

        }).addTo(map)
    })

    ponto.forEach(function (e, i) {
        //L.marker([e[2], e[3]]).addTo(map)
        ponto[i][5] = L.marker([e[2], e[3]], {
            icon: L.divIcon({
                iconSize: new L.Point(130),
                iconAnchor: new L.Point(-1, 50),
                html: `<i class="ponto fas fa-circle"></i>`,
                className: `divPonto`
            })

        }).addTo(map)
    })


    arco.forEach(function (e, i) {
        origem = e[0]
        destino = e[1]
        //console.log(origem[2])
        L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { color: e[2], fill: true }).addTo(map);
    })




/////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////
////////  ORDENA A LISTA DE ARMAZENS APÓS A OTIMIZAÇÃO ////////
///////////////////////////////////////////////////////////////

function order(d){
	    
	    var alpha = [];
	    var number = [];
	    
	    $('.listWare').each(function(){
	      
	      var alphaArr = [];
	      var numArr = [];
	      
	      alphaArr.push($(d, this).text());
	      alphaArr.push($(this));
	      alpha.push(alphaArr);
	      alpha.sort();
	      

	    })
	    

	      $('.listWare').remove();
	      for(var i=0; i<alpha.length; i++){
	        $('.wareLISTdiv').append(alpha[i][1]);
	      }

 
	  }

///////////////////////////////////////////////////////////////
//////////////////// Troca lado do menu    ////////////////
///////////////////////////////////////////////////////////////	  
	  
function menu(a){
	if(a == 1){
		document.getElementById('div-all').style.marginLeft = "100px";
		document.getElementById('div-all').style.marginRight  = "0px";		
		document.getElementById('menu-col').removeAttribute("style");
		document.getElementById('menu-col').style.left = "0px";
		document.getElementById('move-2').style.display = "none";
		document.getElementById('move-1').style.display = "block";
	}else{
		document.getElementById('div-all').style.marginRight  = "100px";
		document.getElementById('div-all').style.marginLeft = "0px";
		document.getElementById('menu-col').removeAttribute("style");
		document.getElementById('menu-col').style.right = "0px";
		document.getElementById('move-1').style.display = "none";
		document.getElementById('move-2').style.display = "block";		
	}
}	



///////////////////////////////////////////////////////////////
////////////////////   TABLE  DEMAND ON MAP    ////////////////
///////////////////////////////////////////////////////////////

var blockDemand = L.control({position: 'bottomright'});

    blockDemand.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'divDemand'); // create a div with a class "info"
    this.update();
    return this._div;
};

var mapTitle = L.control({position: 'topright'});

    mapTitle.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'mapTitle'); // create a div with a class "info"
    this.update();
    return this._div;
};	


mapTitle.update = function (props) {
    this._div.innerHTML =   '<div class = "textOnMap" style = "color:#9f86ff">'+
								'<h1><b>Scenario <span id = "titleSce"></span></b><br>'+
								'<i class="fas fa-dollar-sign"></i> / <i class="fas fa-shipping-fast"></i>: <span id = "mapTitle_W"></span>'+
							'</h1></div>';

};

mapTitle.addTo(map);




// method that we will use to update the control based on feature properties passed
blockDemand.update = function (props) {
    this._div.innerHTML =   '<div class = "demand textOnMap mapTitle" id = \'divTableDemand\'></div>';
};

blockDemand.addTo(map);





///////////////////////////////////////////////////////////////
////////////////////    VALUE FUNCTIONS       ////////////////
///////////////////////////////////////////////////////////////


dataChartCost = [{x: 0,y: 100}, {x: 1.25,y: 75.025}, {x: 2.50,y: 50.05}, {x: 3.75,y: 25.075},{x: 5.00,y: 0}];
dataChartOthers = [{x: 0,y: 100}, {x: 0.75,y: 75.025}, {x: 1.50,y: 50.05}, {x: 2.25,y: 25.075},{x: 3.00,y: 0}];
 dataChartSLKA = [{x: 0,y: 100}, {x: 1.25,y: 75.025}, {x: 2.50,y: 50.05}, {x: 3.75,y: 25.075},{x: 5.00,y: 0}];

function createChartCost(){
	

	var ctxCOST = document.getElementById('chartCost').getContext('2d');
	
	var chartCOST = new Chart(ctxCOST, {

		type: 'scatter',

		data: {
			datasets: [{
			 	data: dataChartCost,
				lineTension:0,
				borderWidth: 1,
				borderColor: '#fff',
				backgroundColor: 'transparent' 
			}]        
		},

		options: {
		responsive: false,
		scales: {
			xAxes: [{type: 'linear',scaleLabel: {
							display: true,
							labelString: 'Million $',
							fontSize:8
			},ticks:{fontSize:8,min:0, stepSize: 1}}],  
			yAxes:[{type: 'linear',scaleLabel: {
							display: false,
							labelString: 'Value',
							fontSize:8
			},ticks:{fontSize:8,}}],  
		},
		title:{
			display: false,
			fontSize:8,
			text: "Cost",
		},
		animation:{
			duration: 1,
		},
		legend: {
			display: false,
		},
			tooltips: {
				bodyFontSize: 8,
				titleFontSize: 8,
			}
	}
	});
}
	
function createChartSLKA(){
	

	var ctxSLKA = document.getElementById('chartSL-KA').getContext('2d');

	var chartSLKA = new Chart(ctxSLKA, {

    type: 'scatter',

    data: {
        datasets: [{
            data: dataChartSLKA,
            lineTension:0,
            borderWidth: 1,
            borderColor: '#fff',
            backgroundColor: 'transparent' 
        }]        
    },

	options: {
		responsive: false,
		scales: {
			xAxes: [{type: 'linear',scaleLabel: {
							display: true,
							labelString: '',
							fontSize:8
							
			},ticks:{fontSize:8,max: 5.00, stepSize: 1}}],  
			yAxes:[{type: 'linear',scaleLabel: {
							display: false,
							labelString: 'Value',
							fontSize:8
			},ticks:{fontSize:8,}}],  

		},
		title:{
			display: false,
			fontSize:8,
			text: "SL Key Accounts",
		},
		animation:{
			duration: 1,
		},
		legend: {
			display: false,
		},
		tooltips: {
			bodyFontSize: 8,
			titleFontSize: 8,
		}
	}
});
}
function createChartOthers(){

	var ctxSLOTHERS = document.getElementById('chartSL-OTHERS').getContext('2d');

var chartSLOTHERS = new Chart(ctxSLOTHERS, {

    type: 'scatter',

    data: {
        datasets: [{
            data: dataChartOthers,
            lineTension:0,
            borderWidth: 1,
            borderColor: '#fff',
            backgroundColor: 'transparent' 
        }]        
    },

	options: {
		responsive: false,
		scales: {
			xAxes: [{type: 'linear',scaleLabel: {
							display: true,
							labelString: '',
							fontSize:8
			},ticks:{fontSize:8, stepSize: 1}}],  
			yAxes:[{type: 'linear',scaleLabel: {
							display: false,
							labelString: 'Value',
							fontSize:8
			},ticks:{fontSize:8,}}],  
		},
		title:{
			display: false,
			fontSize:8,
			text: "SL others",
		},
		animation:{
			duration: 1,
		},
		legend: {
			display: false,
		},
		tooltips: {
			bodyFontSize: 8,
			titleFontSize: 8,
		}
	}
});
}




///////////////////////////////////////////////////////////////
//////////////////   PESOS DOS OBJETIVOS       ////////////////
///////////////////////////////////////////////////////////////

function range(qual){
	a = document.getElementById(qual).value
	if(qual == "rangeCOST-SL"){
		document.getElementById('wCOST').innerHTML = 100-a;
		document.getElementById('wSL').innerHTML = a;		
	}else{
		document.getElementById('wKA').innerHTML = 100-a;
		document.getElementById('wOT').innerHTML = a;
	}
}


///////////////////////////////////////////////////////////////
///////////////// MENU ELEMENT FUNCTIONS   ////////////////////
///////////////////////////////////////////////////////////////

function btnCenter(){
	map.setView([35.75, 43.8], zoom_map);
}

function btnZoomIn(e) {
	map.zoomIn();
}

function btnZoomOut(e) {
	map.zoomOut();
	//console.log( map.getZoom());
}

FLAG_btnWare = 1;

function btnWare(){
	if(FLAG_btnWare){
		$( ".ware" ).css( "display", "none" );
		$("#IDbtnWare").removeClass("menuIcon2Active");
		FLAG_btnWare = 0;
	}else{
		$( ".ware" ).css( "display", "block" );
		$("#IDbtnWare").addClass("menuIcon2Active");
		FLAG_btnWare = 1;		
	}
}

FLAG_btnFactory = 1;

function btnFactory(){
	if(FLAG_btnFactory){
		$(".factory").css( "display", "none" );
		$("#IDbtnFactory").removeClass("menuIcon2Active");
		FLAG_btnFactory = 0;
	}else{
		$(".factory").css( "display", "block" );
		$("#IDbtnFactory").addClass("menuIcon2Active");
		FLAG_btnFactory = 1;		
	}
}


FLAG_btnBuble  = 0;

function btnBuble(){
	if(BLOCK_USER){
	if(FLAG_btnBuble){
		$( ".waresizeAparece" ).toggle();
		$("#IDbtnbubble").removeClass("menuIcon2Active");
		FLAG_btnBuble = 0;
	}else{
		$( ".waresizeAparece" ).toggle();
		$("#IDbtnbubble").addClass("menuIcon2Active");
		FLAG_btnBuble = 1;		
	}
}
}

flag_colorPOP = 0;
flag_colorKA = 0;
flag_colorOT = 0;

function btnMapColor(q){
	if(q==1 && flag_colorPOP == 0){//population
		
		$("#btnPop").addClass("menuIcon2Active");
		$("#btnKA").removeClass("menuIcon2Active");
		$("#btnOT").removeClass("menuIcon2Active");
		MudaCorMesos(3, qtdPop, corDemand, "population");
		legendaPop();
		flag_colorPOP = 1;
		flag_colorKA = 0;
		flag_colorOT = 0;
	}else if(q==2 && BLOCK_USER  == 1 && flag_colorKA == 0){//SL KA
		
		$("#btnKA").addClass("menuIcon2Active");
		$("#btnPop").removeClass("menuIcon2Active");
		$("#btnOT").removeClass("menuIcon2Active");
		MudaCorMesos(30, qtdSL, corSL, 'SLKA');
		legendaSL();
		flag_colorPOP = 0;
		flag_colorKA = 1;
		flag_colorOT = 0;		
	}else if(q==3 && BLOCK_USER  == 1 && flag_colorOT == 0){//SL OTHERS
		
		$("#btnOT").addClass("menuIcon2Active");
		$("#btnPop").removeClass("menuIcon2Active");
		$("#btnKA").removeClass("menuIcon2Active");
		MudaCorMesos(31, qtdSL, corSL, 'SLOT');
		legendaSL();	
		flag_colorPOP = 0;
		flag_colorKA = 0;
		flag_colorOT = 1;
	}else{//Blank
		ResetColor();
		
		flag_colorPOP = 0;
		flag_colorKA = 0;
		flag_colorOT = 0;
		$("#btnPop").removeClass("menuIcon2Active");
		$("#btnKA").removeClass("menuIcon2Active");
		$("#btnOT").removeClass("menuIcon2Active");
	} 
}


function mapStyle(styleMap){
	if(styleMap == "dark"){
		$("#mapDark").addClass("menuIconMap");
		$("#mapStreet").removeClass("menuIconMap");
		map.removeLayer(mapStreets);
		map.addLayer(mapDark);
		map2.removeLayer(mapStreets_fav);
		map2.addLayer(mapDark_fav);		
	}else{
		map.removeLayer(mapDark);
		map.addLayer(mapStreets);
		map2.removeLayer(mapDark_fav);
		map2.addLayer(mapStreets_fav);		
		$("#mapStreet").addClass("menuIconMap");
		$("#mapDark").removeClass("menuIconMap");
	}
	
}





///////////////////////////////////////////////////////////////
///////////////////////    MAP COLOR   ////////////////////////
//////////////      POPULATION AND SERVICE LEVEL //////////////
///////////////////////////////////////////////////////////////

qtdPop =  [10000000, 5250000, 3750000,  2250000, 750000];
qtdSL =   [2,1,0,0,-5];

corDemand = ['#833c0c', '#c65911', '#ed7d31', '#f4b084', '#f0cbad', '#fce4d6'];
corSL = ["rgb(255, 129, 129)", "rgb(155, 194, 230)", "rgb(169, 208, 142)", '#C0D9D9', '#ddd'];

// FUNCTION COLOR MESOS
function MudaCorMesos(j, quantidade, corArray, which){ // changes the color of the mesoregion by id, ID_CONSTANT is a random number to work
	ResetColor();
	flag = which;
		for(i=0; i < 137; i++){	
			if(j < 30){
				color = getColor(parseFloat(meso[i][j].replace(/,/g, "")), quantidade, corArray); // tira as duas virgulas da string
				color2 = getColor(parseFloat(meso[i][j].replace(/,/g, "")), quantidade, corArray);
			}else{
				color = getColor(meso[i][j], quantidade, corArray);
				color2 = getColor(meso[i][j+2], quantidade, corArray);
			}	
			if(meso[i][j] != -1){
				geojsonMeso2.getLayer(i + ID_CONSTANT*2).setStyle({
				opacity: 1,
				fillOpacity: 1,
				fillColor: 	color							
				});


				geojsonMeso_fav2.getLayer(i + ID_CONSTANT*2).setStyle({
				opacity: 1,
				fillOpacity: 1,
				fillColor: 	color2							
				});
		

				
		}
	}
}

function legendaPop(){

	var legend = L.control({position: 'bottomleft'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info textOnMap'), 
			labels = [];

		labels.push('<h3><span style="background:Blue">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; Routes to camps<h3>');			
		labels.push('<h3><span style="background: Green">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; Routes from CD <h3>');			
		labels.push('<h3><span style="background:Red">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; Checkpoints<h3>');	

		div.innerHTML = labels.join('');

		div.id = 'idLegend';
		return div;
	};
	
	 legend.addTo(map);

}




function legendaSL(){

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info textOnMap'), 
			labels = [];

		for (var i = 0; i < qtdSL.length-3; i++) {
			labels.push('<h4><span style="background:' + getColor(qtdSL[i]+1,qtdSL,corSL) +  '">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;>&nbsp;&nbsp;' + qtdSL[i] + '&nbsp;&nbsp;Day<h4>');
		}
		labels.push('<h4><span style="background:' + getColor(qtdSL[2]+1,qtdSL,corSL) +  '">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;<&nbsp;&nbsp;' + 1 + '&nbsp;&nbsp;Day<h4>');		
		div.innerHTML ='<h3><b>Time to<br>delivery</b></h3>' + labels.join('');

		div.id = 'idLegend';
		return div;
	};
	
	 legend.addTo(map);

}

function getColor(d, quantidade, corArray){
	if(d > quantidade[0]){ return  corArray[0];}
	else if(d > quantidade[1]){ return  corArray[1];}
	else if(d > quantidade[2]){ return  corArray[2];}
	else if(d > quantidade[3]){ return  corArray[3];}
	else if(d > quantidade[4]){ return  corArray[4];}
	else if(d > 0 || Number.isNaN(d)){  return  corArray[5];}
}

function ResetColor(){
	flag = "reset";

}	


///////////////////////////////////////////////////////////////
////////  FUNÇÕES PARA SETAR O TAMANHO DOS ARMAZENS  //////////
///////////////////////////////////////////////////////////////

function setWare(f, valor){
	$('#select'+f).text(valor);
	for(i=0; i<7; i++){
		$("#list-"+ i + "-" + f).addClass("noSelect");
	}
	indice = valor.replace('?',0).replace('X',1);
	 $("#list-"+ indice + "-" + f).removeClass("noSelect");
}

function setWare2(f, valor){
	for(i=0; i<7; i++){
		$("#list-"+ i + "-" + f).addClass("noSelect");
	}
	indice = valor.replace('?',0).replace('X',1);
	 $("#list-"+ indice + "-" + f).removeClass("noSelect");
}


////////////////////////////////////////////////////////////
/////////  FUNÇÕES PARA ESCOLHER ENTRE COOPERAR OU NÃO /////
////////////////////////////////////////////////////////////

function setCoop(id, YorN){
	if(YorN == "No"){
		$("#coop-"+ id + "-N").addClass("menuIcon2Active");
		$("#coop-"+ id + "-Y").removeClass("menuIcon2Active");
		$("#coop-"+ id + "-N").addClass("coopActive");
		$("#coop-"+ id + "-Y").removeClass("coopActive");
	}else{
		$("#coop-"+ id + "-Y").addClass("menuIcon2Active");
		$("#coop-"+ id + "-N").removeClass("menuIcon2Active");
		$("#coop-"+ id + "-Y").addClass("coopActive");
		$("#coop-"+ id + "-N").removeClass("coopActive");
	}
}

//////////////////////////////////////////////////////////////
/////////// Destaca icone no mepa ////////////////////////////
//////////////////////////////////////////////////////////////

function destacaIcon(qual, pop){
	$("#mapIcon"+ qual).css("color","black")
	$("#mapIcon2"+ qual).css("color","white")
	$("#map2Icon"+ qual).css("color","black")
	$("#map2Icon2"+ qual).css("color","white")
	$("#divTableDemand").html("<h1>" + qual + "<br> Capacity: " + pop + " (families)")
	$("#divTableDemand").show()

	if(BLOCK_USER == 1){
		if(qRota == 1){
			mostra_arcos_destino(qual)
		}else{
			mostra_arcos_origem(qual)
		}
	}
}

function destacaIcon2(qual){
	$("#mapIcon"+ qual).css("color","")
	$("#mapIcon2"+ qual).css("color","")
	$("#map2Icon"+ qual).css("color","")
	$("#map2Icon2"+ qual).css("color","")	
	$("#divTableDemand").html("")
	$("#divTableDemand").hide()
	
	if(BLOCK_USER == 1){
		route.removeFrom(map);
		route_FAV.removeFrom(map2);
		routeCD.removeFrom(map);
		routeCD_FAV.removeFrom(map2);
	}
}


FLAG_btnBuble  = 0;

function btnBuble(){
	if(BLOCK_USER){
	if(FLAG_btnBuble){
		$( ".waresizeAparece" ).toggle();
		$("#IDbtnbubble").removeClass("menuIcon2Active");
		FLAG_btnBuble = 0;
	}else{
		$( ".waresizeAparece" ).toggle();
		$("#IDbtnbubble").addClass("menuIcon2Active");
		FLAG_btnBuble = 1;		
	}
}
}



qRota = 1
function btnRoute(q){
	if(q==1 && BLOCK_USER  == 1){
		$("#btnRoute1").addClass("menuIcon2Active");
		$("#btnRoute2").removeClass("menuIcon2Active");
		qRota = 1
	}else if(q==2 && BLOCK_USER  == 1){
		$("#btnRoute2").addClass("menuIcon2Active");
		$("#btnRoute1").removeClass("menuIcon2Active");	
		qRota = 2	
	
	}
}