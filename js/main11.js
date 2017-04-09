// dataViz
// a tutorial on creating data vizualizations in JavaScript using D3

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

// tooltips will display the info about the currently highlignted item.
var _toolTip = function(d){
	graph.container.svg.append("text")
	.attr("x",graph.xScale(d['age']))
	.attr("y",graph.yScale(d[graph.metric]))
	.attr("class", "tooltip")
	.text("Age: " + d.age + " Pop: " + d[graph.metric]);
}

//Remove tooltip will erase it from the screen on mouseout.
var _removeToolTip = function(d){
	graph.container.svg.selectAll(".tooltip").remove();
}

// _drawAxis draws a new x and y axis based off of the offsets
// in the graph object
var _drawAxis = function(d) {
	graph.container.svg.selectAll("g").remove();
	graph.container.svg.selectAll("g").data(d).enter()
	.append("g")
	.attr("transform", "translate(" + graph.container.xOffset + "," + graph.container.yOffset + ")")
	.call(graph.yAxis);

	graph.container.svg.append("g")
	.attr("transform", "translate(" + graph.container.xOffset + ",275)")
	.call(graph.xAxis); 
} 

// _initPhase is going to set the metric, scales, domains, and axis
// it will bind the data to our svg element
var _init = function(d, m){
	graph.metric = m;
	graph.xScale = d3.scaleLinear()
	.domain([
		d3.min(d, function(d) { return d.age; }),
		d3.max(d, function(d) { return d.age; })
		])
	.range([0,540]);

	graph.yScale = d3.scaleLinear()
	.domain([500000,5000000])
	.range([250, 25]);
	graph.yAxis = d3.axisLeft().scale(graph.yScale);
	graph.xAxis = d3.axisBottom().scale(graph.xScale);

	graph.rects = graph.container.svg.selectAll("rect")
	.data(d)
}

// _enterPhase will run once when our svg is first rendered
// we will set any static attributes here
var _enter = function(d){
	let w = (480 / d.length);
	graph.rects.enter()
	.append("rect")
	.attr("class", "bar")
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
	.on("mouseover", function (d){
		_toolTip(d);
	})	
	.on("mouseout", function (d){
		_removeToolTip(d);
	});

	_drawAxis(d)
}

// _updatePhase will run every time the graph is redrawn
// we will only update dynamic elements here
var _update = function(d){
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
}

// _exitPhase is for cleanup
var _exit = function(){
	graph.rects.exit().remove();		
}

// _render function should be called every time you want to redraw the graph
// takes as parameters the data and the metric name 
var render = function(d, m){
	_init(d, m);
	_enter(d);
	_update(d);
	_exit();
}

d3.json("data/age.json", function(d){
	// create our svg element on the page
	graph.container.svg = d3.select("#graph").append('svg')
	.attr("height", graph.container.height)
	.attr("width", graph.container.width);

	render(d, "total")

	//add our event listeners for the buttons
	document.getElementById("total").addEventListener('click', function(){
		render(d, "total")
	});
	document.getElementById("male").addEventListener('click', function(){
		render(d, "males")
	});
	document.getElementById("female").addEventListener('click',function(){
		render(d, "females");
	})
	document.getElementById("allAges").addEventListener('click',function(){
		render(d, "total");
	});
	document.getElementById("over50").addEventListener('click',function(){
		render(d.filter(function(a){
			return a.age >= 50
		}), "total");
	});
	document.getElementById("under50").addEventListener('click', function(){
		render(d.filter(function(a){
			return a.age < 50
		}), "total");
	});
});