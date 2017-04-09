// dataViz
// a tutorial on creating data vizualizations in JavaScript using D3

(function() {
	// Graph is an object that is accessible throughout the IIFE 
	// that contains all of the metadata about the graph and the container.
	var graph = {
		container: {
			svg: null, 
			xOffset: 60, 
			yOffset: 0, 
			height: 600, 
			width: 800
		}, 
		rects: null, 
		xScale: null, 
		yScale: null, 
		xAxis: null, 
		yAxis: null, 
		metric: null, 
		x: function(d){
			return this.container.xOffset + graph.xScale(d['age'])
		}, 
		y: function(d){
			return this.yScale(d[this.metric]);  
		}, 
		height: function(d){
			return (this.yScale(0) - this.yScale(d[this.metric]));  
		}
	};

	// _drawAxis clears the existing axis from the svg
	// and redraws a new x and y axis based off of the offsets
	// in the graph object
	var _drawAxis = function() {
		graph.container.svg.selectAll("g").remove();

		graph.container.svg.append("g")
		.attr("transform", "translate(" + graph.container.xOffset + "," + graph.container.yOffset + ")")
		.call(graph.yAxis);

		graph.container.svg.append("g")
		.attr("transform", "translate(" + graph.container.xOffset + ",250)")
		.call(graph.xAxis); 
	} 

	// _initPhase is going to set the metric, scales, domains, and axis
	// it will bind the data to our svg element
	var _initPhase = function(d, m){
		graph.metric = m;
		graph.xScale = d3.scaleLinear()
		.domain([
			d3.min(d, function(d) { return d.age; }),
			d3.max(d, function(d) { return d.age; })
			])
		.range([0,540]);

		graph.yScale = d3.scaleLinear()
		.domain([
			d3.min(d, function(d) { return d[graph.metric]; }),
			d3.max(d, function(d) { return d[graph.metric]; })
			])
		.range([250, 25]);
		
		graph.yAxis = d3.axisLeft().scale(graph.yScale);
		graph.xAxis = d3.axisBottom().scale(graph.xScale);

		graph.rects = graph.container.svg.selectAll("rect")
		.data(d);
	}

	// _enterPhase will run once when our svg is first rendered
	// we will set any static attributes here
	var _enterPhase = function(d){
		let w = Math.floor(500 / d.length);
		graph.rects.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("fill", "red")
		.attr("width", w)
		.attr("y", function(d){ 
			return graph.y(d);
		})
		.attr("height", function(d){ 
			return graph.height(d);
		})		
		.attr("x", function(d){
			return graph.x(d);
		})
		_drawAxis()
	}

	// _updatePhase will run every time the graph is redrawn
	// we will only update dynamic elements here
	var _updatePhase = function(d){
		let w = Math.floor(540 / d.length);
		graph.rects.transition().
		duration(750)
		.attr("width", w)
		.attr("y", function(d){ 
			return graph.y(d);
		})	
		.attr("height", function(d){ 
			return  graph.height(d);  
		})
		.attr("x", function(d){ 
			return graph.x(d);
		});
		;
		_drawAxis();
	}

	// _exitPhase if for cleanup
	var _exitPhase = function(){
		graph.rects.exit().remove();		
	}

	// _render function should be called every time you want to redraw the graph
	// takes as parameters the data and the metric name 
	var _render = function(d, m){
		_initPhase(d, m);
		_enterPhase(d);
		_updatePhase(d);
		_exitPhase();
	}

	d3.json("data/age.json", function(d){
		// create our svg element on the page
		graph.container.svg = d3.select("#graph").append('svg')
		.attr("height", graph.container.height)
		.attr("width", graph.container.width);

		_render(d, "total")
	});
})();