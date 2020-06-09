<?php
session_start();
$_SESSION=array();
session_destroy();
$hour = time() + 3600 * 24 * 30;
setcookie('username',"no", $hour);
setcookie('password', "no", $hour);
header("Location: http://mi-wsa-pmplm1d.marineinteriors.it:8081/mi_login/login.html");
?>