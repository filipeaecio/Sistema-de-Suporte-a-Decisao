<?php
$line 	= $_POST["line"];
$log 	= $_POST["log"];
$logName 	= $_POST["logName"];
$c 	= $_POST["c"];

if($log == 0){
	$file = fopen("log/".$logName.".csv","w");
	$head = "#;Blank/From;$/SL-KA;COST;SL KA;SL OTHERS;Recife;Sao Paulo;Goiania;Florianopolis;Curitiba;Londrina;Bauru;Teresina;Cuiaba;Salvador;Belem;Palmas;Vitoria;Rio de Janeiro;Porto Alegre;Juazeiro do N.;Uberlandia;Sao Luis;Manaus;B. Horizonte;Fortaleza\n";
	fwrite($file, $head);
	fclose($file);
	
	$zip = new ZipArchive();
	if($zip->open('zip/'.$logName.'.zip', ZIPARCHIVE::CREATE) == TRUE){
		$zip->addFile('results/1_result.js','1_result.txt');	
	}
}
$file = fopen("log/".$logName.".csv","a+");
fwrite($file, $line);
fclose($file);

	$zip = new ZipArchive();
	$zip->open('zip/'.$logName.'.zip');
	$zip->addFile('results/'.$c.'_result.js',$c.'_result.txt');	
	$zip->addFile('log/'.$logName.'.csv',$logName.'.csv');	
	
$output = null;

?>
	


