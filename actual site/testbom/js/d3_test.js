 
/**********************************
* Step0: Load data from json file *
**********************************/


// load data from a csv file
d3.json("data.php", function (data) {
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

  // for Solar Wind Speed
  var speedValue = facts.dimension(function (d) {
    return d.speed;       // group or filter by magnitude
  });
  var speedValueGroupSum = speedValue.group(function(d) { return Math.floor(d / 5) * 5;})
    .reduceSum(function(d) { return d.speed; });	// stays
 
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
      }); // group or filter by e

  // for Magnetic Field Magnitude
  var BmagValue = facts.dimension(function (d) { //stays
    return d.Bmag;
  });
 var BmagValueGroup = BmagValue.group(function(d) { return Math.floor(d); }); //stays
 //  var BmagValueGroup = BmagValue.group(); //stays 
 

var speedTimeGroupSum = timeDimension.group()
    .reduceSum(function(d) { return d.speed; });

var magTimeGroupSum = timeDimension.group()
    .reduceSum(function(d) { return d.Bmag; });
/***************************************
* 	Step4: Create the Visualisations   *
***************************************/
  
  // Solar Wind Speed Bar Graph Summed
  magnitudeChart
    .width(480)
    .height(150)
    .margins({top: 10, right: 20, bottom: 30, left: 60})
    .dimension(speedValue)								// the values across the x axis
    .group(speedValueGroupSum)							// the values on the y axis
    .xAxisLabel("Solar Wind Speed [km/s]")
    .centerBar(true)
	.gap(56)                                            // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([200, 900]).rangeRound([0,70]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});


  // Depth bar graph
  BmagChart
    .width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .dimension(BmagValue)
    .group(BmagValueGroup)
    .xAxisLabel("Magnetic Field Magnitude [nT]")
    .centerBar(true)
	.gap(56)                    // bar width Keep increasing to get right then back off.
    .x(d3.scale.linear().domain([0, 80]).rangeRound([0, 1 * 100]))
//    .x(d3.scale.linear().domain([0, 80]))
	.elasticY(true)
	.xAxis().tickFormat(function(v) {return v;});

//TIME SERIES CHART FOR THE SOLAR WIND SPEED
  timeChartSpeed
    .width(768)
    .height(480)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
	//.x(d3.time.scale().domain([new Date(2000, 6, 1), new Date(2002, 6, 31)]).rangeRound([0, 10 * 7]))
	.x(d3.time.scale().domain([d3.min(data,function(d){return d.dtg;}),d3.max(data,function(d){return d.dtg;})]).rangeRound([0, 10 * 7]))
	//.y(d3.time.scale().domain([200, d3.max(data,function(d){return d.speed;})]).rangeRound([100, 10 * 7]))
    .brushOn(true)
    .yAxisLabel("Solar Wind Speed [km/s]")
    .elasticY(true)
    .yAxisPadding(5)
	.dimension(timeDimension)
    .group(speedTimeGroupSum)
	.mouseZoomable(true);

//d3.max(data,function(d){return d.speed;})

//TIME SERIES CHART FOR THE MAGNETIC FIELD
   timeChartMagnitude
    .width(768)
    .height(480)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
	.x(d3.time.scale().domain([d3.min(data,function(d){return d.dtg;}),d3.max(data,function(d){return d.dtg;})]).rangeRound([0, 10 * 7]))
    .brushOn(true)
    .yAxisLabel("Magnetic Field Magnitude [nT]")
    .elasticY(true)
    .transitionDuration(100)
    .yAxisPadding(1)
	.dimension(timeDimension)
    .group(magTimeGroupSum)
	.mouseZoomable(true);


/****************************
* Step6: Render the Charts  *
****************************/
			
  dc.renderAll();
  
});
  