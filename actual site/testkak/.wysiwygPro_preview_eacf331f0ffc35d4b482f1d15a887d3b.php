<?php
if ($_GET['randomId'] != "2bbRIu5pX5Vhgb40_gknLCH60yeTGKy_z1gRqAdb8cxybpQk__GTCgjktwwmF4Uv") {
    echo "Access Denied";
    exit();
}

// display the HTML code:
echo stripslashes($_POST['wproPreviewHTML']);

?>  
