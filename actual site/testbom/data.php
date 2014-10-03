<?php
    $username = "amateras_DB"; 
    $password = "slunce";   
    $host = "localhost";
    $database="amateras_new";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

     $myquery = "SELECT  `ddate`, `density` , `temp`, `speed`, `Bmag` FROM  `BM_TEST`";
    /** $myquery = "SELECT  `date`, `density` , `temp`, `speed`, `Bmag` FROM  `test_nas`"; */
    /**
     * We're appending from and to parameters to MySQL query if they are set
     */
    if (isset($_GET['from']) || isset($_GET['to'])) {
        $myquery .= ' WHERE ';

        if (isset($_GET['from'])) {
            $myquery .= "Bmag >= '{$_GET['from']}'";
        }

        if (isset($_GET['to'])) {

            if (isset($_GET['from'])) {
                $myquery .= ' AND ';
            }

            $myquery .= "Bmag <= '{$_GET['to']}'";
        }
    }

    $query = mysql_query($myquery);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }

    $data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }

    /**
     * We make sure the correct response header is set, since the response is JSON
     */
    header('Content-Type: application/json');
    echo json_encode($data);
    mysql_close($server);
?>