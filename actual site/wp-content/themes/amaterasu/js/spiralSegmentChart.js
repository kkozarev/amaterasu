function spiralSegmentChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    innerRadius = 50,
    numSegments = 12,
    numYears=15,
    segmentHeight = 10,
    numMonths = numSegments,
    startAngle=0.*Math.PI/180.,
    dAngle=2*Math.PI/numSegments,
    spiralA = innerRadius,
    spiralB = segmentHeight/5.,
    outerRadius=innerRadius+spiralB*Math.floor(startAngle + numYears*numMonths*dAngle)+2*segmentHeight;
    domain = null, //the data domain for color scaling
    range = ["#098ac4","#011d2a"],
    accessor = function(d) {return d;},
    radialLabels = segmentLabels = [];
    
    function chart(selection) {
        selection.each(function(data) {
            var svg = d3.select(this);
	    
            var offset = innerRadius + Math.ceil(data.length / numMonths) * segmentHeight;
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
	    
	    //DRAW THE GRAPH
            g.selectAll("path").data(data)
                .enter().append("path")
                .attr("d",d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
			.attr("fill", function(d) {return color(d);}); //accessor(d)


            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = d3.selectAll(".spiral-segment")[0].length;
	    
            //Radial labels
            var lsa = -0.01; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("radial", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");
	    
            labels.selectAll("def")
                .data(radialLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    var r = innerRadius + ((1.1*i + 1) * segmentHeight);
		    //var r = innerRadius + spiralB*Math.floor(startAngle + (i)*dAngle);
                    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + 
                            " a" + r + " " + r + " 0 1 1 -1 0";
                });

            labels.selectAll("text")
                .data(radialLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", 0.7 * segmentHeight + 'px').style('stroke','black')
                .text(function(d) {return d;});

            //Segment labels
            var segmentLabelOffset = 2;
            var r = outerRadius;// innerRadius + Math.ceil(data.length / numMonths) * segmentHeight + segmentLabelOffset;
            labels = svg.append("g")
                .classed("labels", true)
                .classed("segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.append("def")
                .append("path")
                .attr("id", "segment-label-path-"+id)
                .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

            labels.selectAll("text")
                .data(segmentLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#segment-label-path-"+id)
                .attr("startOffset", function(d, i) {return i * 100 / numMonths + "%";})
                .text(function(d) {return d;});
        });

    }
    
    /* Arc functions */
    var oldIR = 0.;
    ir = function(d, i) {
	var sa = (startAngle + (i)*dAngle);
	var ir=spiralA+spiralB * sa;
//	if (oldIR != 0.) {ir=oldIR};
	//console.log(ir);
        return ir;
    }
    or = function(d, i) {
	var ea = (startAngle + (i+1)*dAngle);
	var or=segmentHeight/2.+spiralA+spiralB * ea; //segmentHeight+
//	if (oldIR != 0.) {or = oldIR+segmentHeight};
	oldIR=or
	//console.log(or);
        return or; //segmentHeight+
    }
    sa = function(d, i) {
	var sa = (startAngle + (i)*dAngle);
        return sa; //Math.floor
    }
    ea = function(d, i) {
	var ea = (startAngle + (i+1)*dAngle);
        return ea;
    }
    
    /* Configuration getters/setters */
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

    chart.radialLabels = function(_) {
        if (!arguments.length) return radialLabels;
        if (_ == null) _ = [];
        radialLabels = _;
        return chart;
    };

    chart.segmentLabels = function(_) {
        if (!arguments.length) return segmentLabels;
        if (_ == null) _ = [];
        segmentLabels = _;
        return chart;
    };

    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };

    return chart;
}
