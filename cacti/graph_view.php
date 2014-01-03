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
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0' name='viewport'>

  <title>Team Amaterasu Project</title>

  
<script type="text/javascript" src="js/d3.js"></script>
<script type="text/javascript" src="js/crossfilter.js"></script>
<script type="text/javascript" src="js/dc.js"></script>
<script src='jquery-1.9.1.min.js' type='text/javascript'></script>
<script src='bootstrap.min.js' type='text/javascript'></script>

      <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/dc.css"/>
  <style type="text/css"></style>
</head>

<body>

<div class='container' id='main-container'>
<div class='content'>
<div class='container' style='font: 12px sans-serif;'>

  <div class='row'>
    <div class='span12'>
      <h3>Team Amaterasu Project on Visualization of Sun's Activity for the year 2001 (hourly averages)</h3>
      <div class='row'>
        <div class='pie-graph span6' id='dc-magnitude-chart'>
        <h4>Events by Speed</h4>
        </div>
        <div class='pie-graph span6' id='dc-bmag-chart'>
	      <h4>Events by Bmag</h4>
        </div>    
      </div>
    </div>
  </div>

  <div class='row'>
    <div class='span12' id='dc-time-chart-speed'>
      <h4>Speed by time</h4>
    </div>
  </div>
  <div class='row'>
    <div class='span12' id='dc-time-chart-magnitude'>
      <h4>Magnitude by time</h4>
    </div>
  </div>


<H5>Generated with 
  <a href="http://nickqizhu.github.io/dc.js/">dc.js</a>,
  <a href="http://square.github.io/crossfilter/">crossfilter</a>, 
  <a href="http://d3js.org/">d3.js</a> and 
  <a href="http://twitter.github.io/bootstrap/">bootstrap</a>.
</H5>

</div>
</div>
</div>
  
<script>
  
/**********************************
* Step0: Load data from json file *
**********************************/

// load data from a csv file
d3.csv("data.csv", function (data) {

  // format our data
  var dtgFormat = d3.time.format("%d.%m.%Y %H:%M");
  
  data.forEach(function(d) { 
    d.dtg     = dtgFormat.parse(d.date); 
    d.density = +d.density;
    d.temp    = +d.temp;
    d.speed   = +d.speed;
    d.Bmag    = +d.Bmag;
  });
  
	
/******************************************************
* Step1: Create the dc.js chart objects & ling to div *
******************************************************/

  var magnitudeChart = dc.barChart("#dc-magnitude-chart");
  var BmagChart = dc.barChart("#dc-bmag-chart");
  var timeChartSpeed = dc.scatterPlot("#dc-time-chart-speed");
  var timeChartMagnitude = dc.scatterPlot("#dc-time-chart-magnitude");
  

/****************************************
* 	Run the data through crossfilter    *
****************************************/

  var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

/******************************************************
* Create the Dimensions                               *
* A dimension is something to group or filter by.     *
* Crossfilter can filter by exact value, or by range. *
******************************************************/

  // for Magnitude
  var speedValue = facts.dimension(function (d) {
    return d.speed;       // group or filter by magnitude
  });
  var speedValueGroupSum = speedValue.group()
    .reduceSum(function(d) { return d.speed; });	// stays
 
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  }); // group or filter by e

  // for bmag
  var BmagValue = facts.dimension(function (d) { //stays
    return d.Bmag;
  });
  var BmagValueGroup = BmagValue.group(); //stays
  
 var speedTimeGroupSum = timeDimension.group()
    .reduceSum(function(d) { return d.speed; });
var magTimeGroupSum = timeDimension.group()
    .reduceSum(function(d) { return d.Bmag; });
/***************************************
* 	Step4: Create the Visualisations   *
***************************************/
  
  // Magnitide Bar Graph Summed
  magnitudeChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(speedValue)								// the values across the x axis
    .group(speedValueGroupSum)							// the values on the y axis
    .centerBar(true)	
	.gap(56)                                            // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([200, 900]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});	

  // Depth bar graph
  BmagChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(BmagValue)
    .group(BmagValueGroup)
    .centerBar(true)	
	.gap(56)                    // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([0, 100]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});

  timeChartSpeed
    .width(768)
    .height(480)
	.x(d3.time.scale().domain([new Date(2000, 6, 1), new Date(2002, 6, 31)]))
	.y(d3.time.scale().domain([200, 900]))
    .brushOn(true)
    .yAxisLabel("Speed in x metrics")
    //.elasticY(true)
	.dimension(timeDimension)
    .group(speedTimeGroupSum)
	.mouseZoomable(true);

   timeChartMagnitude
    .width(768)
    .height(480)
	.x(d3.time.scale().domain([new Date(2000, 6, 1), new Date(2002, 6, 31)]))
    .brushOn(false)
    .yAxisLabel("Magnitude in x metrics")
    .elasticY(true)
	.dimension(timeDimension)
    .group(magTimeGroupSum)
	.mouseZoomable(true);


/****************************
* Step6: Render the Charts  *
****************************/
			
  dc.renderAll();
  
});
  
</script>
    
</body>
</html>
<?php

api_plugin_hook('console_after');

include("./include/bottom_footer.php");

?>
