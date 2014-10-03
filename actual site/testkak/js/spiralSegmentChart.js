function spiralSegmentChart() {
    var margin = {top: 30, right: 20, bottom: 20, left: 20},
    innerRadius = 40,
    numSegments = 12,
    numYears=15,
    segmentHeight = 12,
    numMonths = numSegments,
    startAngle=0.*Math.PI/180.,
    dAngle=2*Math.PI/numSegments,
    spiralA = innerRadius,
    spiralB = 2.5,
    outerRadius=innerRadius+spiralB*Math.floor(startAngle + numYears*numMonths*dAngle)+2*segmentHeight;
    console.log(spiralB,innerRadius);
    
/*===================== COLOR SCALING =====================*/
    domain = null, //the data domain for color scaling
    range = ["pink","purple"],
    accessor = function(d) {return d;},
    yearLabels = monthLabels = [];
    
    function chart(selection) {
        selection.each(function(data) {
            var svg = d3.select(this);
	    
            var offset = innerRadius + Math.ceil(data.length / numMonths) * segmentHeight;
            console.log(offset)
            g = svg.append("g")
                .classed("spiral-segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");
	    
//Automatically determine the domain of the data
            var autoDomain = false;
            if (domain === null) {
                domain = d3.extent(data, accessor);
                autoDomain = true;
            }
//Scale the color values based on the data domain
            var color = d3.scale.linear().domain(domain).range(range).clamp("true");
            if(autoDomain)
                domain = null;
/*=========================================================*/


/*===================== DRAW THE GRAPH =====================*/
            g.selectAll("path").data(data)
                .enter().append("path")
                .attr("d",d3.svg.arc().innerRadius(innerRad).outerRadius(outerRad).startAngle(startAng).endAngle(endAng))
			.attr("fill", function(d) {return color(d);}); //accessor(d)
/*=========================================================*/



/*======================= LABELS ======================*/
            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = d3.selectAll(".spiral-segment")[0].length;
	    
/*============== Year labels ==============*/
            //The year labels should be horizontal, i.e. independent of the spiral segment
            var lsa = -0.01; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("year", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");
	    	
            labels.selectAll("def")
                .data(yearLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    //var r = innerRadius + ((1.1*i + 1) * segmentHeight);
                    var r = innerRadius + spiralB*Math.floor(2*(i)*Math.PI);
                    
                    //OLD VERSION - LABELS ALONG AN ARC PATH
                    //return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + 
                    //        " a" + r + " " + r + " 0 1 1 -1 0";
                    return "m -" +15. + " -" + r +" h" + 40.;
                });

            labels.selectAll("text")
                .data(yearLabels).enter()
                .append("text") 
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", segmentHeight + 'px').style('stroke','light-grey')
                .text(function(d) {return d;});
/*=======================================*/


/*==================Month labels ==================*/
            var monthLabelOffset = segmentHeight;
            var r = outerRadius+monthLabelOffset;
            labels = svg.append("g")
                .classed("labels", true)
                .classed("month", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");
	
            labels.append("def")
                .append("path")
                .attr("id", "month-label-path-"+id)
                .attr("d", "m0 -" + (r) + " a" + r + " " + r + " 0 1 1 -1 0");

	 	    //Give the 'data' (containing text to the paths
            labels.selectAll("text")
                .data(monthLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#month-label-path-"+id)
                .attr("startOffset", function(d, i) {return (i / numMonths) * 100 + 0.5+"%";})//+ 100./(2*numMonths)
                .text(function(d) {return d;});
/*=========================================================*/
        });
        
        
/*=========================================================*/

    }
    
/*===================== START/END RADIUS FUNCTIONS =====================*/
    var oldIR = 0.;
    innerRad = function(d, i) {
	var startAng = (startAngle + (i)*dAngle);
	var innerRad=spiralA+spiralB * startAng;
//	if (oldIR != 0.) {innerRad=oldIR};
	console.log('IR['+i+']:'+innerRad);
        return innerRad;
    }
    outerRad = function(d, i) {
	var endAng = (startAngle + (i)*dAngle);
	var outerRad=segmentHeight+spiralA+spiralB * endAng; //segmentHeight+
//	if (oldIR != 0.) {outerRad = oldIR+segmentHeight};
	oldIR=outerRad
	console.log('OR['+i+']:'+outerRad);
        return outerRad; //segmentHeight+
    }
/*=========================================================*/



/*===================== START/END ANGLE FUNCTIONS =====================*/
    startAng = function(d, i) {
	var startAng = (startAngle + (i)*dAngle);
        return startAng; //Math.floor
    }
    endAng = function(d, i) {
	var endAng = (startAngle + (i+1)*dAngle);
        return endAng;
    }
/*=====================================================================*/
    
    
    
/*================ Configuration getters/setters ================*/
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.numMonths = function(_) {
        if (!arguments.length) return numMonths;
        numMonths = _;
        return chart;
    };

    chart.numYears = function(_) {
        if (!arguments.length) return numYears;
        numYears = _;
        return chart;
    };

    chart.segmentHeight = function(_) {
        if (!arguments.length) return segmentHeight;
        segmentHeight = _;
        return chart;
    };

    chart.numSegments = function(_) {
        if (!arguments.length) return numSegments;
        numSegments = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return chart;
    };

    chart.yearLabels = function(_) {
        if (!arguments.length) return yearLabels;
        if (_ == null) _ = [];
        yearLabels = _;
        return chart;
    };

    chart.monthLabels = function(_) {
        if (!arguments.length) return monthLabels;
        if (_ == null) _ = [];
        monthLabels = _;
        return chart;
    };

    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };
/*=====================================================================*/

    return chart;
}
