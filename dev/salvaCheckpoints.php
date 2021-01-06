<?php

$checkPoints = explode("|", $_POST["cPoints"]);

$partB = "";

foreach($checkPoints as &$c){
    $pontos = explode(",", $c);
    $a = $pontos[0];
    $b = $pontos[1];
    $partB = $partB."CP_".$a."_".$b." = 1\n";

}


$file = fopen("results/checkpoints.js","w");
fwrite($file, $partB);
fclose($file);


?>
