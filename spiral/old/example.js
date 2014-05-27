var chart = circularHeatChart()
    .segmentHeight(10)
    .innerRadius(50)
    .numSegments(12)
    .radialLabels(["1998", "1999", "2000", "2001", "2002", "2003", "2004","2005", "2006", "2007", "2008", "2009","2010", "2011", "2012", "2013"])
    .segmentLabels(["January","February","March","April","May","June","July","August","September","October","November","December"])
    .margin({top: 10, right: 0, bottom: 10, left: 80});

var energyData = [
    0.176042,0.096146,0.076414,0.334734,0.132583,0.135422,0.060884,0.768601,0.230771,0.07572,0.210855,0.090938,
    0.094296,0.290368,0.093755,0.099166,0.429278,0.962314,0.43833,0.244464,0.550621,0.173093,0.103659,0.0773,
    0.173093,0.103659,0.0773,0.265913,0.099811,0.076164,0.3154,0.146557,0.108531,0.421608,0.120872,0.09789,
    0.061825,0.101988,0.095364,0.365022,0.096741,0.095962,0.06409,0.300409,0.102083,0.134949,0.535842,0.224584,
    0.227262,0.28274,0.11842,0.062601,0.173093,0.103659,0.0773,0.103968,0.088054,0.069683,0.141973,0.106082,
    0.135513,0.09906,0.099516,0.31927,0.097133,0.08595,0.067532,0.096042,0.059053,0.11167,0.137408,0.109005,
    0.365752,0.179085,0.135975,0.199275,0.144186,0.053961,0.173093,0.103659,0.0773,0.088226,0.09218,0.059777,
    0.125663,0.136192,0.121279,0.146825,0.267907,0.113706,0.09266,0.105833,0.130221,0.09695,0.078355,0.067088,
    0.093888,0.096131,0.152373,0.072957,0.095516,0.091731,0.14403,0.113989,0.089659,0.173093,0.103659,0.0773,
    0.089808,0.085082,0.057542,0.09864,0.091152,0.066592,0.20529,0.12785,0.077798,0.071004,0.094316,0.088963,
    0.054368,0.091964,0.095114,0.071649,0.076153,0.150208,0.15751,0.065801,0.087791,0.100653,0.121987,0.161462,
    0.173093,0.103659,0.0773,0.096507,0.093314,0.075191,0.07723,0.091846,0.095587,0.053434,1.017331,1.458327,
    0.120566,0.107582,0.139082,0.112224,0.159757,0.252278,0.161521,0.124628,0.080985,0.634034,0.248268,0.20864,
    0.14324,0.174345,0.165649,0.173093,0.103659,0.0773,0.096507,0.093314,0.075191,0.07723,0.091846,0.095587,
    0.053434,1.017331,1.458327,0.120566,0.107582,0.139082,0.112224,0.159757,0.252278,0.161521,0.124628,0.080985,
    0.634034,0.248268,0.20864,0.14324,0.174345,0.165649,0.173093,0.103659,0.0773,0.096507,0.093314,0.161521
   ];

d3.select('#energychart')
    .selectAll('svg')
    .data([energyData])
    .enter()
    .append('svg')
    .call(chart);

/* Simple chart */
chart.segmentHeight(10)
    .innerRadius(20)
    .numSegments(24)
    .radialLabels(null)
    .segmentLabels(null)
    .margin({top: 20, right: 20, bottom: 20, left: 20});
var data = [];
for(var i=0; i<240; i++) {
    data[i] = i;
}

d3.select('#chart1')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);

/* An array of charts */
data = [];
for(var i=0; i<3; i++) {
	data[i] = [];
	for(var j=0; j<120; j++) {
	    data[i][j] = Math.random();
	}
}

chart.range(["white", "black"]).margin({top: 20, right: 20, bottom: 20, left: 20});
d3.select('#chart2')
    .selectAll('svg')
    .data(data)
    .enter()
    .append('svg')
    .style('width', '200px')
    .style('height', '200px')
    .call(chart);

/* Labels */
chart.innerRadius(20)
    .segmentHeight(20)
    .range(["white", "steelblue"])
    .radialLabels(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .segmentLabels(["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]);
var data = [];
for(var i=0; i<168; i++) {
    data[i] = Math.random();
}
d3.select('#chart3')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);


/* An array of objects */
data = [];
for(var i=0; i<240; i++) {
    data[i] = {title: "Segment "+i, value: Math.round(Math.random()*100)};
}

chart.accessor(function(d) {return d.value;})
    .radialLabels(null)
    .segmentLabels(null);
d3.select('#chart4')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);

/* Add a mouseover event */
d3.selectAll("#chart4 path").on('mouseover', function() {
	var d = d3.select(this).data()[0];
    d3.select("#info").text(d.title + ' has value ' + d.value);
});
d3.selectAll("#chart4 svg").on('mouseout', function() {
    d3.select("#info").text('');	
});
