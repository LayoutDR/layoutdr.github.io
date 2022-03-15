<?php
// Handle submitted data
	$json = file_get_contents('php://input');
	$data = json_decode($json);
	//$stamp = date("Y-m-d-H-i-s-") . rand(1,100000);
	$stamp = $data->SUID;
	$dir = str_replace("public_html","data", __DIR__);
	$file = $dir . '/' . $stamp . '.json';
	
	//$stampIP = $stamp . "-IP";
	//$dirIP = str_replace("public_html","data/ip", __DIR__);
	//$fileIP = $dirIP . '/' . $stampIP . '.txt';
	
	//$stampUA = $stamp . "-IP";
	//$dirUA = str_replace("public_html","data/userAgent", __DIR__);
	//$fileUA = $dirUA . '/' . $stampUA . '.txt';
	
	//$IP = $_SERVER['REMOTE_ADDR'];
	//file_put_contents($fileIP, $IP);
	
	//$UA = $_SERVER['HTTP_USER_AGENT'];
	//file_put_contents($fileUA, $UA);
	
	if (file_put_contents($file, $json))
   		 echo "Success";
	else 
    		echo "Failed";
?>
