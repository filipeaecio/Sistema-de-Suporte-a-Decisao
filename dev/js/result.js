scenarioColor = [];

scenarioColor[1] = 'darkgreen'
scenarioColor[2] = 'blue'
scenarioColor[3] = 'coral'
scenarioColor[4] = 'gray'
scenarioColor[5] = 'fuchsia'
scenarioColor[6] = 'teal'
scenarioColor[7] = 'royalblue'
scenarioColor[8] = 'deeppink'
scenarioColor[9] = 'navy'
scenarioColor[10] = 'brown'
scenarioColor[11] = 'aqua'
scenarioColor[12] = 'chartreuse'

CENARIO_ATUAL = "";
c_atual = 1;
labelWare = ["?", "X", "1", "2", "3", "4", "5", "6", "7"];
firstLoad = 1;


demandaCampos = [3158, 266, 1936, 5953, 7000, 2400, 1560, 1500, 2397, 400, 4672, 4000, 6544, 10000, 15350, 7435, 949, 810, 415, 1250, 500, 750, 715, 1030];


///////////////////////////////////////////////////////////////
////////  PEGA TODOS OS PARAMETROS E ENVIA PARA O GUROBI ////////
///////////////////////////////////////////////////////////////

cenario = 2;
chartType = "bar";
var colorScenario = [];
colorScenario[1] = scenarioColor[1]

function callGurobi() {
	if ($("#tableSce tr").length == 13) {
		myAlert("The maximum number allowed is 12 scenarios.<br>Please delete a scenario before continuing.");
	} else {
		warehouseUserStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		coopUserStatus = [0, 0, 0];

		document.getElementsByClassName("clickOptimize")[0].innerHTML = "Optimizing";
		$(".clickOptimize").addClass("loading");


		costX = "89,92,96,98,100"; //convertX(dataChartCost);
		costY = "100,72.75,36.42,18.26,0.1"; //convertY(dataChartCost);

		kaX = "0,75,150,225,300"; //convertX(dataChartSLKA);
		kaY = "100,75.025,50.05,25.075,0.1"; // convertY(dataChartSLKA);		

		othersX = "0,125,250,375,500"; //convertX(dataChartOthers);
		othersY = "100,75.025,50.05,25.075,0.1"; //convertY(dataChartOthers);		

		for (f = 0; f < 5; f++) {
			for(g = 0; g < 5; g++){
				if(!$("#list-" + g + "-" + f ).hasClass("noSelect")){
					warehouseUserStatus[f] = g;
					if(g == 0 || g == 1){
						warehouseUserStatus[f+24] = g;
					}else{
						warehouseUserStatus[f+24] = g + 4;
					}
				}
			}
		}
		for (f = 5; f < 29; f++) {
			for(g = 0; g < 6; g++){
				if(!$("#list-" + g + "-" + f ).hasClass("noSelect")){
					if(g == 0 || g == 1){
						warehouseUserStatus[f-5] = g;
					}else{
						warehouseUserStatus[f-5] = g;
					}
				}
			}
		}

		for (f = 0; f < 3; f++) {
			coopUserStatus[f] = 0;
			if($("#coop-" + f + "-Y").hasClass("menuIcon2Active")){
				coopUserStatus[f] = 1;
			}
		}
		
		cPoints = "";
		glue = ""
		for(i=0; i < 47; i++){
			for(j=0; j < 47; j++){
				if(window["CP_" + i + "_" + j]!== undefined){
					if(window["CP_" + i + "_" + j] == 1){
						cPoints = cPoints + glue + i + "," + j
						glue = "|"
					}
				}
			}
		}
		wCost = document.getElementById('wCOST').innerHTML;
		wSL = document.getElementById('wSL').innerHTML;
		wKA = document.getElementById('wKA').innerHTML;
		wOthers = document.getElementById('wOT').innerHTML;

		xhttpA.open("POST", "rungurobi.php");
		xhttpA.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttpA.send("warehouseUserStatus=" + encodeURIComponent(warehouseUserStatus) +
			"&coopUserStatus=" + encodeURIComponent(coopUserStatus) +
			"&costX=" + encodeURIComponent(costX) +
			"&costY=" + encodeURIComponent(costY) +
			"&kaX=" + encodeURIComponent(kaX) +
			"&kaY=" + encodeURIComponent(kaY) +
			"&othersX=" + encodeURIComponent(othersX) +
			"&othersY=" + encodeURIComponent(othersY) +
			"&wCost=" + encodeURIComponent(wCost) +
			"&wSL=" + encodeURIComponent(wSL) +
			"&wKA=" + encodeURIComponent(wKA) +
			"&Cenario=" + encodeURIComponent(cenario) +
			"&wOthers=" + encodeURIComponent(wOthers)+
			"&cPoints=" + encodeURIComponent(cPoints));
	}
}

var xhttpA = new XMLHttpRequest();
xhttpA.onreadystatechange = function () {
	if (this.readyState == 4 && this.status == 200) {

		loadResult(cenario, 1);
		colorScenario[cenario] = scenarioColor[cenario]
		cenario++;
	}
};





///////////////////////////////////////////////////////////////
////////  CARREGA UM RESULTADO DE OTIMIZAÇÃO          ////////
///////////////////////////////////////////////////////////////

function loadResult(c, newLine) {

	if ($("#tableSce tr").length > 1) {
		document.getElementById("row-" + c_atual).style.backgroundColor = "";
		document.getElementById("row-" + c_atual).style.color = "";
		document.getElementById("row-" + c_atual).style.fontWeight = "";
	}
	CENARIO_ATUAL = "C" + c;
	c_atual = c;


	if (firstLoad != 1) {
		document.getElementsByClassName("divClick")[0].style.display = "none"
		document.getElementsByClassName("divResults")[0].style.display = "block"
	}

	$.getScript("results/" + c + "_result.js", function () {
		if (newLine){
			rateia_custo()
		}
		


		userConstraints = [];
		userConstraints[0] = "";
		userConstraints[1] = "";
		userConstraints[2] = "";
		me = 0;
		wq = 0;
		wq2 = 0;


		$(".listWare").each(function (b, a) {
			$(a).removeClass("listWareActive");
		});

		document.getElementById("showCost").innerHTML = "$ " + window[CENARIO_ATUAL + "_COSTS"].formatMoney(2, '.', ' ');
		document.getElementById("showKA").innerHTML = window[CENARIO_ATUAL + "_SL_KA"].toFixed(0) + " h";
		document.getElementById("showOthers").innerHTML = window[CENARIO_ATUAL + "_SL_OTHERS"].toFixed(0) + "";
		document.getElementById("cenarioAtual").innerHTML = "SCENARIO " + c;

		document.getElementById("chart1").innerHTML = "# " + c;
		document.getElementById("chart2").innerHTML = "# " + c;
		document.getElementById("chart3").innerHTML = "# " + c;

		document.getElementById("statusCOST").style.marginLeft = window[CENARIO_ATUAL + "_COSTS_VALUE"] * 2 - 8 + "px";
		document.getElementById("statusKA").style.marginLeft = window[CENARIO_ATUAL + "_SL_KA_VALUE"] * 2 - 8 + "px";
		document.getElementById("statusOT").style.marginLeft = window[CENARIO_ATUAL + "_SL_OTHERS_VALUE"] * 2 - 8 + "px";

		$("#rangeKA-OT").prop('disabled', true);
		$("#rangeCOST-SL").prop('disabled', true);
		document.getElementById("rangeCOST-SL").value = 100 - (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0);
		document.getElementById("rangeKA-OT").value = 100 - (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0);
		document.getElementById('wSL').innerHTML = 100 - (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0);
		document.getElementById('wCOST').innerHTML = (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0);
		document.getElementById('wOT').innerHTML = 100 - (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0);
		document.getElementById('wKA').innerHTML = (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0);

		document.getElementById('titleSce').innerHTML = c;
		document.getElementById('mapTitle_W').innerHTML = (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0) + " / " + (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0);

		if (newLine) {
			writeLog();
			userConstraints = "";
			n_constraints = 0;
			antes = ""
			agora = ""
			if (newSceType == "BLANK") {
				for (p = 0; p < 5; p++) {
					converte = p + 24
					if (window[CENARIO_ATUAL + "_userZ_" + converte] != "?") {
						corrige = 3
						if(window[CENARIO_ATUAL + "_userZ_" + converte] == 0){
							corrige = -1
						}
						userConstraints = userConstraints + citiesCanditates[p][1] + " - " + labelWare[window[CENARIO_ATUAL + "_userZ_" + converte] - corrige] + "<br>";
						n_constraints++;
					}
				}
				for (p = 5; p < 29; p++) {
					converte = p -5
					if (window[CENARIO_ATUAL + "_userZ_" + converte] != "?") {
						corrige = 4
						if(window[CENARIO_ATUAL + "_userZ_" + converte] == 0){
							corrige = 1
						}
						userConstraints = userConstraints + citiesCanditates[p][1] + " - " + labelWare[window[CENARIO_ATUAL + "_userZ_" + converte] + corrige] + "<br>";
						n_constraints++;
					}
				}
			}else{
				qFrom = newSceType.replace(" C", "").replace("FROM", "C");
				for (p = 0; p < 29; p++) {
					for(tamanho = 0; tamanho < 9; tamanho++){
						if(window[qFrom + "_Z_" + p + "_" + tamanho]!== undefined){
							antes = tamanho
						}
						if(window[CENARIO_ATUAL + "_Z_" + p + "_" + tamanho]!== undefined){
							agora = tamanho
						}

					}
					if(antes != agora){
						userConstraints = userConstraints + citiesCanditates[p][1] + " - " + labelWare[antes+1] + " <i class='fas fa-arrow-right'></i> " + labelWare[agora+1] + "<br>"
					}
						
						antes = ""
						agora = ""
					

					
				}

			}	

			if (userConstraints == "") {
				userConstraintsTable = "---"
			} else {
				if (newSceType == "BLANK") {
					userConstraintsTable = "<div class = 'tooltipConst'>" + n_constraints + " Constraints <span class='tooltiptext'>" + userConstraints + "</span></div>"
				}else{
					userConstraintsTable = "<div class = 'tooltipConst'>" + newSceType.replace("C", "S")+"<span class='tooltiptext'>" + userConstraints + "</span></div>"
				}
			}

			var newRow = $("<tr id = 'row-" + c + "'>");
			var cols = "";
			cols += '<td style = "background-color: ' + colorScenario[c] + ' " class = "cell" onclick = "loadR(' + c + ')">' + c + '</td>';
			if (c != 1) {
				cols += '<td class = "cell" onclick = "loadR(' + c + ')">' + (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0) + " / " + (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0) + '</td>';
			} else {
				cols += '<td class = "cell" onclick = "loadR(' + c + ')">---</td>';
			}




			if (firstLoad != 1) {
				barChart();
				varZ();
			}


			colorA = ""
			colorB = ""
			colorC = ""

			if(window[CENARIO_ATUAL + "_RTA"] > C1_RTA){
				colorA = "style= 'color: orange'"
			}else if(window[CENARIO_ATUAL + "_CPA"] > C1_CPA || window[CENARIO_ATUAL + "_LTA"] > C1_LTA){
				colorA = "style= 'color: #a05344'"
			}else if(window[CENARIO_ATUAL + "_CPA"] <= C1_CPA && window[CENARIO_ATUAL + "_LTA"] <= C1_LTA){
				colorA = "style= 'color: green'"
			}

			if(window[CENARIO_ATUAL + "_RTB"] > window["C1_RTB"]){
				colorB = "style= 'color: orange'"
			}else if(window[CENARIO_ATUAL + "_CPB"] > C1_CPB || window[CENARIO_ATUAL + "_LTB"] > C1_LTB){
				colorB = "style= 'color: #a05344'"
			}else if(window[CENARIO_ATUAL + "_CPB"] <= C1_CPB && window[CENARIO_ATUAL + "_LTB"] <= C1_LTB){
				colorB = "style= 'color: green'"
			}

			if(window[CENARIO_ATUAL + "_RTC"] > window["C1_RTC"]){
				colorC = "style= 'color: orange'"
			}else if(window[CENARIO_ATUAL + "_CPC"] > C1_CPC || window[CENARIO_ATUAL + "_LTC"] > C1_LTC){
				colorC = "style= 'color: #a05344'"
			}else if(window[CENARIO_ATUAL + "_CPC"] <= C1_CPC && window[CENARIO_ATUAL + "_LTC"] <= C1_LTC){
				colorC = "style= 'color: green'"
			}

			if (window[CENARIO_ATUAL + "_LTA_txt"] == "" && window[CENARIO_ATUAL + "_CPA_txt"] == ""  ) {
				tootipA =  "$ " + window[CENARIO_ATUAL + "_RTA"].formatMoney(0, '.', ' ')
			} else {
				tootipA = "<div class = 'tooltipConst'> $" + window[CENARIO_ATUAL + "_RTA"].formatMoney(0, '.', ' ') + " <span class='tooltiptext'>" + window[CENARIO_ATUAL + "_LTA_txt"] + "<br>" + window[CENARIO_ATUAL + "_CPA_txt"] + "</span></div>"
			}

			if (window[CENARIO_ATUAL + "_LTB_txt"] == "" && window[CENARIO_ATUAL + "_CPB_txt"] == ""  ) {
				tootipB =  "$ " + window[CENARIO_ATUAL + "_RTB"].formatMoney(0, '.', ' ')
			} else {
				tootipB = "<div class = 'tooltipConst'> $" + window[CENARIO_ATUAL + "_RTB"].formatMoney(0, '.', ' ') + " <span class='tooltiptext'>" + window[CENARIO_ATUAL + "_LTB_txt"] + "<br>" + window[CENARIO_ATUAL + "_CPB_txt"] + "</span></div>"
			}

			if (window[CENARIO_ATUAL + "_LTC_txt"] == "" && window[CENARIO_ATUAL + "_CPC_txt"] == ""  ) {
				tootipC =  "$ " + window[CENARIO_ATUAL + "_RTC"].formatMoney(0, '.', ' ')
			} else {
				tootipC = "<div class = 'tooltipConst'> $" + window[CENARIO_ATUAL + "_RTC"].formatMoney(0, '.', ' ') + " <span class='tooltiptext'>" + window[CENARIO_ATUAL + "_LTC_txt"] + "<br>" + window[CENARIO_ATUAL + "_CPC_txt"] + "</span></div>"
			}
			//cols += '<td class = "cell" onclick = "loadR('+ c +')">' + window[CENARIO_ATUAL + "_OBJECTIVE"].toFixed(2) +'</td>';	 
			cols += '<td class = "cell" onclick = "loadR(' + c + ')">' + "$ " + window[CENARIO_ATUAL + "_COSTS"].formatMoney(0, '.', ' ') + '</td>';
			cols += '<td class = "cell" onclick = "loadR(' + c + ')">' + window[CENARIO_ATUAL + "_SL_KA"].toFixed(2) + " h" + '</td>';
			cols += '<td class = "cell" onclick = "loadR(' + c + ')">' + window[CENARIO_ATUAL + "_SL_OTHERS"].toFixed(2) + " " + '</td>';

			cols += '<td ' + colorA + ' class = "cell" onclick = "loadR(' + c + ')">'  +  tootipA + " " + '</td>';
			cols += '<td ' + colorB + ' class = "cell" onclick = "loadR(' + c + ')">' + tootipB + " " + '</td>';
			cols += '<td ' + colorC + ' class = "cell" onclick = "loadR(' + c + ')">' + tootipC + " " + '</td>';

			cols += '<td class = "cell" onclick = "loadR(' + c + ')" style = "font-size:17px; padding: 3px 0 3px 0">' + userConstraintsTable + '</td>';
			cols += '<td class = "cell" onclick = "favorito(' + c + ')" style = "font-size:17px; padding: 3px 0 3px 0"><i style = "color: rgba(155,155,155,0.7)" id = "award' + c + '" class="fas fa-award"></i></td>';
			cols += '<td class = "cell" onclick = "eye(' + c + ')" style = "font-size:17px; padding: 3px 0 3px 0"><i style = "color: #1997c6" class="fas fa-chart-line" id = "eye-' + c + '"></i></td>';
			if (c != 1) {
				cols += '<td class = "cell" onclick = "trash(' + c + ')" style = "font-size:17px; padding: 3px 0 3px 0"><i style = "color: rgba(155,155,155,0.7)" class="fas fa-trash-alt"></i></td>';
			} else {
				cols += '<td class = "cell" style = "font-size:17px; padding: 3px 0 3px 0"></td>';
			}
			newRow.append(cols);
			$("#tableSce").append(newRow);


			scenarioChart.data.datasets.push({
				label: 'S-' + c,
				lineTension: 0,
				borderWidth: 3,
				fill: false,

				backgroundColor: colorScenario[c],
				borderColor: colorScenario[c],
				data: [window[CENARIO_ATUAL + "_COSTS_VALUE"].toFixed(0), window[CENARIO_ATUAL + "_SL_KA_VALUE"].toFixed(0), window[CENARIO_ATUAL + "_SL_OTHERS_VALUE"].toFixed(0)],
			});
			scenarioChart.update();


			costChart.data.datasets.push({
				label: 'S-' + c,
				lineTension: 0,
				borderWidth: 3,
				fill: false,

				backgroundColor: colorScenario[c],
				borderColor: colorScenario[c],
				data: [(window[CENARIO_ATUAL + "_RTA"] / 1000000).toFixed(2), (window[CENARIO_ATUAL + "_RTB"] / 1000000).toFixed(2), (window[CENARIO_ATUAL + "_RTC"] / 1000000).toFixed(2)],
			});
			costChart.update();

			scenarioCPChart.data.datasets.push({
				label: 'S-' + c,
				lineTension: 0,
				borderWidth: 3,
				fill: false,

				backgroundColor: colorScenario[c],
				borderColor: colorScenario[c],
				data: [(window[CENARIO_ATUAL + "_CPA"]).toFixed(2), (window[CENARIO_ATUAL + "_CPB"]).toFixed(2), (window[CENARIO_ATUAL + "_CPC"]).toFixed(2)],
			});
			scenarioCPChart.update();

			paretoBChart.data.datasets.push({
				label: 'S-' + c,
				backgroundColor: colorScenario[c],
				borderColor: colorScenario[c],
				data: [{ x: (window[CENARIO_ATUAL + "_COSTS"] / 1000000).toFixed(2), y: (window[CENARIO_ATUAL + "_SL_OTHERS"]).toFixed(0) }],
			});
			paretoBChart.update();
		}


		if (firstLoad == 1) {

			favorito(1);

		}

		if (firstLoad != 1) {
			BLOCK_USER = 1;
			document.getElementById("row-" + c).style.backgroundColor = "#eee";
			document.getElementById("row-" + c).style.color = "rgb(159, 134, 255)";
			document.getElementById("row-" + c).style.fontWeight = "bold";
		}




	});
}

///////////////////////////////////////////////////////////////
//////// fUNÇÃO QUE FORMATA PARA FORMATO MONETÁRIO    ////////
//////// CÓDIGO RETIRADO DO ENDEREÇO A SEGUIR
///https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-currency-string-in-javascript
///////////////////////////////////////////////////////////////
Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


///////////////////////////////////////////////////////////////
//////// CRIA OS GRÁFICOS DURANTE A LEITURA DE UM RESULTADO ////////
///////////////////////////////////////////////////////////////

bar250OT = 0;
bar500OT = 0;
bar750OT = 0;

bar250KA = 0;
bar500KA = 0;
bar750KA = 0;

bar250OT_fav = 0;
bar500OT_fav = 0;
bar750OT_fav = 0;

bar250KA_fav = 0;
bar500KA_fav = 0;
bar750KA_fav = 0;

chartKA = "";
chartOT = "";

Flag_chartPie = 0;

function chartPie() {
	if (chartKA != "") {
		chartKA.destroy();
		chartOT.destroy();
		BarCOST_chart.destroy()

	}
	if (Flag_chartPie != 0) {
		chartKA_fav.destroy();
		chartOT_fav.destroy();
	}

	Flag_chartPie = 1;

	document.getElementById("rCharta").style.height = "150px";
	document.getElementById("rCharta").style.width = "150px";
	document.getElementById("rChartb").style.height = "150px";
	document.getElementById("rChartb").style.width = "150px";

	document.getElementById("rChartc").style.height = "150px";
	document.getElementById("rChartc").style.width = "150px";
	document.getElementById("rChartd").style.height = "150px";
	document.getElementById("rChartd").style.width = "150px";

	document.getElementById("rchartaward1").style.bottom = "-88px";
	document.getElementById("rchartaward2").style.display = "none";

	//////PIE KA
	Pie_KA = document.getElementById("chartKA").getContext('2d');
	dataPieKA = {
		labels: ["< 1 Day", "> 1 Day", "> 2 Day"],
		legend: false,
		datasets: [
			{
				fill: true,
				backgroundColor: [
					'rgba(169,208,142,1)',
					'rgba(155,194,230,1)',
					'rgba(255,129,129,1)'],
				data: [(bar250KA / 10000).toFixed(2), (bar500KA / 10000).toFixed(2), (bar750KA / 10000).toFixed(2)],
				borderColor: ['black', 'black', 'black'],
				borderWidth: 1,
				label: 'A'
			}
		]
	};

	optionsPieKA = {
		title: { display: true, text: 'SL LT', position: 'top', fontStyle: 'bold' },
		legend: { display: false },
		responsive: true,
		maintainAspectRatio: false,
		rotation: -0.7 * Math.PI,
		pieceLabel: {
			render: 'percetagem',
			fontSize: 14,
			fontStyle: 'bold',
			fontColor: '#222'
		}
	};

	// Chart declaration:
	chartKA = new Chart(Pie_KA, {
		type: 'pie',
		data: dataPieKA,
		options: optionsPieKA
	});

	//////PIE OTHERS
	Pie_OT = document.getElementById("chartOT").getContext('2d');
	dataPieOT = {
		labels: ["< 1 Day", "> 1 Day", "> 2 Day"],
		legend: false,
		datasets: [{
			fill: true,
			backgroundColor: [
				'rgba(169,208,142,1)',
				'rgba(155,194,230,1)',
				'rgba(255,129,129,1)'],
			data: [(bar250OT / 10000).toFixed(2), (bar500OT / 10000).toFixed(2), (bar750OT / 10000).toFixed(2)],
			borderColor: ['black', 'black', 'black'],
			borderWidth: [1, 1, 1]
		}
		]

	};

	optionsPieOT = {
		title: { display: true, text: 'SL CP', position: 'top', fontStyle: 'bold' },
		legend: { display: false },
		responsive: true,
		maintainAspectRatio: false,
		rotation: -0.7 * Math.PI,
		pieceLabel: {
			render: 'percetagem',
			fontSize: 14,
			fontStyle: 'bold',
			fontColor: '#222'
		}
	};

	// Chart declaration:
	chartOT = new Chart(Pie_OT, {
		type: 'pie',
		data: dataPieOT,
		options: optionsPieOT
	});



	//////PIE KA FAV
	Pie_KA_fav = document.getElementById("chartPIEa").getContext('2d');
	dataPieKA_fav = {
		labels: ["< 1 Day", "> 1 Day", "> 2 Day"],
		legend: false,
		datasets: [
			{
				fill: true,
				backgroundColor: [
					'rgba(169,208,142,1)',
					'rgba(155,194,230,1)',
					'rgba(255,129,129,1)'],
				data: [(bar250KA_fav / 10000).toFixed(2), (bar500KA_fav / 10000).toFixed(2), (bar750KA_fav / 10000).toFixed(2)],
				borderColor: ['black', 'black', 'black'],
				borderWidth: 1,
				label: 'A'
			}
		]
	};

	optionsPieKA_fav = {
		title: { display: true, text: ' ', position: 'top', fontStyle: 'bold' },
		legend: { display: false },
		responsive: true,
		maintainAspectRatio: false,
		rotation: -0.7 * Math.PI,
		pieceLabel: {
			render: 'percetagem',
			fontSize: 14,
			fontStyle: 'bold',
			fontColor: '#222'
		}
	};

	// Chart declaration:
	chartKA_fav = new Chart(Pie_KA_fav, {
		type: 'pie',
		data: dataPieKA_fav,
		options: optionsPieKA_fav
	});

	//////PIE OTHERS FAV
	Pie_OT_fav = document.getElementById("chartPIEb").getContext('2d');
	dataPieOT_fav = {
		labels: ["< 1 Day", "> 1 Day", "> 2 Day"],
		legend: false,
		datasets: [{
			fill: true,
			backgroundColor: [
				'rgba(169,208,142,1)',
				'rgba(155,194,230,1)',
				'rgba(255,129,129,1)'],
			data: [(bar250OT_fav / 10000).toFixed(2), (bar500OT_fav / 10000).toFixed(2), (bar750OT_fav / 10000).toFixed(2)],
			borderColor: ['black', 'black', 'black'],
			borderWidth: [1, 1, 1]
		}
		]

	};

	optionsPieOT_fav = {
		title: { display: true, text: ' ', position: 'top', fontStyle: 'bold' },
		legend: { display: false },
		responsive: true,
		maintainAspectRatio: false,
		rotation: -0.7 * Math.PI,
		pieceLabel: {
			render: 'percetagem',
			fontSize: 14,
			fontStyle: 'bold',
			fontColor: '#222'
		}
	};

	// Chart declaration:
	chartOT_fav = new Chart(Pie_OT_fav, {
		type: 'pie',
		data: dataPieOT_fav,
		options: optionsPieOT_fav
	});
}


function chartBar() {
	if (chartKA != "") {
		chartKA.destroy();
		chartOT.destroy();
		BarCOST_chart.destroy()
		
	}

	if (Flag_chartPie != 0) {
		chartKA_fav.destroy();
		chartOT_fav.destroy();
	}

	document.getElementById("rCharta").style.height = "200px";
	document.getElementById("rCharta").style.width = "200px";
	document.getElementById("rChartb").style.height = "200px";
	document.getElementById("rChartb").style.width = "200px";
	document.getElementById("rCharte").style.height = "200px";
	document.getElementById("rCharte").style.width = "200px";

	document.getElementById("rChartc").style.height = "0";
	document.getElementById("rChartc").style.width = "0";
	document.getElementById("rChartd").style.height = "0";
	document.getElementById("rChartd").style.width = "0";

	document.getElementById("rchartaward1").style.bottom = "55px";
	document.getElementById("rchartaward2").style.display = "block";

	//////BAR KA	
	barKA = document.getElementById("chartKA");
	barKAData250 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(169,208,142,1)',
		data: [bar250KA, bar250KA_fav],

	};

	barKAData500 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(155,194,230,1)',
		data: [bar500KA,bar500KA_fav ],

	};

	barKAData750 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(255,129,129,1)',
		data: [bar750KA, bar750KA_fav],

	};

	chartKA = new Chart(barKA, {
		type: 'bar',
		data: {
			labels: ["", ""],
			datasets: [barKAData250, barKAData500, barKAData750]
		},
		options: {

			title: { display: true, text: '            SL LT', position: 'top', fontStyle: 'bold' },
			legend: { display: false },
			responsive: true,
			scales: {
				yAxes: [{
					stacked: true,
					scaleLabel: {
						display: true,
						labelString: 'Families',


					}, ticks: {
						beginAtZero: true,
						max: 80990,
						fontSize: 15,
						stepSize: 16198
					}, gridLines: {
						color: 'rgba(0, 0, 0, 0.5)',

					},

				}],
				xAxes: [{
					stacked: true,
					scaleLabel: {
						display: false,
						labelString: 'Days to delivery',

					}
				}],
			}
		}
	});


	//////BAR OTHERS	
	BarOT = document.getElementById("chartOT");
	barOTData250 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(169,208,142,1)',

		data: [bar250OT,bar250KA_fav]
	};

	barOTData500 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(155,194,230,1)',
		data: [bar500OT,bar500KA_fav]
	};

	barOTData750 = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(255,129,129,1)',
		data: [bar750OT,bar750KA_fav]
	};





	chartOT = new Chart(BarOT, {
		type: 'bar',
		data: {
			labels: ["", ""],
			datasets: [barOTData250, barOTData500, barOTData750]
		},
		options: {
			title: { display: true, text: '            SL CP', position: 'top', fontStyle: 'bold' },
			legend: { display: false },
			responsive: true,
			scales: {
				yAxes: [{
					stacked: true,
					scaleLabel: {
						display: true,
						labelString: 'Families'
					}, ticks: {
						beginAtZero: true,
						max: 80990,
						fontSize: 15,
						stepSize: 16198
					}, gridLines: {
						color: 'rgba(0, 0, 0, 0.5)',
						lineWidth: 1,


					}
				}],
				xAxes: [{
					stacked: true,
					scaleLabel: {
						display: false,
						labelString: 'Days to delivery',

					},



				}],
			}
		}
	});


	//////BAR COST	

	BarCOST = document.getElementById("chartCOST");
	BarCOSTDataT = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(204,102,153,1)',

		data: [(window[CENARIO_ATUAL + "_RTA"] / 1000000).toFixed(2), fav_costT]
	};
	 
	 
	 
	
	BarCOSTDataYF = {
		label: false,
		fill: true,
		backgroundColor: 'rgba(51,153,153,1)',
		data: [(window[CENARIO_ATUAL + "_RTB"] / 1000000).toFixed(2),fav_costYF]
	};

	BarCOSTDataYD = {
		label: false,
		fill: true,

		backgroundColor: 'rgba(255,255,153,1)',
		data: [(window[CENARIO_ATUAL + "_RTC"] / 1000000).toFixed(2),fav_costYD]
	};



	BarCOST_chart = new Chart(BarCOST, {
		type: 'bar',
		data: {
			labels: ["", ""],
			datasets: [BarCOSTDataYD, BarCOSTDataYF, BarCOSTDataT]
		},
		options: {
			title: { display: true, text: '            Cost', position: 'top', fontStyle: 'bold' },
			legend: { display: false },
			responsive: true,
			scales: {
				yAxes: [{
					stacked: true,
					scaleLabel: {
						display: true,
						labelString: 'Million $'
					}, ticks: {
						beginAtZero: true,
						max: 5,
						min: 0,
						fontSize: 15,
						stepSize: 1
					}, gridLines: {
						color: 'rgba(0, 0, 0, 0.5)',
						lineWidth: 1,


					}
				}],
				xAxes: [{
					stacked: true,
					scaleLabel: {
						display: false,
						labelString: 'Days to delivery',

					},
				}],
			}
		}
	});
}



function btnChart(qChart) {
	if (qChart == 'bar') {
		chartType = "bar";
		chartBar();
		$("#btnChartBar").addClass("menuIcon3Active");
		$("#btnChartPie").removeClass("menuIcon3Active");
	} else if (qChart == 'pie') {
		chartType = "pie";
		chartPie();
		$("#btnChartPie").addClass("menuIcon3Active");
		$("#btnChartBar").removeClass("menuIcon3Active");
	}
}









function barChart() {

	bar250OT = 0;
	bar500OT = 0;
	bar750OT = 0;

	bar250KA = 0;
	bar500KA = 0;
	bar750KA = 0;

	for(i=0; i < 24; i++){

		if(window[CENARIO_ATUAL + "_mWcampo_" + i] !== undefined){
			if(window[CENARIO_ATUAL + "_mWcampo_" + i] <= 1){
				bar250KA = bar250KA + demandaCampos[i]
			}else if(window[CENARIO_ATUAL + "_mWcampo_" + i] <= 2){
				bar500KA = bar500KA + demandaCampos[i]
			}else{
				bar750KA = bar750KA + demandaCampos[i]
			}
		}else{
			bar250KA = bar250KA + demandaCampos[i]
		}


		if(window[CENARIO_ATUAL + "_nYcampo_" + i] !== undefined){
			if(window[CENARIO_ATUAL + "_nYcampo_" + i] <= 1){
				bar250OT = bar250OT + demandaCampos[i]
			}else if(window[CENARIO_ATUAL + "_nYcampo_" + i] <= 2){
				bar500OT = bar500OT + demandaCampos[i]
			}else{
				bar750OT = bar750OT + demandaCampos[i]
			}
		}else{
			bar250OT = bar250OT + demandaCampos[i]
		}

	}
	
	window[CENARIO_ATUAL + "_bar250KA"] = bar250KA
	window[CENARIO_ATUAL + "_bar500KA"] = bar500KA
	window[CENARIO_ATUAL + "_bar750KA"] = bar750KA

	window[CENARIO_ATUAL + "_bar250OT"] = bar250OT
	window[CENARIO_ATUAL + "_bar500OT"] = bar500OT
	window[CENARIO_ATUAL + "_bar750OT"] = bar750OT

	if (chartType == "bar") {
		chartBar();
	} else {
		chartPie();
	}
}

function barChart_fav() {

	fav_costT = (window[CENARIO_ATUAL_FAV + "_RTA"] / 1000000).toFixed(2)
	fav_costYF = (window[CENARIO_ATUAL_FAV + "_RTB"] / 1000000).toFixed(2)
	fav_costYD = (window[CENARIO_ATUAL_FAV + "_RTC"] / 1000000).toFixed(2)
	fav_costZ = (window[CENARIO_ATUAL_FAV + "_RFT"] / 1000000).toFixed(2)

	bar250OT_fav = 0;
	bar500OT_fav = 0;
	bar750OT_fav = 0;

	bar250KA_fav = 0;
	bar500KA_fav = 0;
	bar750KA_fav = 0;

	for(i=0; i < 24; i++){

		if(window[CENARIO_ATUAL + "_mWcampo_" + i] !== undefined){
			if(window[CENARIO_ATUAL + "_mWcampo_" + i] <= 1){
				bar250KA_fav = bar250KA_fav + demandaCampos[i]
			}else if(window[CENARIO_ATUAL + "_mWcampo_" + i] <= 2){
				bar500KA_fav = bar500KA_fav + demandaCampos[i]
			}else{
				bar750KA_fav = bar750KA_fav + demandaCampos[i]
			}
		}else{
			bar250KA_fav = bar250KA_fav + demandaCampos[i]
		}


		if(window[CENARIO_ATUAL + "_nYcampo_" + i] !== undefined){
			if(window[CENARIO_ATUAL + "_nYcampo_" + i] <= 1){
				bar250OT_fav = bar250OT_fav + demandaCampos[i]
			}else if(window[CENARIO_ATUAL + "_nYcampo_" + i] <= 2){
				bar500OT_fav = bar500OT_fav + demandaCampos[i]
			}else{
				bar750OT_fav = bar750OT_fav + demandaCampos[i]
			}
		}else{
			bar250OT_fav = bar250OT_fav + demandaCampos[i]
		}

	}

	if (chartType == "bar") {
		chartBar();
	} else {
		chartPie();
	}
}


///////////////////////////////////////////////////////////////
//////// ALTERA A CONFIGURAÇÃO DOS LOCAIS CANDIDATOS AO SE LER UM RESULTADO  ////////
///////////////////////////////////////////////////////////////
function varZ() {

	for (f = 0; f < 5; f++) {
		for(g = 0; g < 9; g++){
			converte = f + 24
			if(window[CENARIO_ATUAL + "_Z_" + converte + "_" + g] !== undefined){
				$("#list-lock-"+ f).addClass("noSelectLock");
				if (window[CENARIO_ATUAL + "_userZ_" + converte] != "?") {
					$("#list-lock-"+ f).removeClass("noSelectLock");
				}
				

				$("#wareSize"+ pontos[converte][0]).addClass("wareSize-" + g);


				
				if(g == 0){
					temp = g + 1
					setWare(f, temp + "")
				}else{
					temp = g - 3
					setWare(f, temp + "")
				}
			}
		}
	}


	for (f = 5; f < 29; f++) {
		for(g = 0; g < 9; g++){
			converte = f - 5
			if (window[CENARIO_ATUAL + "_Z_" + converte + "_" + g] !== undefined) {
				$("#list-lock-"+ f).addClass("noSelectLock");
				if (window[CENARIO_ATUAL + "_userZ_" + converte] != "?") {
					$("#list-lock-"+ f).removeClass("noSelectLock");
				}
				$("#wareSize"+ pontos[converte][0]).addClass("wareSize-" + g);

				if(g == 0){
					temp = g + 1 
					setWare(f, temp + "")
				}else{
					temp = g + 1
					setWare(f, temp + "")
				}
			}
		}
	}	



	$(".divResults").addClass(divResultsFHD);

}





///////////////////////////////////////////////////////////////
////////////////////////// FLOWS  "BARATINHAS"//////////////////////////////
///////////////////////////////////////////////////////////////

p = 0;

channelColor = ["#ff33ff", "orange", "#7fff0e"];
SL_COLOR = ["rgb(0, 128, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 0)"];


///////////////////////////////////////////////////////////////
//////// CARREGA UM RESULTADO DA TABELA  ////////
///////////////////////////////////////////////////////////////
function loadR(k) {
	resetVarZ("BLANK")
	loadResult(k, 0);

}

///////////////////////////////////////////////////////////////
//////// VOLTA OS LUGARES CANDIDATOS AO ESTADO INICIAL PARA GERAR UM NOVO CENÁRIO ////////
///////////////////////////////////////////////////////////////
function resetVarZ(a) {

	for (f = 0; f < 29; f++) {
		setWare(f, "0")
		$("#list-lock-"+ f).addClass("noSelectLock");
	}
	
	if (a == "FROM_THIS") {
		for (f = 0; f < 5; f++) {
			for(g = 1; g < 6; g++){
				if (window[CENARIO_ATUAL + "_Z_" + f + "_" + g] !== undefined) {
					temp = g + 1
					setWare(f, temp + "")
					
				}
			}
		}

		for (f = 5; f < 29; f++) {
			for(g = 1; g < 9; g++){
				if (window[CENARIO_ATUAL + "_Z_" + f + "_" + g] !== undefined) {
					if(g == 0 || g == 1){
						setWare(f, g + "")
					}else{
						temp = g - 3
						setWare(f, temp + "")
					}
				}
			}
		}		
		
	
	}



	$("#IDbtnbubble").removeClass("menuIcon2Active");

	if (FLAG_btnBuble == 1) {
		$(".waresizeAparece").toggle();
	}
	FLAG_btnBuble = 0;




}

///////////////////////////////////////////////////////////////
//////// PREPARA O SISTEMA PARA GERAR UM NOVO CENÁRIO  ////////
///////////////////////////////////////////////////////////////
newSceType = "BLANK";
function newScenario(newType) {
	resetVarZ(newType);
	if (newType == "BLANK") {
		newSceType = newType;
	} else {
		newSceType = "FROM " + CENARIO_ATUAL;
	}
	document.getElementById("cenarioAtual").innerHTML = "CREATING A NEW SCENARIO";

	flagFlowYF = 0;
	flagFlowYD = 0;
	flagFlowT = 0;

	flagFlowRE = 0;
	flagFlowSP = 0;
	flagFlowGO = 0;

	flagFlowThird = 0;
	flagFlowAll = 0;

	$(".listWare").each(function (b, a) {
		$(a).addClass("listWareActive");
	});



	$("#btnFlowYF").removeClass("menuIcon2Active");
	$("#btnFlowYD").removeClass("menuIcon2Active");
	$("#btnFlowT").removeClass("menuIcon2Active");
	$("#btnFlowRE").removeClass("menuIcon2Active");
	$("#btnFlowSP").removeClass("menuIcon2Active");
	$("#btnFlowGO").removeClass("menuIcon2Active");
	$("#btnFlowThird").removeClass("menuIcon2Active");
	$("#btnFlowAll").removeClass("menuIcon2Active");

	$("#rangeKA-OT").prop('disabled', false);
	$("#rangeCOST-SL").prop('disabled', false);




	ResetColor();
	

	flag_colorPOP = 0;
	flag_colorKA = 0;
	flag_colorOT = 0;
	$("#btnPop").removeClass("menuIcon2Active");
	$("#btnKA").removeClass("menuIcon2Active");
	$("#btnOT").removeClass("menuIcon2Active");

	document.getElementsByClassName("divClick")[0].style.display = "block";
	document.getElementsByClassName("divResults")[0].style.display = "none";
	document.getElementsByClassName("clickOptimize")[0].innerHTML = "Press to optimize";
	$(".clickOptimize").removeClass("loading");

	BLOCK_USER = 0;

}






///////////////////////////////////////////////////////////////
//////// GRAFICOS COMPARATIVOS LADO DIREITO DA TELA ////////
///////////////////////////////////////////////////////////////

var config = {
	type: 'line',
	data: {
		labels: ['Cost', 'SL LT', 'SL CP'],
		datasets: []
	},
	options: {
		responsive: true,
		aspectRatio: 1.2,
		legend: { display: false },
		title: {
			display: true,
			text: 'Scenarios: Compare'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: ''
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Value',
				}, ticks: {
					beginAtZero: true,
					max: 100,
					min: 0,
					fontSize: 15,
					stepSize: 10
				}, gridLines: {
					color: 'rgba(0,0,0,0)',


				}
			}],
			xAxes: [{
				display: true,

				scaleLabel: {
					display: true,
					labelString: 'Criteria',
				}, gridLines: {
					color: '#fff',
					borderWidth: 3,
					zeroLineColor: '#fff',
				}
			}]
		}
	}
};




/////////// CHART CUSTOS

var config_cost = {
	type: 'line',
	data: {
		labels: ['Agency A', 'Agency B', 'Agency C'],
		datasets: []
	},
	options: {
		responsive: true,
		aspectRatio: 1.2,
		legend: { display: false },
		title: {
			display: true,
			text: 'Costs: Compare'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: ''
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '$ million',
				}, ticks: {
					beginAtZero: true,
					max: 2.2,
					min: 0,
					fontSize: 15,
					stepSize: 0.2
				}, gridLines: {
					color: 'rgba(0,0,0,0)',


				}
			}],
			xAxes: [{
				display: true,

				scaleLabel: {
					display: true,
					labelString: 'Cost Share',
				}, gridLines: {
					color: '#fff',
					borderWidth: 3,
					zeroLineColor: '#fff',
				}
			}]
		}
	}
};


/////////// CHART CUSTOS

var config_scenarioCP = {
	type: 'line',
	data: {
		labels: ['Agency A', 'Agency B', 'Agency C'],
		datasets: []
	},
	options: {
		responsive: true,
		aspectRatio: 1.2,
		legend: { display: false },
		title: {
			display: true,
			text: 'Checkpoints: Compare'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: ''
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Checkpoints',
				}, ticks: {
					beginAtZero: true,
					max: 5,
					min: 0,
					fontSize: 15,
					stepSize: 1
				}, gridLines: {
					color: 'rgba(0,0,0,0)',


				}
			}],
			xAxes: [{
				display: true,

				scaleLabel: {
					display: true,
					labelString: '',
				}, gridLines: {
					color: '#fff',
					borderWidth: 3,
					zeroLineColor: '#fff',
				}
			}]
		}
	}
};






//////////pareto B


var config_paretoB = {

	type: 'scatter',
	data: {
		datasets: []
	},
	options: {
		responsive: true,
		aspectRatio: 1.2,
		legend: { display: false },
		title: {
			display: true,
			text: 'Pareto COST x SL CHECKPOINTS'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: ''
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'SL CP',

				}, ticks: {
					beginAtZero: true,
					max: 3,
					min: 0,
					fontSize: 15,
					stepSize: 1
				}, gridLines: {
					color: '#fff',
					display: false

				}
			}],
			xAxes: [{
				display: true,

				scaleLabel: {
					display: true,
					labelString: 'Cost ($ million)',
				}, gridLines: {
					color: '#fff',
					display: false
				}, ticks: {
					beginAtZero: true,
					max: 5,
					min: 0,
					fontSize: 15,
					stepSize: 1
				}
			}]
		}
	}
};




favoritoAtual = 1;
CENARIO_ATUAL_FAV = 0;


///////////////////////////////////////////////////////////////
////////ESCOLHE O CENÁRIO FAVORITO   ////////
///////////////////////////////////////////////////////////////

function favorito(c) {
	if (favoritoAtual != c || firstLoad == 1) {
	//	resetVarZ_fav();
		CENARIO_ATUAL_FAV = "C" + c;

		document.getElementById('award' + favoritoAtual).style.fontSize = "";
		document.getElementById('award' + favoritoAtual).style.color = "rgba(155,155,155,0.7)";

		document.getElementById('award' + c).style.color = "#ffff00 ";
		document.getElementById('award' + c).style.fontSize = "165%";

		favoritoAtual = c;

		document.getElementById('titleSce2').innerHTML = c;

		if(c!=1){
			document.getElementById('mapTitle_W2').innerHTML = (window[CENARIO_ATUAL_FAV + "_wCost"] * 100).toFixed(0) + " / " + (window[CENARIO_ATUAL_FAV + "_wKA"] * 100).toFixed(0);
		}else{
			document.getElementById('mapTitle_W2').innerHTML = "---";
		}


		for (f = 0; f < 5; f++) {
			lock = "";
			converte = f + 24
			if (window[CENARIO_ATUAL_FAV + "_userZ_" + converte] != "?") {
				lock = "<i class='fa fa-lock'></i>";
			}
			for(g = 0; g < 9; g++){
				if(window[CENARIO_ATUAL_FAV + "_Z_" + converte + "_" + g] !== undefined){
					if(g == 0){
						temp = "X"
						$('#favorito-' + f).html('&nbsp;' + temp + '&nbsp;' + lock);
						$("#wareSizeFAV"+ pontos[converte][0]).addClass("wareSize-" + g);
					}else{
						temp = g - 4
						$('#favorito-' + f).html('&nbsp;' + temp + '&nbsp;' + lock);
						$("#wareSizeFAV"+ pontos[converte][0]).addClass("wareSize-" + g);
					}
				}
			}
		}
	
	
		for (f = 5; f < 29; f++) {
			for(g = 0; g < 9; g++){
				lock = "";
				converte = f - 5
				if (window[CENARIO_ATUAL_FAV + "_userZ_" + converte] != "?") {
					lock = "<i class='fa fa-lock'></i>";
				}
				if (window[CENARIO_ATUAL_FAV + "_Z_" + converte + "_" + g] !== undefined) {
					if(g == 0){
						temp = "X"
						$('#favorito-' + f).html('&nbsp;' + temp + '&nbsp;' + lock);
						$("#wareSizeFAV"+ pontos[converte][0]).addClass("wareSize-" + g);
					}else{
						temp = g + 3
						$('#favorito-' + f).html('&nbsp;' + temp + '&nbsp;' + lock);
						$("#wareSizeFAV"+ pontos[converte][0]).addClass("wareSize-" + g);
					}
				}
			}
		}	
	
		document.getElementById('favCOST').style.marginLeft = window[CENARIO_ATUAL_FAV + "_COSTS_VALUE"] * 2 - 8 + "px";
		document.getElementById('favKA').style.marginLeft = window[CENARIO_ATUAL_FAV + "_SL_KA_VALUE"] * 2 - 8 + "px";
		document.getElementById('favOT').style.marginLeft = window[CENARIO_ATUAL_FAV + "_SL_OTHERS_VALUE"] * 2 - 8 + "px";

		barChart_fav();
	}
	//varZ_fav();

	firstLoad = 0;

}

///////////////////////////////////////////////////////////////
////////APAGA UM CENÁRIO   ////////
///////////////////////////////////////////////////////////////

function trash(c) {
	if (c == c_atual || c == favoritoAtual) {
		myAlert("You can not delete the selected scenario or favorite scenario.");
	} else {
		document.getElementById("row-" + c).parentNode.removeChild(document.getElementById("row-" + c));

		for (i = 0; i < scenarioChart.data.datasets.length; i++) {
			if (scenarioChart.data.datasets[i].label == "S-" + c) {
				scenarioChart.data.datasets.splice(i, 1);
				costChart.data.datasets.splice(i, 1);
				paretoAChart.data.datasets.splice(i, 1);
				paretoBChart.data.datasets.splice(i, 1);
			}
			scenarioChart.update();
			costChart.update();
			paretoAChart.update();
			paretoBChart.update();
		}
		scenarioColor.push(scenarioColor[c])
	}

	

}

///////////////////////////////////////////////////////////////
////////ESCOLHE O CENÁRIO QUE SERÁ MOSTRADO NOS GRÁFICOS COMPARATIVOS  ////////
///////////////////////////////////////////////////////////////
function eye(c) {
	for (i = 0; i < scenarioChart.data.datasets.length; i++) {
		if (scenarioChart.data.datasets[i].label == "S-" + c) {
			if (scenarioChart.data.datasets[i].hidden) {
				scenarioChart.data.datasets[i].hidden = false;
				costChart.data.datasets[i].hidden = false;
				paretoAChart.data.datasets[i].hidden = false;
				paretoBChart.data.datasets[i].hidden = false;
				document.getElementById("eye-" + c).style.color = "#1997c6";
			} else {
				scenarioChart.data.datasets[i].hidden = true;
				costChart.data.datasets[i].hidden = true;
				paretoAChart.data.datasets[i].hidden = true;
				paretoBChart.data.datasets[i].hidden = true;
				document.getElementById("eye-" + c).style.color = "rgba(155,155,155,0.7)";
			}
		}
		scenarioChart.update();
		costChart.update();
		paretoAChart.update();
		paretoBChart.update();
	}
}

///////////////////////////////////////////////////////////////
//////// CRIA OS ALERTAS PARA O USUÁRIO  ////////
///////////////////////////////////////////////////////////////
function myAlert(message) {
	document.getElementById("alertBackground").style.display = "block";
	document.getElementById("myMessage").innerHTML = message;
}


function myAlertClose() {
	document.getElementById("alertBackground").style.display = "none";

}



///////////////////////////////////////////////////////////////
//////// GERA OS LOGS ////////
///////////////////////////////////////////////////////////////
tamanhos = [0, 50, 100, 200, 360];
var log1 = 0;
function writeLog() {
	line = "";
	line += CENARIO_ATUAL + ";";
	line += newSceType + ";";
	line += (window[CENARIO_ATUAL + "_wCost"] * 100).toFixed(0) + " / " + (window[CENARIO_ATUAL + "_wKA"] * 100).toFixed(0) + ";";
	line += "$ " + window[CENARIO_ATUAL + "_COSTS"].formatMoney(0, '.', ' ') + ";";
	line += window[CENARIO_ATUAL + "_SL_KA"].toFixed(0) + " km" + ";";
	line += window[CENARIO_ATUAL + "_SL_OTHERS"].toFixed(0) + " km" + ";";

	for (z = 0; z < 21; z++) {
		asterisco = "";
		for (g = 0; g < 5; g++) {
			if (window[CENARIO_ATUAL + "_Z_" + z + "_" + g] !== undefined) {
				if (window[CENARIO_ATUAL + "_userZ_" + z] != "?") {
					asterisco = "*";
				}
				line += tamanhos[g] + asterisco + ";";
			}
		}
	}
	line += "\n";


	xhttpB.open("POST", "log.php");
	xhttpB.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttpB.send("line=" + encodeURIComponent(line) + "&log=" + log1 + "&logName=" + logName + "&c=" + c_atual);
}

var xhttpB = new XMLHttpRequest();
xhttpB.onreadystatechange = function () {
	if (this.readyState == 4 && this.status == 200) {
		log1 = 1;

	}


//	console.log(line);

}


var nLogDate = new Date();
var nLogDate_dia = nLogDate.getDate();
var nLogDate_mes = nLogDate.getMonth() + 1;
var nLogDate_ano = nLogDate.getFullYear();
var nLogDate_hora = nLogDate.getHours();
var nLogDate_minuto = nLogDate.getMinutes();

logName = nLogDate_ano + "_" + nLogDate_mes + "_" + nLogDate_dia + "_" + nLogDate_hora + "_" + nLogDate_minuto;


////////////////////////////////////////////////////////////////
///////////////// ARCOS ////////////////////////////////////////
////////////////////////////////////////////////////////////////

route = L.layerGroup();
route_FAV = L.layerGroup();

function mostra_arcos_destino(p){
	route = L.layerGroup();
	route_FAV = L.layerGroup();

	for(i=0; i < 47; i++){
		if(pontos[i][0] == p){
			p = i
		}
	}


		for(i=0; i < 47; i++){
			for(j=0; j < 47; j++){
				if(window[CENARIO_ATUAL + "_X_" + i + "_" + j + "_" + p]!== undefined){
					origem = pontos[i]
					destino = pontos[j]
					
					L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { 
						weight: 6,
						color: "blue", 
		
					}).addTo(route);
				}
			}
		}
		


		for(i=0; i < 47; i++){
			for(j=0; j < 47; j++){
				if(window[CENARIO_ATUAL_FAV + "_X_" + i + "_" + j + "_" + p]!== undefined){
					origem = pontos[i]
					destino = pontos[j]
					
					L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { 
						weight: 6,
						color: "blue", 
		
					}).addTo(route_FAV);
				}
			}
		}

	
	
	route.addTo(map);
	route_FAV.addTo(map2);
}

const pontos = []
pontos[0] = ["Narziglia", "MODM", 36.618981, 43.309526, '3158']
pontos[1] = ["Zelikan", "MODM", 36.488783, 43.514031, '266']
pontos[2] = ["Hasansham-U3", "UNHCR", 36.29206, 43.7345, '1936']
pontos[3] = ["Hasansham-M2", "MODM", 36.36927, 43.70412, '5953']
pontos[4] = ["Hasansham-M1", "MODM", 36.32807, 43.62371, '1560']
pontos[5] = ["Chamakor", "UNHCR", 36.25312, 43.52575, '2400']
pontos[6] = ["Hasansham-U2", "UNHCR", 36.17539, 43.60234, '7000']
pontos[7] = ["Debaga-2", "UNHCR", 35.90406, 43.82184, '1500']
pontos[8] = ["Debaga-1", "MODM", 35.86897, 43.92656, '2397']
pontos[9] = ["Debaga-Std", "UNHCR", 35.79546, 43.83048, '400']
pontos[10] = ["Hammam-al-Alil-1", "UNHCR", 36.10413083, 43.23802722, '4000']
pontos[11] = ["Hammam-al-Alil-2", "MODM", 36.16203389, 43.24697056, '4672']
pontos[12] = ["As-Salamyiah", "2: N.Gov&UNHCR", 36.153736, 43.320886, '6544']
pontos[13] = ["Qayyarah-Air", "IOM", 35.787337, 43.308476, '10000']
pontos[14] = ["Qayyarah-Jad-ah", "MODM", 35.742061, 43.265796, '15350']
pontos[15] = ["Haj-Ali", "IOM", 35.721975, 43.3320083, '7435']
pontos[16] = ["Laylan-1", "UNHCR", 35.32956667, 44.53015972, '949']
pontos[17] = ["Laylan-2", "MODM", 35.32956667, 44.45015972, '810']
pontos[18] = ["Al-Shamah-1", "UNDP", 34.8272554, 43.4583479, '415']
pontos[19] = ["Al-Alam-1", "2: MoMD&UNHCR", 34.82321, 43.60615, '1250']
pontos[20] = ["Al-Alam-2", "UNHCR", 34.898708, 43.578686, '500']
pontos[21] = ["Al-Alam-3", "MODM", 34.7387, 43.62263, '750']
pontos[22] = ["Al-Shamah-2", "MODM",	34.7327474, 43.4583479, '715']
pontos[23] = ["Qaymawa", "UNHCR", 36.40342, 43.54424, '1030']

pontos[24] = ["Erbil", "", 36.20629, 44.00886, ""]
pontos[25] = ["Dahuk", "", 36.8679, 42.94748, ""]
pontos[26] = ["Tikrit", "", 34.61872, 43.65672, ""]
pontos[27] = ["Kirkuk", "", 35.46557, 44.38039, ""]
pontos[28] = ["Al-Hamdaniya", "", 36.17912, 43.40001, ""]

pontos[29] = [,,34.77365, 43.53829]
pontos[30] = [,,35.03648, 43.48082]
pontos[31] = [,,35.38144, 44.16471]
pontos[32] = [,,35.40159, 44.48606]
pontos[33] = [,,35.486, 43.33114]
pontos[34] = [,,35.77175, 43.89555]
pontos[35] = [,,36.47387, 43.56936]
pontos[36] = [,,35.85093, 43.86232]
pontos[37] = [,,35.78077, 43.12211]
pontos[38] = [,,35.92325, 43.40913]
pontos[39] = [,,36.05659, 43.4911]
pontos[40] = [,,36.11874, 43.10659]
pontos[41] = [,,36.35094, 43.25351]
pontos[42] = [,,36.32773, 43.68564]
pontos[43] = [,,36.22581, 43.57029]
pontos[44] = [,,36.27675, 43.64994]
pontos[45] = [,,36.64035, 43.49556]
pontos[46] = [,, 35.78809, 43.36956]      


const c_arco = []
c_arco[0] = [pontos[29], pontos[26],'black']
c_arco[1] = [pontos[29], pontos[30],'black']
c_arco[2] = [pontos[29], pontos[22],'black']
c_arco[3] = [pontos[29], pontos[18],'black']
c_arco[4] = [pontos[29], pontos[20],'black']
c_arco[5] = [pontos[29], pontos[19],'black']
c_arco[6] = [pontos[29], pontos[21],'black']
c_arco[7] = [pontos[26], pontos[31],'black']
c_arco[8] = [pontos[27], pontos[31],'black']
c_arco[9] = [pontos[32], pontos[31],'black']   
c_arco[10] = [pontos[32], pontos[27],'black']   
c_arco[11] = [pontos[32], pontos[16],'black']  
c_arco[12] = [pontos[32], pontos[17],'black']  
c_arco[13] = [pontos[31], pontos[30],'black']  
c_arco[14] = [pontos[33], pontos[30],'black']  
c_arco[15] = [pontos[31], pontos[34],'black']   
c_arco[16] = [pontos[31], pontos[34],'black']  
c_arco[17] = [pontos[46], pontos[36],'black']  
c_arco[18] = [pontos[23], pontos[35],'black']   
c_arco[19] = [pontos[27], pontos[34],'black']  
c_arco[20] = [pontos[7], pontos[36],'black']   
c_arco[21] = [pontos[8], pontos[36],'black']     
c_arco[22] = [pontos[9], pontos[36],'black'] 
c_arco[23] = [pontos[34], pontos[36],'black']         
c_arco[24] = [pontos[33], pontos[37],'black']   
c_arco[25] = [pontos[13], pontos[37],'black']   
c_arco[26] = [pontos[14], pontos[37],'black'] 
c_arco[27] = [pontos[15], pontos[46],'black']  
c_arco[28] = [pontos[37], pontos[38],'black'] 
c_arco[29] = [pontos[39], pontos[38],'black']         
c_arco[30] = [pontos[39], pontos[36],'black'] 
c_arco[31] = [pontos[24], pontos[36],'black'] 
c_arco[32] = [pontos[24], pontos[27],'black'] 
c_arco[33] = [pontos[24], pontos[39],'black'] 
c_arco[34] = [pontos[28], pontos[12],'black'] 
c_arco[35] = [pontos[40], pontos[38],'black'] 
c_arco[36] = [pontos[40], pontos[10],'black'] 
c_arco[37] = [pontos[40], pontos[11],'black'] 
c_arco[38] = [pontos[40], pontos[41],'black'] 
c_arco[39] = [pontos[28], pontos[41],'black'] 
c_arco[40] = [pontos[25], pontos[41],'black'] 
c_arco[41] = [pontos[25], pontos[0],'black'] 
c_arco[42] = [pontos[42], pontos[2],'black'] 
c_arco[43] = [pontos[42], pontos[3],'black'] 
c_arco[44] = [pontos[42], pontos[4],'black'] 
c_arco[45] = [pontos[43], pontos[5],'black'] 
c_arco[46] = [pontos[43], pontos[6],'black'] 
c_arco[47] = [pontos[43], pontos[44],'black'] 
c_arco[48] = [pontos[43], pontos[28],'black'] 
c_arco[49] = [pontos[44], pontos[42],'black'] 
c_arco[50] = [pontos[44], pontos[41],'black'] 
c_arco[51] = [pontos[39], pontos[28],'black'] 
c_arco[52] = [pontos[15], pontos[33],'black'] 
c_arco[53] = [pontos[24], pontos[44],'black'] 
c_arco[54] = [pontos[1], pontos[35],'black']     
c_arco[55] = [pontos[0], pontos[41],'black']   
c_arco[56] = [pontos[0], pontos[45],'black'] 
c_arco[57] = [pontos[24], pontos[45],'black'] 
c_arco[58] = [pontos[35], pontos[45],'black'] 
c_arco[59] = [pontos[35], pontos[42],'black'] 
c_arco[60] = [pontos[35], pontos[41],'black'] 
c_arco[61] = [pontos[46], pontos[38],'black'] 

checkPoints = L.layerGroup();

function mostra_checkpoints(){
	
		
		checkPoints.removeFrom(map);
		checkPoints = "";		
		checkPoints = L.layerGroup();




			for(i=0; i < 47; i++){
				for(j=0; j < 47; j++){
					if(window["CP_" + i + "_" + j]!== undefined){
						if(window["CP_" + i + "_" + j] == 1){
							origem = pontos[i]
							destino = pontos[j]
							
							L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { 
								weight: 8,
								color: "red", 
				
							}).addTo(checkPoints);
						}
					}
				}
			}
			



		
		
		checkPoints.addTo(map);
		

	
}

$.getScript("results/checkpoints.js", function () {
	mostra_checkpoints()
});

MudaCheckPoints = L.layerGroup();

function altera_checkpoints(){
	MudaCheckPoints.removeFrom(map);
	MudaCheckPoints = "";		
	MudaCheckPoints = L.layerGroup();

	c_arco.forEach(function (e, i) {
        origem = e[0]
		destino = e[1]
		
		a = encontra_ponto(origem)
		b = encontra_ponto(destino)

		L.marker([(origem[2] + destino[2])/2, (origem[3] + destino[3])/2], {
            icon: L.divIcon({
                iconSize: new L.Point(130),
                iconAnchor: new L.Point(-1, 50),
                html: `<div onclick = "muda_checkpoint(` + a + `,` + b  + `)"> <i class="checkPoint fas fa-circle"></i> </div>`,
                className: `divCheckPoint`
            })

        }).addTo(MudaCheckPoints)
	})
	

	MudaCheckPoints.addTo(map);
}

function encontra_ponto(p){
	//console.log(p)
	for(i=0; i < 47; i++){
		if(pontos[i][2] == p[2] && pontos[i][3] == p[3]){
			return i
		}
	}

}

function muda_checkpoint(a,b){
	if(window["CP_"  + a + "_" + b] === undefined){
		if(window["CP_"  + b + "_" + a] === undefined){
			window["CP_" + a + "_" + b] = 0
		}
	}

	if(window["CP_"  + a + "_" + b] === undefined){
		if(window["CP_"  + b + "_" + a] !== undefined){
			window["CP_" + a + "_" + b] = window["CP_" + b + "_" + a]
			window["CP_" + b + "_" + a] = 0
		}
	}



	if(window["CP_" + a + "_" + b] == 0){
		window["CP_" + a + "_" + b] = 1
	}else if(window["CP_" + a + "_" + b] == 1){
		window["CP_" + a + "_" + b] = 0
	}
	mostra_checkpoints()
	salva_checkpoints()
	
}

var xhttpJ = new XMLHttpRequest();
function salva_checkpoints(){
	
	cPoints = "";
	glue = ""
	for(i=0; i < 47; i++){
		for(j=0; j < 47; j++){
			if(window["CP_" + i + "_" + j]!== undefined){
				if(window["CP_" + i + "_" + j] == 1){
					cPoints = cPoints + glue + i + "," + j
					glue = "|"
				}
			}
		}
	}


	xhttpJ.open("POST", "salvaCheckpoints.php");
	xhttpJ.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttpJ.send("cPoints=" + encodeURIComponent(cPoints));


}

routeCD = L.layerGroup();
routeCD_FAV = L.layerGroup();

function mostra_arcos_origem(p){
	routeCD = L.layerGroup();
	routeCD_FAV = L.layerGroup();

	for(i=0; i < 47; i++){
		if(pontos[i][0] == p){
			p = i
		}
	}


		for(i=0; i < 47; i++){
			for(j=0; j < 47; j++){
				if(window[CENARIO_ATUAL + "_X_" + p + "_" + j + "_" + i]!== undefined){
					origem = pontos[p]
					destino = pontos[i]
					
					L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { 
						weight: 4,
						color: "green", 
		
					}).addTo(routeCD);
				}
			}
		}
		


		for(i=0; i < 47; i++){
			for(j=0; j < 47; j++){
				if(window[CENARIO_ATUAL_FAV + "_X_" + p + "_" + j + "_" + i]!== undefined){
					origem = pontos[p]
					destino = pontos[i]
					
					L.curve(['M', [origem[2], origem[3]], 'L', [destino[2], destino[3]]], { 
						weight: 4,
						color: "green", 
		
					}).addTo(routeCD_FAV);
				}
			}
		}

	
	
	routeCD.addTo(map);
	routeCD_FAV.addTo(map2);
}

function rateia_custo(){

qtdCampos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

demandaCampos = [2084.28,175.56,1277.76,3928.98,4620,1584,1029.6,990,1582.02,264,3083.52,2640,4319.04,6600,10131,4907.1,626.34,534.6,273.9,825,330,495,471.9,679.8,0,0,0,0,0]

rateio = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

custo_fixo = [0, 195480, 209700, 270210, 304830, 173824, 190861, 273367]

custo_fixo_agencia = [0,0,0]


	for(i=0; i < 29; i++){
		for(j=0; j < 47; j++){
			for(n=0; n < 47; n++){
				if(window[CENARIO_ATUAL + "_X_" + i + "_" + j + "_" + n]!== undefined){
					qtdCampos[i] += window[CENARIO_ATUAL + "_X_" + i + "_" + j + "_" + n]
					rateio[i][n] += window[CENARIO_ATUAL + "_X_" + i + "_" + j + "_" + n]
				}
			}
		}
	}

	for(i=0; i < 29; i++){
		if(window[CENARIO_ATUAL + "_Z_" + i + "_0"] === undefined){
			qtdCampos[i] += demandaCampos[i]
			rateio[i][i] += demandaCampos[i] 
		}
		
	}

	for(i=0; i < 29; i++){
		for(j=0; j < 47; j++){
			if(qtdCampos[i] > 0){
				rateio[i][j] = rateio[i][j]/qtdCampos[i] 
			}
			
	
		}
	}

	for(i=0; i < 29; i++){
		for(j=0; j < 7; j++){
			if(window[CENARIO_ATUAL + "_Z_" + i + "_" + j]!== undefined){
				for(n=0; n < 47; n++){
					rateio[i][n] = rateio[i][n]*custo_fixo[j] 
				}
			}
		}
	}


		for(i=0; i < 29; i++){
			for(j=0; j < 47; j++){
				if(aA.indexOf(j) != -1){
					custo_fixo_agencia[0] += rateio[i][j]
				}else if(aB.indexOf(j) != -1){
					custo_fixo_agencia[1] += rateio[i][j]
				}else{
					custo_fixo_agencia[2] += rateio[i][j]
				}

			}
		}
	
	if(window[CENARIO_ATUAL + "_RTA"] === undefined){
		window[CENARIO_ATUAL + "_RTA"] = 0
	}
	if(window[CENARIO_ATUAL + "_RTB"] === undefined){
		window[CENARIO_ATUAL + "_RTB"] = 0
	}
	if(window[CENARIO_ATUAL + "_RTC"] === undefined){
		window[CENARIO_ATUAL + "_RTC"] = 0
	}

	window[CENARIO_ATUAL + "_RTA"] += custo_fixo_agencia[0]
	window[CENARIO_ATUAL + "_RTB"] += custo_fixo_agencia[1]
	window[CENARIO_ATUAL + "_RTC"] += custo_fixo_agencia[2]

	window[CENARIO_ATUAL + "_LTA"] = 0
	window[CENARIO_ATUAL + "_LTB"] = 0
	window[CENARIO_ATUAL + "_LTC"] = 0
	
	window[CENARIO_ATUAL + "_CPA"] = 0
	window[CENARIO_ATUAL + "_CPB"] = 0
	window[CENARIO_ATUAL + "_CPC"] = 0	

	window[CENARIO_ATUAL + "_LTA_txt"] = ""
	window[CENARIO_ATUAL + "_LTB_txt"] = ""
	window[CENARIO_ATUAL + "_LTC_txt"] = ""
	
	window[CENARIO_ATUAL + "_CPA_txt"] = ""
	window[CENARIO_ATUAL + "_CPB_txt"] = ""
	window[CENARIO_ATUAL + "_CPC_txt"] = ""
	
	for(i=0; i < 29; i++){
		if(aA.indexOf(i) != -1){
			if(window[CENARIO_ATUAL + "_mWcampo_" + i] > window[CENARIO_ATUAL + "_LTA"]){
				window[CENARIO_ATUAL + "_LTA"] = window[CENARIO_ATUAL + "_mWcampo_" + i]
			}
		}else if(aB.indexOf(i) != -1){
			if(window[CENARIO_ATUAL + "_mWcampo_" + i] > window[CENARIO_ATUAL + "_LTB"]){
				window[CENARIO_ATUAL + "_LTB"] = window[CENARIO_ATUAL + "_mWcampo_" + i]
			}
		}else{
			if(window[CENARIO_ATUAL + "_mWcampo_" + i] > window[CENARIO_ATUAL + "_LTC"]){
				window[CENARIO_ATUAL + "_LTC"] = window[CENARIO_ATUAL + "_mWcampo_" + i]
			}
		}
	}

	for(i=0; i < 29; i++){
		if(window[CENARIO_ATUAL + "_nYcampo_" + i] !== undefined){
			if(aA.indexOf(i) != -1){
				if(window[CENARIO_ATUAL + "_nYcampo_" + i] != window[CENARIO_ATUAL + "_CPA"]){
					window[CENARIO_ATUAL + "_CPA"] = window[CENARIO_ATUAL + "_nYcampo_" + i]
				}
			}else if(aB.indexOf(i) != -1){
				if(window[CENARIO_ATUAL + "_nYcampo_" + i] > window[CENARIO_ATUAL + "_CPB"]){
					window[CENARIO_ATUAL + "_CPB"] = window[CENARIO_ATUAL + "_nYcampo_" + i]
				}
			}else{
				if(window[CENARIO_ATUAL + "_nYcampo_" + i] > window[CENARIO_ATUAL + "_CPC"]){
					window[CENARIO_ATUAL + "_CPC"] = window[CENARIO_ATUAL + "_nYcampo_" + i]
				}
			}
		}
	}

	for(i=0; i < 29; i++){
		if(window[CENARIO_ATUAL + "_mWcampo_" + i] !== undefined){
			if(aA.indexOf(i) != -1){
				window[CENARIO_ATUAL + "_LTA_txt"] += pontos[i][0] + "  "+ window[CENARIO_ATUAL + "_mWcampo_" + i].toFixed(2) + "h<br>"
			}else if(aB.indexOf(i) != -1){
				window[CENARIO_ATUAL + "_LTB_txt"] += pontos[i][0]  + "  "+ + window[CENARIO_ATUAL + "_mWcampo_" + i].toFixed(2) + "h<br>"
			}else{
				window[CENARIO_ATUAL + "_LTC_txt"] += pontos[i][0]  + "  "+ + window[CENARIO_ATUAL + "_mWcampo_" + i].toFixed(2) + "h<br>"
			}
		}
	}

	for(i=0; i < 29; i++){
		if(window[CENARIO_ATUAL + "_nYcampo_" + i] !== undefined){
			if(aA.indexOf(i) != -1){
				window[CENARIO_ATUAL + "_CPA_txt"] += pontos[i][0] + "  "+ window[CENARIO_ATUAL + "_nYcampo_" + i].toFixed(2) + "CP<br>"
			}else if(aB.indexOf(i) != -1){
				window[CENARIO_ATUAL + "_CPB_txt"] += pontos[i][0]  + "  "+ + window[CENARIO_ATUAL + "_nYcampo_" + i].toFixed(2) + " CP<br>"
			}else{
				window[CENARIO_ATUAL + "_CPC_txt"] += pontos[i][0]  + "  "+ + window[CENARIO_ATUAL + "_nYcampo_" + i].toFixed(2) + " CP<br>"
			}
		}
	}

}
