<?php
error_reporting(E_ERROR ^ E_NOTICE);
require 'ExcelReader/reader.php';
$data = new Spreadsheet_Excel_Reader();
$data->setOutputEncoding('UTF-8');
$data->read('data/DATA_case_iraq.xls');

$citiesCanditates = array();

for ($i = 2; $i <= $data->sheets[0]['numRows']; $i++) {
	for ($j = 1; $j <= $data->sheets[0]['numCols']; $j++) {
		$celldata = utf8_encode((!empty($data->sheets[0]['cells'][$i][$j])) ? $data->sheets[0]['cells'][$i][$j] : "&nbsp;");
		$citiesCanditates[$i][$j] = $celldata;
	}
}

?>

<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Iraq Location Analysis Case</title>


	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/helium-css/1.1/helium.min.js"></script>


	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

	<!-- jquery UI -->
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
	<link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet">

	<!-- Bootstrap core -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>


	<!-- leaflet -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"></script>
	<script src="http://elfalem.github.io/Leaflet.curve/src/leaflet.curve.js"></script>


	<!-- Shapes jsons from brazil - Data from IBGE  -->
	<script type="text/javascript" src="jSon/mesoBrazil.json"></script>
	<script type="text/javascript" src="jSon/Estados_BR.json"></script>

	<script src="json/iraq.json"></script>

	<!-- font-awesome -->
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
            integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
	<!-- Google Icons -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

	<!-- charts js -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.js"></script>

	<!-- map specifc style -->
	<link rel="stylesheet" href="css/map.css">
	<link rel="stylesheet" href="css/iraq.css" crossorigin="anonymous">

</head>

<body>

	<div class="row" style="margin: 0px; " id="div-all">
		<div class="col-md-auto" id="menu-col">
			<div>
				<h2 style="margin-top:10px;     text-align: center;" class="">MAP CONTROLS</h2>
			</div>
			<div>
				<h3 class="">Zoom</h3>
			</div>
			<i class="fa fa-search-plus menuIcon1" aria-hidden="true" onClick="btnZoomIn()"></i>
			<i class="fa fa-search-minus menuIcon1" aria-hidden="true" onClick="btnZoomOut()"></i>

			<div>
				<h3 class="">Center</h3>
			</div>

			<i class="fa fa-crosshairs menuIcon1" aria-hidden="true" onClick="btnCenter()"></i>


			<div class="">
				<h3>Style</h3>
			</div>
			<img src="img/streets.png?4" style="max-width:5rem !important;margin: 0 6px 16px;" onclick="mapStyle('streets')" id="mapStreet">
			<img src="img/dark.png?4" style="max-width:5rem !important;margin: 0px 6px 14px;" onclick="mapStyle('dark')" id="mapDark" class="menuIconMap">

			

			<div class="">
				<h3>Service level</h3>
			</div>
			<i class="fas fa-hourglass-half menuIcon2" style="margin-bottom: 20px;" id="btnKA" onClick="btnMapColor(2)"></i>
			<i class="fas fa-clipboard-list menuIcon2" style="margin-bottom: 20px;" id="btnOT" onClick="btnMapColor(3)"></i>
			<br>

			<div class="">
				<h3>Routes</h3>
			</div>
			<i class="fa fa-cubes menuIcon2 menuIcon2Active" style="margin-bottom: 20px;" id="btnRoute1" onClick="btnRoute(1)"></i>
			<i class="fa fa-industry menuIcon2" style="margin-bottom: 20px;" id="btnRoute2" onClick="btnRoute(2)"></i>
			<br>

			<div class="">
				<h3>Warehouse sizes</h3>
			</div>

			<i class="material-icons menuIcon2" id="IDbtnbubble" style="margin-top:7px" onClick="btnBuble()">bubble_chart</i>
			<br>
			<div class="">
				<h3>CREATE A NEW SCENARIO</h3>
			</div>
			<div style="font-size:200%;width: 95%; text-align: center" class="menuIcon2 menuIcon2Active" onClick='newScenario("BLANK")'>Blank</div>
			<div style="font-size:200%; width: 95%;text-align: center; line-height: 1;" class="menuIcon2 menuIcon2Active" onClick='newScenario("FROM_THIS")'>From this</div>
			<br>
			<div class="">
				<h3>MOVE MENU</h3>
			</div>
			<i class="menuIcon1 fas fa-arrow-right" style="font-size: 360%;" onclick="menu(2)" id="move-1"></i>
			<i class="menuIcon1 fas fa-arrow-left" style="font-size: 360%;" onclick="menu(1)" id="move-2"></i>

			<i class="menuIcon1 fas fa-info-circle" style="font-size: 420%;margin-top: -12px;" onclick="info()"></i>
		</div>
		<div class="col" style=" margin: 0px; padding:0">
			<div class="row screen">
				<div class="col-6" style="border-right: 1px solid #999">
					<div class="row">
						<div class="col-12 textOnMap titleScenario">
							<div class="bpu" style="margin-top:15px">
								<h1 class="bpv bpw" id="cenarioAtual">CREATING A NEW SCENARIO</h1>
							</div>

						</div>
					</div>
					<div class="row" style="padding-bottom: 10px;">

						<div class="col-5 textOnMap titleScenario">
							<div class="bpu">
								<h3 style="margin-top:15px" class="bpv bpw">CRITERIA TREE</h3>
							</div>
							<div class="orgDiv">
								<table class="orgOBJ">
									<tr>
										<td></td>
										<td class="orgOBJTEXT" colspan=6>
											<h4><i class="fa fa-bullseye"> </i> Objective</h4>
										</td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
									<tr>
										<td style="width:76px"></td>
										<td style="width:76px"></td>
										<td></td>
										<td></td>
										<td style="border-right: 3px solid #1997c6;"></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
									<tr>

										<td style="border-right: 3px solid #1997c6;"></td>
										<td style="border-top: 3px solid #1997c6;" colspan=6>
											<input type="range" min="0" max="100" value="15" class="slider" id="rangeCOST-SL" oninput='range("rangeCOST-SL")'>
										</td>
										<td style="border-left: 3px solid #1997c6;"></td>
										<td></td>
										<td></td>
									</tr>
									<tr>

										<td class="orgOBJTEXT" colspan=2 rowspan=6 style="width: 155px; padding-bottom: 5px">
											<h4><i class="fas fa-dollar-sign"></i>  Total Cost</h4>
											<h4><i class="fas fa-weight-hanging"></i>&nbsp;&nbsp;<span class="weightValue" id="wCOST">85</span></h4>
											<canvas id="chartCost" style="width: 133px; height: 112px; "></canvas>
										</td>
										<td></td>
										<td></td>
										<td colspan=2></td>
										<td class="orgOBJTEXT" colspan=4 style="width: 130px;">
											<h4><i class="fas fa-shipping-fast"></i>  Service level</h4>
											<h4><i class="fas fa-weight-hanging"></i>&nbsp;&nbsp;<span class="weightValue" id="wSL">15</span></h4>
										</td>

										<td></td>

									</tr>
									<tr>
										<td></td>
										<td></td>
										<td style="width: 76px;" colspan=2></td>
										<td style="width: 76px;"></td>
										<td style="border-right: 3px solid #1997c6;"></td>
										<td></td>
										<td style="width: 76px;"></td>
										<td style="width: 76px;"></td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td style="border-right: 3px solid #1997c6;" colspan=2></td>
										<td style="border-top: 3px solid #1997c6;" colspan=4>
											<input type="range" min="0" max="100" value="20" class="slider" id="rangeKA-OT" oninput='range("rangeKA-OT")'>
										</td>
										<td style="border-left: 3px solid #1997c6;"></td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td class="orgOBJTEXT" colspan=3 rowspan=4 style="width: 155px; padding-bottom: 5px">
											<h4><i class="fas fa-hourglass-half"></i>  Lead time</h4>
											<h4><i class="fas fa-weight-hanging"></i>&nbsp;&nbsp;<span class="weightValue" id="wKA">80</span></h4>
											<canvas id="chartSL-KA" style="width: 133px; height: 112px; "></canvas>
										</td>
										<td></td>
										<td></td>
										<td class="orgOBJTEXT" colspan=2 rowspan=4 style="width: 155px; padding-bottom: 5px">
											<h4><i class="fas fa-clipboard-list"></i>  Checkpoints</h4>
											<h4><i class="fas fa-weight-hanging"></i>&nbsp;&nbsp;<span class="weightValue" id="wOT">20</span></h4>
											<canvas id="chartSL-OTHERS" style="width: 133px; height: 112px; "></canvas>
										</td>
									</tr>

									<tr>
										<td></td>
										<td></td>
										<td style="height:50px"></td>
										<td></td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
									<tr style="height: 70px;">
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>

								</table>

							</div>
						</div>
						<div class="col-7">
							<div class="bpu">
								<h3 style="margin-top:15px" class="bpv bpw">RESULTS</h3>
							</div>
							<div class="textOnMap divClick">
								<b>
									<h2>
										<div class="clickOptimize" onClick='callGurobi()'>Press to optimize</div>
									</h2>
								</b>
							</div>

							<div class="textOnMap divResults" style="float:left;">
								<div style="float:left;     width: 201px; display: none">

									<h3><b>Cost:</b> <span id="showCost"> --- </span></h3>
									<div id="statusCOST">
										<div class="marcadorTHIS"></div>
									</div>

									<div class="status"></div>

									<div id="favCOST">
										<div class="marcadorFav"></div>
									</div>

									<div style="clear: both;margin-bottom: 10px;"><span>WORST ($100 million)</span><span style="float: right">($89 million) BEST</span></div>

									<h3><b>SL Key accounts:</b> <span id="showKA"> --- </span></h3>
									<div id="statusKA">
										<div class="marcadorTHIS"></div>
									</div>

									<div class="status"></div>

									<div id="favKA">
										<div class="marcadorFav"></div>
									</div>

									<div style="clear: both;margin-bottom: 10px;"><span>WORST (300 km)</span><span style="float: right">(0 km) BEST</span></div>

									<h3><b>SL Others:</b> <span id="showOthers"> --- </span></h3>
									<div id="statusOT">
										<div class="marcadorTHIS"></div>
									</div>

									<div class="status"></div>

									<div id="favOT">
										<div class="marcadorFav"></div>
									</div>

									<div style="clear: both;margin-bottom: 10px;"><span>WORST (500 km)</span><span style="float: right">(0 km) BEST</span></div>

									<div style="padding: 15px 0; text-align: center">
										<i class="fas fa-chart-pie menuIcon3" id="btnChartPie" onClick=btnChart("pie")></i>
										<i class="fas fa-chart-bar menuIcon3 menuIcon3Active" id="btnChartBar" onClick=btnChart("bar")></i>
									</div>


								</div>
								<div>
									<div class="box-pieChart" id="rCharte">
										<canvas id="chartCOST" height="300"></canvas>
										<span id = 'chart1' style="font-size: 308%;  color: rgb(159, 134, 255);; margin-top: 0; margin-left: 89px; position: relative; bottom: 33px; font-weight: bold;">#1</span>
										<i id="rchartaward1" class="fas fa-award" style="font-size: 308%; color: yellow; margin-top: -8px; margin-left: 156px;position: relative; bottom: 55px;"></i>
									</div>
									<div class="box-pieChart" id="rCharta">
										<canvas id="chartKA" height="300"></canvas>
										<span id = 'chart2' style="font-size: 308%;  color: rgb(159, 134, 255);; margin-top: 0; margin-left: 89px; position: relative; bottom: 33px; font-weight: bold;">#1</span>
										<i id="rchartaward1" class="fas fa-award" style="font-size: 308%; color: yellow; margin-top: -8px; margin-left: 156px;position: relative; bottom: 55px;"></i>
									</div>
									<div class="box-pieChart" id="rChartb">
										<canvas height="300" id="chartOT"></canvas>
										<span id = 'chart3' style="font-size: 308%;  color: rgb(159, 134, 255);; margin-top: 0; margin-left: 89px; position: relative; bottom: 33px; font-weight: bold;">#1</span>
										<i id="rchartaward2" class="fas fa-award" style="font-size: 308%; color: yellow; margin-top: -8px; margin-left: 156px;position: relative; bottom: 55px;"></i>
									</div><br>
									<div class="box-pieChart" id="rChartc">
										<canvas id="chartPIEa" height="150"></canvas>

									</div>
									<div class="box-pieChart" id="rChartd">
										<canvas height="150" id="chartPIEb"></canvas>

									</div>
									<div style = "float:left; margin-top: 8px; margin-left: 45px; margin-right: 218px">
										<h3><span style="background:rgba(204,102,153,1); border-radius: 3px">&nbsp;&nbsp;&nbsp;</span> Agency A</h3>
										<h3><span style="background:rgba(51,153,153,1); border-radius: 3px; margin: 3px 0">&nbsp;&nbsp;&nbsp;</span> Agency B</h3>
										<h3><span style="background:rgba(255,255,153,1); border-radius: 3px; margin: 3px 0">&nbsp;&nbsp;&nbsp;</span> Agency C</h3>
										
									</div>									
									<div style = "float:left; margin-top: 15px">
										<h3><span style="background:rgba(169,208,142,1); border-radius: 3px">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; < 1</h3>
										<h3><span style="background:rgba(155,194,230,1); border-radius: 3px; margin: 3px 0">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; < 3 </h3>
										<h3><span style="background:rgba(255,129,129,1); border-radius: 3px; margin: 3px 0">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp; > 3 </h3>
									</div>
									<div style="padding: 15px 0; text-align: center; display:none ">
										<i class="fas fa-chart-pie menuIcon3" id="btnChartPie" onClick=btnChart("pie")></i>
										<i class="fas fa-chart-bar menuIcon3 menuIcon3Active" id="btnChartBar" onClick=btnChart("bar")></i>
									</div>

								</div>
							</div>
						</div>

					</div>
					<div class="row">
						<div class="col-md-auto" style="    padding-right: 6px; padding-left: 6px;;     width: 396px; float:left">
							<div class="bpu">
								<h2 style="margin-top:15px" class="bpv bpw" id="wareLIST">CANDIDATES SITES</h2>
							</div>
							<div class="wareLISTdiv">
							
<div style = "width: 384px;     height: 194px;">
<div class="bpu"><h3 style="margin-top:15px" class="bpv bpw" id="wareLIST">CITIES</h3></div>
<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">
		<div class = 'listWare listWareActive' onmouseover = "destacaIcon('Erbil','---')" onmouseout =  "destacaIcon2('Erbil')">
		<h4 style = 'display:none' id = 'listSort-0'></h4>
		<h5 style = 'display:none'>Erbil</h5>
		<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
		Erbil<br><span id = 'favorito-0' class = 'cityNames favorito'></span>
		</span>
		<span id = 'list-lock-0' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
		<span id = 'list-4-0' class = 'cityNames noSelect' onclick = "setWare(0,'4')">&nbsp;3&nbsp;</span>
		<span id = 'list-3-0' class = 'cityNames noSelect' onclick = "setWare(0,'3')">&nbsp;2&nbsp;</span>
		<span id = 'list-2-0' class = 'cityNames noSelect' onclick = "setWare(0,'2')">&nbsp;1&nbsp;</span>
		<span id = 'list-0-0' class = 'cityNames'			onclick = "setWare(0,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
		<span id = 'list-1-0' class = 'cityNames noSelect' onclick = "setWare(0,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
		</h3></div>

		<div class = 'listWare listWareActive' onmouseover = "destacaIcon('Dahuk','---')" onmouseout =  "destacaIcon2('Dahuk')">
		<h4 style = 'display:none' id = 'listSort-1'></h4>
		<h5 style = 'display:none'>Dahuk</h5>
		<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
		Dahuk<br><span id = 'favorito-1' class = 'cityNames favorito'></span>
		</span>
		<span id = 'list-lock-1' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
		<span id = 'list-4-1' class = 'cityNames noSelect' onclick = "setWare(1,'4')">&nbsp;3&nbsp;</span>
		<span id = 'list-3-1' class = 'cityNames noSelect' onclick = "setWare(1,'3')">&nbsp;2&nbsp;</span>
		<span id = 'list-2-1' class = 'cityNames noSelect' onclick = "setWare(1,'2')">&nbsp;1&nbsp;</span>
		<span id = 'list-0-1' class = 'cityNames'			onclick = "setWare(1,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
		<span id = 'list-1-1' class = 'cityNames noSelect' onclick = "setWare(1,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
		</h3></div>

		<div class = 'listWare listWareActive' onmouseover = "destacaIcon('Tikrit','---')" onmouseout =  "destacaIcon2('Tikrit')">
		<h4 style = 'display:none' id = 'listSort-2'></h4>
		<h5 style = 'display:none'>Tikrit</h5>
		<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
		Tikrit<br><span id = 'favorito-2' class = 'cityNames favorito'></span>
		</span>
		<span id = 'list-lock-2' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
		<span id = 'list-4-2' class = 'cityNames noSelect' onclick = "setWare(2,'4')">&nbsp;3&nbsp;</span>
		<span id = 'list-3-2' class = 'cityNames noSelect' onclick = "setWare(2,'3')">&nbsp;2&nbsp;</span>
		<span id = 'list-2-2' class = 'cityNames noSelect' onclick = "setWare(2,'2')">&nbsp;1&nbsp;</span>
		<span id = 'list-0-2' class = 'cityNames'			onclick = "setWare(2,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
		<span id = 'list-1-2' class = 'cityNames noSelect' onclick = "setWare(2,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
		</h3></div>

	</div>
	<div style = "width: 185px; 171px; float:left">
		<div class = 'listWare listWareActive' onmouseover = "destacaIcon('Kirkuk','---')" onmouseout =  "destacaIcon2('Kirkuk')">
		<h4 style = 'display:none' id = 'listSort-3'></h4>
		<h5 style = 'display:none'>Kirkuk</h5>
		<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
		Kirkuk<br><span id = 'favorito-3' class = 'cityNames favorito'></span>
		</span>
		<span id = 'list-lock-3' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
		<span id = 'list-4-3' class = 'cityNames noSelect' onclick = "setWare(3,'4')">&nbsp;3&nbsp;</span>
		<span id = 'list-3-3' class = 'cityNames noSelect' onclick = "setWare(3,'3')">&nbsp;2&nbsp;</span>
		<span id = 'list-2-3' class = 'cityNames noSelect' onclick = "setWare(3,'2')">&nbsp;1&nbsp;</span>
		<span id = 'list-0-3' class = 'cityNames'			onclick = "setWare(3,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
		<span id = 'list-1-3' class = 'cityNames noSelect' onclick = "setWare(3,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
		</h3></div>

		<div class = 'listWare listWareActive' onmouseover = "destacaIcon('Al-Hamdaniya','---')" onmouseout =  "destacaIcon2('Al-Hamdaniya')">
		<h4 style = 'display:none' id = 'listSort-4'></h4>
		<h5 style = 'display:none'>Al-Hamdaniya</h5>
		<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
		Al-Hamdaniya<br><span id = 'favorito-4' class = 'cityNames favorito'></span>
		</span>
		<span id = 'list-lock-4' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
		<span id = 'list-4-4' class = 'cityNames noSelect' onclick = "setWare(4,'4')">&nbsp;3&nbsp;</span>
		<span id = 'list-3-4' class = 'cityNames noSelect' onclick = "setWare(4,'3')">&nbsp;2&nbsp;</span>
		<span id = 'list-2-4' class = 'cityNames noSelect' onclick = "setWare(4,'2')">&nbsp;1&nbsp;</span>
		<span id = 'list-0-4' class = 'cityNames'			onclick = "setWare(4,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
		<span id = 'list-1-4' class = 'cityNames noSelect' onclick = "setWare(4,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
		</h3></div>
		
</div>
</div>

<div style = "width: 384px;     height: 261px;">
<div class="bpu"><h3 style="margin-top:15px" class="bpv bpw" id="wareLIST">Agency A</h3></div>
<h3>Coop:  <i id = "coop-0-Y" class="menuIcon2 menuIcon2Active coop coopActive" style="margin-bottom: 20px; padding: 1px; font-size: 100%;"  onclick = "setCoop('0', 'Yes')">Yes</i>
		   <i id = "coop-0-N" class="menuIcon2 coop" style="margin-bottom: 20px; ; padding: 1px; font-size: 100%;" onclick = "setCoop('0', 'No')">No</i>
			</h3>

<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">

<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Al-Alam-1','1250')" onmouseout =  "destacaIcon2('Al-Alam-1')">
<h4 style = 'display:none' id = 'listSort-24'></h4>
<h5 style = 'display:none'>Al-Alam 1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al-Alam 1<br><span id = 'favorito-24' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-24' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-24' class = 'cityNames noSelect' onclick = "setWare(24,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-24' class = 'cityNames noSelect' onclick = "setWare(24,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-24' class = 'cityNames noSelect' onclick = "setWare(24,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-24' class = 'cityNames noSelect' onclick = "setWare(24,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-24' class = 'cityNames'			onclick = "setWare(24,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-24' class = 'cityNames noSelect' onclick = "setWare(24,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Zelikan','266')" onmouseout =  "destacaIcon2('Zelikan')">
<h4 style = 'display:none' id = 'listSort-6'></h4>
<h5 style = 'display:none'>Zelikan</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Zelikan<br><span id = 'favorito-6' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-6' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-6' class = 'cityNames noSelect' onclick = "setWare(6,'5' )">&nbsp;7&nbsp;</span>
<span id = 'list-4-6' class = 'cityNames noSelect' onclick = "setWare(6,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-6' class = 'cityNames noSelect' onclick = "setWare(6,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-6' class = 'cityNames noSelect' onclick = "setWare(6,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-6' class = 'cityNames'			onclick = "setWare(6,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-6' class = 'cityNames noSelect' onclick = "setWare(6,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>



<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Hasansham-U3','1936')" onmouseout =  "destacaIcon2('Hasansham-U3')">
<h4 style = 'display:none' id = 'listSort-7'></h4>
<h5 style = 'display:none'>Hasansham U3</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hasansham U3<br><span id = 'favorito-7' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-7' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-7' class = 'cityNames noSelect' onclick = "setWare(7,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-7' class = 'cityNames noSelect' onclick = "setWare(7,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-7' class = 'cityNames noSelect' onclick = "setWare(7,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-7' class = 'cityNames noSelect' onclick = "setWare(7,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-7' class = 'cityNames'			onclick = "setWare(7,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-7' class = 'cityNames noSelect' onclick = "setWare(7,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Hammam-al-Alil-1','4000')" onmouseout =  "destacaIcon2('Hammam-al-Alil-1')">
<h4 style = 'display:none' id = 'listSort-15'></h4>
<h5 style = 'display:none'>Hammam al-Alil-1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hammam al-Alil-1<br><span id = 'favorito-15' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-15' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-15' class = 'cityNames noSelect' onclick = "setWare(15,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-15' class = 'cityNames noSelect' onclick = "setWare(15,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-15' class = 'cityNames noSelect' onclick = "setWare(15,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-15' class = 'cityNames noSelect' onclick = "setWare(15,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-15' class = 'cityNames'			onclick = "setWare(15,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-15' class = 'cityNames noSelect' onclick = "setWare(15,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>



</div>
<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">


<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Hasansham-M1','1560')" onmouseout =  "destacaIcon2('Hasansham-M1')">
<h4 style = 'display:none' id = 'listSort-9'></h4>
<h5 style = 'display:none'>Hasansham M1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hasansham M1<br><span id = 'favorito-9' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-9' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-9' class = 'cityNames noSelect' onclick = "setWare(9,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-9' class = 'cityNames noSelect' onclick = "setWare(9,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-9' class = 'cityNames noSelect' onclick = "setWare(9,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-9' class = 'cityNames noSelect' onclick = "setWare(9,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-9' class = 'cityNames'			onclick = "setWare(9,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-9' class = 'cityNames noSelect' onclick = "setWare(9,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>
<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Chamakor','2400')" onmouseout =  "destacaIcon2('Chamakor')">
<h4 style = 'display:none' id = 'listSort-10'></h4>
<h5 style = 'display:none'>Chamakor</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Chamakor<br><span id = 'favorito-10' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-10' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-10' class = 'cityNames noSelect' onclick = "setWare(10,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-10' class = 'cityNames noSelect' onclick = "setWare(10,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-10' class = 'cityNames noSelect' onclick = "setWare(10,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-10' class = 'cityNames noSelect' onclick = "setWare(10,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-10' class = 'cityNames'			onclick = "setWare(10,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-10' class = 'cityNames noSelect' onclick = "setWare(10,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Laylan-2','810')" onmouseout =  "destacaIcon2('Laylan-2')">
<h4 style = 'display:none' id = 'listSort-22'></h4>
<h5 style = 'display:none'>Laylan 2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Laylan<br><span id = 'favorito-22' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-22' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-22' class = 'cityNames noSelect' onclick = "setWare(22,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-22' class = 'cityNames noSelect' onclick = "setWare(22,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-22' class = 'cityNames noSelect' onclick = "setWare(22,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-22' class = 'cityNames noSelect' onclick = "setWare(22,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-22' class = 'cityNames'			onclick = "setWare(22,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-22' class = 'cityNames noSelect' onclick = "setWare(22,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>





<div class = 'listWare listWareActive agencyA' onmouseover = "destacaIcon('Debaga-2','1500')" onmouseout =  "destacaIcon2('Debaga-2')">
<h4 style = 'display:none' id = 'listSort-12'></h4>
<h5 style = 'display:none'>Debaga 2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Debaga 2<br><span id = 'favorito-12' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-12' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-12' class = 'cityNames noSelect' onclick = "setWare(12,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-12' class = 'cityNames noSelect' onclick = "setWare(12,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-12' class = 'cityNames noSelect' onclick = "setWare(12,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-12' class = 'cityNames noSelect' onclick = "setWare(12,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-12' class = 'cityNames'			onclick = "setWare(12,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-12' class = 'cityNames noSelect' onclick = "setWare(12,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

</div>
</div>

<div style = "width: 384px;     height: 212px;">
<div class="bpu"><h3 style="margin-top:15px" class="bpv bpw" id="wareLIST">Agency B</h3></div>

<h3>Coop:  <i id = "coop-1-Y" class="menuIcon2 menuIcon2Active coopActive coop" style="margin-bottom: 20px; padding:1px;     font-size: 100%;" onclick = "setCoop('1', 'Yes')">Yes</i>
			<i id = "coop-1-N" class="menuIcon2 coop" style="margin-bottom: 20px; ; padding: 1px;     font-size: 100%;" onclick = "setCoop('1', 'No')">No</i>
			</h3>
			<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">

			<div class = 'listWare listWareActive agencyB' onmouseover = "destacaIcon('Al-Shamah-1','415')" onmouseout =  "destacaIcon2('Al-Shamah-1')">
<h4 style = 'display:none' id = 'listSort-23'></h4>
<h5 style = 'display:none'>Al Shamah 1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al Shamah 1<br><span id = 'favorito-23' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-23' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-23' class = 'cityNames noSelect' onclick = "setWare(23,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-23' class = 'cityNames noSelect' onclick = "setWare(23,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-23' class = 'cityNames noSelect' onclick = "setWare(23,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-23' class = 'cityNames noSelect' onclick = "setWare(23,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-23' class = 'cityNames'			onclick = "setWare(23,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-23' class = 'cityNames noSelect' onclick = "setWare(23,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyB' onmouseover = "destacaIcon('Debaga-1','2397')" onmouseout =  "destacaIcon2('Debaga-1')">
<h4 style = 'display:none' id = 'listSort-13'></h4>
<h5 style = 'display:none'>Debaga 1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Debaga 1<br><span id = 'favorito-13' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-13' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-13' class = 'cityNames noSelect' onclick = "setWare(13,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-13' class = 'cityNames noSelect' onclick = "setWare(13,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-13' class = 'cityNames noSelect' onclick = "setWare(13,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-13' class = 'cityNames noSelect' onclick = "setWare(13,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-13' class = 'cityNames'			onclick = "setWare(13,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-13' class = 'cityNames noSelect' onclick = "setWare(13,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyB' onmouseover = "destacaIcon('Qayyarah-Jad-ah','15350')" onmouseout =  "destacaIcon2('Qayyarah-Jad-ah')">
<h4 style = 'display:none' id = 'listSort-19'></h4>
<h5 style = 'display:none'>Qayyarah Jad ah</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Qayyarah Jad ah<br><span id = 'favorito-19' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-19' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-19' class = 'cityNames noSelect' onclick = "setWare(19,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-19' class = 'cityNames noSelect' onclick = "setWare(19,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-19' class = 'cityNames noSelect' onclick = "setWare(19,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-19' class = 'cityNames noSelect' onclick = "setWare(19,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-19' class = 'cityNames'			onclick = "setWare(19,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-19' class = 'cityNames noSelect' onclick = "setWare(19,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


</div>
<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">

<div class = 'listWare listWareActive agencyB' onmouseover = "destacaIcon('Hammam-al-Alil-2','4672')" onmouseout =  "destacaIcon2('Hammam-al-Alil-2')">
<h4 style = 'display:none' id = 'listSort-16'></h4>
<h5 style = 'display:none'>Hammam al-Alil-2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hammam al-Alil-2<br><span id = 'favorito-16' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-16' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-16' class = 'cityNames noSelect' onclick = "setWare(16,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-16' class = 'cityNames noSelect' onclick = "setWare(16,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-16' class = 'cityNames noSelect' onclick = "setWare(16,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-16' class = 'cityNames noSelect' onclick = "setWare(16,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-16' class = 'cityNames'			onclick = "setWare(16,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-16' class = 'cityNames noSelect' onclick = "setWare(16,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyB' onmouseover = "destacaIcon('Al-Alam-3','750')" onmouseout =  "destacaIcon2('Al-Alam-3')">
<h4 style = 'display:none' id = 'listSort-26'></h4>
<h5 style = 'display:none'>Al-Alam 3</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al-Alam 3<br><span id = 'favorito-26' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-26' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-26' class = 'cityNames noSelect' onclick = "setWare(26,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-26' class = 'cityNames noSelect' onclick = "setWare(26,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-26' class = 'cityNames noSelect' onclick = "setWare(26,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-26' class = 'cityNames noSelect' onclick = "setWare(26,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-26' class = 'cityNames'			onclick = "setWare(26,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-26' class = 'cityNames noSelect' onclick = "setWare(26,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


</div>
</div>

<div style = "width: 384px;     height: 362px;">
<div class="bpu"><h3 style="margin-top:15px" class="bpv bpw" id="wareLIST">Agency C</h3></div>

<h3>Coop:  <i id = "coop-2-Y" class="menuIcon2 menuIcon2Active coopActive coop" style="margin-bottom: 20px; padding: 1px;     font-size: 100%;" onclick = "setCoop('2', 'Yes')">Yes</i>
			<i id = "coop-2-N" class="menuIcon2 coop" style="margin-bottom: 20px; ; padding: 1px;     font-size: 100%;" onclick = "setCoop('2', 'No')">No</i>
			</h3>


<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">

<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Narziglia','3158')" onmouseout =  "destacaIcon2('Narziglia')">
<h4 style = 'display:none' id = 'listSort-5'></h4>
<h5 style = 'display:none'>Narziglia</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Narziglia<br><span id = 'favorito-5' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-5' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>
<span id = 'list-5-5' class = 'cityNames noSelect' onclick = "setWare(5,'2')">&nbsp;7&nbsp;</span>
<span id = 'list-4-5' class = 'cityNames noSelect' onclick = "setWare(5,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-5' class = 'cityNames noSelect' onclick = "setWare(5,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-5' class = 'cityNames noSelect' onclick = "setWare(5,'2')">&nbsp;4&nbsp;</span>

<span id = 'list-0-5' class = 'cityNames'			onclick = "setWare(5,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-5' class = 'cityNames noSelect' onclick = "setWare(5,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Debaga-Std','400')" onmouseout =  "destacaIcon2('Debaga-Std')">
<h4 style = 'display:none' id = 'listSort-14'></h4>
<h5 style = 'display:none'>Debaga Std.</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Debaga Std.<br><span id = 'favorito-14' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-14' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-14' class = 'cityNames noSelect' onclick = "setWare(14,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-14' class = 'cityNames noSelect' onclick = "setWare(14,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-14' class = 'cityNames noSelect' onclick = "setWare(14,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-14' class = 'cityNames noSelect' onclick = "setWare(14,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-14' class = 'cityNames'			onclick = "setWare(14,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-14' class = 'cityNames noSelect' onclick = "setWare(14,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Qayyarah-Air','10000')" onmouseout =  "destacaIcon2('Qayyarah-Air')">
<h4 style = 'display:none' id = 'listSort-18'></h4>
<h5 style = 'display:none'>Qayyarah Air.</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Qayyarah Air.<br><span id = 'favorito-18' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-18' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-18' class = 'cityNames noSelect' onclick = "setWare(18,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-18' class = 'cityNames noSelect' onclick = "setWare(18,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-18' class = 'cityNames noSelect' onclick = "setWare(18,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-18' class = 'cityNames noSelect' onclick = "setWare(18,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-18' class = 'cityNames'			onclick = "setWare(18,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-18' class = 'cityNames noSelect' onclick = "setWare(18,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Haj-Ali','7435')" onmouseout =  "destacaIcon2('Haj-Ali')">
<h4 style = 'display:none' id = 'listSort-20'></h4>
<h5 style = 'display:none'>Haj Ali</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Haj Ali<br><span id = 'favorito-20' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-20' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-20' class = 'cityNames noSelect' onclick = "setWare(20,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-20' class = 'cityNames noSelect' onclick = "setWare(20,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-20' class = 'cityNames noSelect' onclick = "setWare(20,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-20' class = 'cityNames noSelect' onclick = "setWare(20,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-20' class = 'cityNames'			onclick = "setWare(20,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-20' class = 'cityNames noSelect' onclick = "setWare(20,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>
<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Laylan-1','949')" onmouseout =  "destacaIcon2('Laylan-1')">
<h4 style = 'display:none' id = 'listSort-21'></h4>
<h5 style = 'display:none'>Laylan 1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Laylan 1<br><span id = 'favorito-21' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-21' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-21' class = 'cityNames noSelect' onclick = "setWare(21,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-21' class = 'cityNames noSelect' onclick = "setWare(21,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-21' class = 'cityNames noSelect' onclick = "setWare(21,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-21' class = 'cityNames noSelect' onclick = "setWare(21,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-21' class = 'cityNames'			onclick = "setWare(21,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-21' class = 'cityNames noSelect' onclick = "setWare(21,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Al-Shamah-1','415')" onmouseout =  "destacaIcon2('Al-Shamah-1')">
<h4 style = 'display:none' id = 'listSort-23'></h4>
<h5 style = 'display:none'>Al Shamah 1</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al Shamah 1<br><span id = 'favorito-23' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-23' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-23' class = 'cityNames noSelect' onclick = "setWare(23,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-23' class = 'cityNames noSelect' onclick = "setWare(23,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-23' class = 'cityNames noSelect' onclick = "setWare(23,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-23' class = 'cityNames noSelect' onclick = "setWare(23,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-23' class = 'cityNames'			onclick = "setWare(23,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-23' class = 'cityNames noSelect' onclick = "setWare(23,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


</div>

<div style = "width: 185px;     height: 171px; float:left; margin-right: 6px;">





<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Al-Alam-2','500')" onmouseout =  "destacaIcon2('Al-Alam-2')">
<h4 style = 'display:none' id = 'listSort-25'></h4>
<h5 style = 'display:none'>Al-Alam 2</h5>


<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al-Alam 2<br><span id = 'favorito-25' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-25' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-25' class = 'cityNames noSelect' onclick = "setWare(25,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-25' class = 'cityNames noSelect' onclick = "setWare(25,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-25' class = 'cityNames noSelect' onclick = "setWare(25,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-25' class = 'cityNames noSelect' onclick = "setWare(25,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-25' class = 'cityNames'			onclick = "setWare(25,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-25' class = 'cityNames noSelect' onclick = "setWare(25,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>



<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Al-Shamah-2','715')" onmouseout =  "destacaIcon2('Al-Shamah-2')">
<h4 style = 'display:none' id = 'listSort-27'></h4>
<h5 style = 'display:none'>Al Shamah 2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Al Shamah 2<br><span id = 'favorito-27' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-27' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-27' class = 'cityNames noSelect' onclick = "setWare(27,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-27' class = 'cityNames noSelect' onclick = "setWare(27,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-27' class = 'cityNames noSelect' onclick = "setWare(27,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-27' class = 'cityNames noSelect' onclick = "setWare(27,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-27' class = 'cityNames'			onclick = "setWare(27,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-27' class = 'cityNames noSelect' onclick = "setWare(27,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>
<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Qaymawa','1030')" onmouseout =  "destacaIcon2('Qaymawa')">
<h4 style = 'display:none' id = 'listSort-28'></h4>
<h5 style = 'display:none'>Qaymawa</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Qaymawa<br><span id = 'favorito-28' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-28' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-28' class = 'cityNames noSelect' onclick = "setWare(28,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-28' class = 'cityNames noSelect' onclick = "setWare(28,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-28' class = 'cityNames noSelect' onclick = "setWare(28,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-28' class = 'cityNames noSelect' onclick = "setWare(28,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-28' class = 'cityNames'			onclick = "setWare(28,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-28' class = 'cityNames noSelect' onclick = "setWare(28,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>




<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Hasansham-M2','5953')" onmouseout =  "destacaIcon2('Hasansham-M2')">
<h4 style = 'display:none' id = 'listSort-8'></h4>
<h5 style = 'display:none'>Hasansham M2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hasansham M2<br><span id = 'favorito-8' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-8' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-8' class = 'cityNames noSelect' onclick = "setWare(8,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-8' class = 'cityNames noSelect' onclick = "setWare(8,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-8' class = 'cityNames noSelect' onclick = "setWare(8,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-8' class = 'cityNames noSelect' onclick = "setWare(8,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-8' class = 'cityNames'			onclick = "setWare(8,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-8' class = 'cityNames noSelect' onclick = "setWare(8,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('As-Salamyiah','6544')" onmouseout =  "destacaIcon2('As-Salamyiah')">
<h4 style = 'display:none' id = 'listSort-17'></h4>
<h5 style = 'display:none'>As Salamyiah</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
As Salamyiah<br><span id = 'favorito-17' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-17' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-17' class = 'cityNames noSelect' onclick = "setWare(17,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-17' class = 'cityNames noSelect' onclick = "setWare(17,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-17' class = 'cityNames noSelect' onclick = "setWare(17,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-17' class = 'cityNames noSelect' onclick = "setWare(17,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-17' class = 'cityNames'			onclick = "setWare(17,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-17' class = 'cityNames noSelect' onclick = "setWare(17,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>


<div class = 'listWare listWareActive agencyC' onmouseover = "destacaIcon('Hasansham-U2','7000')" onmouseout =  "destacaIcon2('Hasansham-U2')">
<h4 style = 'display:none' id = 'listSort-11'></h4>
<h5 style = 'display:none'>Hasansham U2</h5>
<h3><span style = 'float:left; width: 121px; margin-top: 6px;'>
Hasansham U2<br><span id = 'favorito-11' class = 'cityNames favorito'></span>
</span>
<span id = 'list-lock-11' class = 'cityNames noSelectLock' style = 'font-size: 1.6rem;'><i class='fa fa-lock'></i></span>

<span id = 'list-5-11' class = 'cityNames noSelect' onclick = "setWare(11,'5')">&nbsp;7&nbsp;</span>
<span id = 'list-4-11' class = 'cityNames noSelect' onclick = "setWare(11,'4')">&nbsp;6&nbsp;</span>
<span id = 'list-3-11' class = 'cityNames noSelect' onclick = "setWare(11,'3')">&nbsp;5&nbsp;</span>
<span id = 'list-2-11' class = 'cityNames noSelect' onclick = "setWare(11,'2')">&nbsp;4&nbsp;</span>
<span id = 'list-0-11' class = 'cityNames'			onclick = "setWare(11,'?')">&nbsp;&nbsp;?&nbsp;&nbsp;</span>
<span id = 'list-1-11' class = 'cityNames noSelect' onclick = "setWare(11,'X')">&nbsp;&nbsp;X&nbsp;&nbsp;</span>
</h3></div>

</div>
</div>
							</div>
							<div style="text-align:right; width:100%; font-size:1.5rem"> ton/semester</div>
						</div>

						<div class="col-md-auto" style="padding:0; width: 824px;">
							<div class="bpu">
								<h3 style="margin-top:15px" class="bpv bpw">MAP</h3>
							</div>

							<div id="map"></div>
						</div>

					</div>

				</div>


				<div class="col-6">
					<div class="row">
						<div class="col-12 textOnMap titleScenario">
							<div class="bpu" style="margin-top:15px">
								<h1 class="bpv bpw" id="cenarioAtual">SCENARIOS <span id="logFile"></span></h1>
							</div>
						</div>
					</div>
					<div class="row" style="height: 96vh">
						<div class="col-8">
							<table class="table table-hover" id="tableSce" style = "width: 150%;">
								<thead class="thead-dark">
									<tr>
										<th scope="col">#</th>
										<th scope="col"><i class="fas fa-dollar-sign"></i> / <i class="fas fa-shipping-fast"></i></th>

										<th scope="col">Cost <i class="fas fa-dollar-sign"></i> </th>
										<th scope="col">SL <i class="fas fa-hourglass-half"></i></th>
										<th scope="col">SL <i class="fas fa-clipboard-list"></i> </th>
										<th scope="col"> Cost A <i class="fas fa-dollar-sign"></i> </th>
										<th scope="col"> Cost B <i class="fas fa-dollar-sign"></i> </th>
										<th scope="col"> Cost C <i class="fas fa-dollar-sign"></i> </th>
										<th scope="col"> Constraints</th>
										<th scope="col"> <i class="fas fa-award"></i></th>
										<th scope="col"><i class="fas fa-chart-line"></i></th>
										<th scope="col"><i class="fas fa-trash-alt"></i></th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
							<div id="map2-div">
								<div class="bpu">
									<h3 style="margin-top:15px" class="bpv bpw">
										<i class="fas fa-award" style="color: rgb(255, 255, 0);font-size: 145%;"></i> &nbsp;&nbsp;&nbsp; FAVORITE SCENARIO
									</h3>
								</div>
								<div id="map2"></div>
							</div>
						</div>
						<div class="col-4" style = "margin-top: 485px;">
							<div style="width: 80%;  padding: 5px 15px 15px 0;margin-left: 15px;">
								<canvas id="scenarioChart"></canvas>
							</div>
							<hr width="95%" style="border: 1px solid #999;">
							<div style="width: 90%;  padding: 5px 15px 15px 0;margin-left: 15px;">
								<canvas id="scenarioCustos"></canvas>
							</div>
							<hr width="95%" style="border: 1px solid #999;">
							<div style="width: 90%;  padding: 5px 15px 15px 0;margin-left: 15px;">
								<canvas id="scenarioCP"></canvas>
							</div>
							<!-- <hr width="95%" style="border: 1px solid #999;"> -->
							<div style="width: 100%;  padding: 5px 15px 15px 0; margin-left: 15px; display: none">
								<canvas id="scenarioParetoB"></canvas>
							</div>

						</div>
					</div>

					<div class="row">

						<div style="text-align: center; position: absolute; bottom: -22px;width: 96%; ">

							<img src="img/logos/cislog.png" style="max-width:18rem !important;margin: 3px 15px">
							<img src="img/logos/capes.png" style="max-width:19rem !important;margin: 3px 15px">
							<img src="img/logos/fapesp.png" style="max-width:19rem !important;margin: 3px 15px">
							<img src="img/logos/cnpq.png" style="max-width:15rem !important;margin:3px 15px">
							<img src="img/logos/usp.png" style="max-width:15rem !important;margin:3px 15px">
						</div>
					</div>
				</div>
			</div>

			<div id="alertBackground" style="display:none">
				<div id="myAlert">
					<h1 style="font-size:300%; text-align: center"><b><i class="fas fa-exclamation-triangle"></i> ALERT</b></h1><br>
					<h1 id="myMessage"></h1>
					<div onclick="myAlertClose()">
						<h1 class="okBtn">OK</h1>
					</div>
				</div>

			</div>


		</div>

		<div id="welcome" style="display:block" onclick="welcome()">

			<img src="img/logos/dss.png" style="max-width:45rem !important;margin:3px 0">
			<br>
			<span style="font-size:150%">DECISION SUPPORT SYSTEM</span><br>
			<span>Iraq Location Analysis Case</span>
			<br><br>
			<span style="font-size:50%">
				<div>Eng. Filipe Aécio Alves de Andrade Santos (University of São Paulo)</div>
				<div>Prof. Dr. Hugo Tsugunobu Yoshida Yoshizaki (University of São Paulo)</div>
			</span>
			<br>
			<div style="text-align: center;  ">

				<img src="img/logos/cislog.png" style="max-width:36rem !important;margin: 3px 15px">
				<img src="img/logos/capes.png" style="max-width:44rem !important;margin: 3px 15px">
				<img src="img/logos/fapesp.png" style="max-width:40rem !important;margin: 3px 15px">
				<img src="img/logos/cnpq.png" style="max-width:30rem !important;margin: 3px 15px">
				<img src="img/logos/usp.png" style="max-width:29rem !important;margin:3px 15px">
			</div>
		</div>
		<script>
			//escolhe o tipo de tela
			<?php

			echo "screen = 0;";


			?>
			// Lendo Tabela do Excel
			meso = [];
			meso_str = [];
			citiesCanditates_str = [];
			citiesCanditates = [];
			factories_str = [];
			factories = [];

			<?php

			for ($i = 2; $i <= $data->sheets[0]['numRows']; $i++) {
				echo "citiesCanditates_str[$i] = '" . implode('|', $citiesCanditates[$i]) . "'\n";
			}

			?>


			for (i = 0; i < 28; i++) {
				citiesCanditates[i] = citiesCanditates_str[i + 3].split("|");
			}

		</script>
		<script src="js/map.js"></script>
		<script src="js/map2.js"></script>
		<script src="js/result.js"></script>

		<script>
			//order('h5');
			loadResult(1, 1);
			menu(1);
			createChartCost();
			createChartSLKA();
			createChartOthers();
			

			ctx = document.getElementById('scenarioChart').getContext('2d');
			scenarioChart = new Chart(ctx, config);
			ctx_custos = document.getElementById('scenarioCustos').getContext('2d');
			costChart = new Chart(ctx_custos, config_cost);
			ctx_scenarioCP = document.getElementById('scenarioCP').getContext('2d');
			scenarioCPChart = new Chart(ctx_scenarioCP, config_scenarioCP);
			ctx_paretoB = document.getElementById('scenarioParetoB').getContext('2d');
			paretoBChart = new Chart(ctx_paretoB, config_paretoB);
			document.getElementById("logFile").innerHTML = "<a href='zip/" + logName + ".zip' download='" + logName + ".zip'>(<i class='fas fa-download'></i> download log file)</a>"


			$("#divTableDemand").hide()
			$("#divTableDemand").width("240px")

			$(window).on('load', function() {
				setTimeout(welcome(), 4000)
				newScenario("BLANK")
				legendaPop();
			});

			function welcome() {
				document.getElementById("welcome").style.display = "none";
			}

			function info() {
				document.getElementById("welcome").style.display = "block";
			}
		</script>
</body>

</html>