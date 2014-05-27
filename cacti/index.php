<?php
/*
 +-------------------------------------------------------------------------+
 | Copyright (C) 2004-2013 The Cacti Group                                 |
 |                                                                         |
 | This program is free software; you can redistribute it and/or           |
 | modify it under the terms of the GNU General Public License             |
 | as published by the Free Software Foundation; either version 2          |
 | of the License, or (at your option) any later version.                  |
 |                                                                         |
 | This program is distributed in the hope that it will be useful,         |
 | but WITHOUT ANY WARRANTY; without even the implied warranty of          |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           |
 | GNU General Public License for more details.                            |
 +-------------------------------------------------------------------------+
 | Cacti: The Complete RRDTool-based Graphing Solution                     |
 +-------------------------------------------------------------------------+
 | This code is designed, written, and maintained by the Cacti Group. See  |
 | about.php and/or the AUTHORS file for specific developer information.   |
 +-------------------------------------------------------------------------+
 | http://www.cacti.net/                                                   |
 +-------------------------------------------------------------------------+
*/

include("./include/auth.php");
include("./include/top_header.php");

api_plugin_hook('console_before');

?>
<html>
<head>
    <title>Google Chart Example: 2 Charts</title>
    <style>
        ul {list-style-type: none;} 
    </style>
   <script src="https://www.google.com/jsapi"></script>
   <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
   <script src="jquery.csv-0.71.js"></script>
   <script>
      // load the visualization library from Google and set a listener
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);

      function drawChart() {
         // grab the first CSV
         $.get("allNEW.csv", function(csvString) {
            // transform the CSV string into a 2-dimensional array
            var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});

            // use arrayData to load the select elements with the appropriate options
            for (var i = 0; i < arrayData[0].length; i++) {
               // this adds the given option to both select elements
               $("select.chart").append("<option value='" + i + "'>" + arrayData[0][i] + "</option>");
            }
            // set the default selection
            $("#domain option[value='0']").attr("selected","selected");
            $("#range option[value='1']").attr("selected","selected");

            // this new DataTable object holds all the data
            var data = new google.visualization.arrayToDataTable(arrayData);

            // this view can select a subset of the data at a time
            var view = new google.visualization.DataView(data);

            view.setColumns([{calc:stringID, type: "string"},1,2,3]);

            // this function returns the first column values as strings (by row)
            function stringID(dataTable, rowNum){
                // return dataTable.getValue(rowNum, 0).toString();
                // return an empty string instead to avoid the bubble labels
                return "";
            }

            var options = {
               title: "ACE Data",
               hAxis: {title: data.getColumnLabel(0), minValue: data.getColumnRange(0).min, maxValue: data.getColumnRange(0).max},
               vAxis: {title: data.getColumnLabel(1), minValue: data.getColumnRange(1).min, maxValue: data.getColumnRange(1).max},
               bubble: {stroke: "transparent", opacity: 0.2},
               colorAxis: {colors:['blue','red']},
				sizeAxis:{minSize:1},
				sizeAxis:{maxSize:5},
				
				
		   };

            var chart = new google.visualization.BubbleChart(document.getElementById('chart'));
            chart.draw(view, options);

            // set listener for the update button
            $("select").change(function(){
               // determine selected domain and range
               var domain = +$("#domain option:selected").val();
               var range = +$("#range option:selected").val();
               var color = +$("#color option:selected").val();
             var size = +$("#size option:selected").val();
			//var size = 1;
			 
			 
               // update the view
               view.setColumns([{calc:stringID, type: "string", label: "Household ID"},domain,range,color,size]);

               // update the options
               options.hAxis.title = data.getColumnLabel(domain);
               options.hAxis.minValue = data.getColumnRange(domain).min;
               options.hAxis.maxValue = data.getColumnRange(domain).max;
               options.vAxis.title = data.getColumnLabel(range);
               options.vAxis.minValue = data.getColumnRange(range).min;
               options.vAxis.maxValue = data.getColumnRange(range).max;
               options.bubble = {stroke: "transparent", opacity: 0.2}; 
               options.colorAxis = {colors:['blue','red']};
				//options.sizeAxis.maxSize={10};
               // update the chart
               chart.draw(view, options);
            });
         });

        
      }
   </script>
   
   
   
<style> 
//div
//{
//border:2px solid;
//padding:10px 40px; 
//width:600px;
//resize:both;
//overflow:auto;
//}
</style>
   
   
   
   
   
   
   
   
   
   
</head>
<body>
    <div style="float:left;">
  
  <div id="chart" style="width:850px; height:650px; resize:both; overflow:auto;">
 


  </div>
   <ul>
        <li>
            Y-Axis
            <select class="chart" id="range"></select>
        </li>
        <li>
            X-Axis
            <select class="chart" id="domain"></select>
        </li>
        <li>
            Color
            <select class="chart" id="color"></select>
        </li>
        <li>
            Size
            <select class="chart" id="size"></select>
        </li>
    </ul>
</div>

</body>
</html>

<?php

api_plugin_hook('console_after');

include("./include/bottom_footer.php");

?>
