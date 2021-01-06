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



						<div class="col-md-auto" style="padding:0; width: 824px;">
							<div class="bpu">
								<h3 style="margin-top:15px" class="bpv bpw">MAP</h3>
							</div>

							<div id="map"></div>
						</div>



		<script src="js/map.js"></script>
		<script src="js/result.js"></script>

		<script>
			altera_checkpoints();
		</script>

</body>

</html>