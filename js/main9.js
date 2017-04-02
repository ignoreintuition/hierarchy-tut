//making x function of data

d3.json("data/age.json", function(d){

	var svg = d3.select("#graph").append('svg')
	.attr("height", 600)
	.attr("width", 800);

	function render(data, metric){
		// init
		var scale = d3.scaleLinear()
		.domain([500000, 6000000])
		.range([25, 250])

		var xScale = d3.scaleLinear()
		.domain([0, 100])
		.range([0,540]);

		var axis = d3.axisLeft().scale(scale);
		var xAxis = d3.axisBottom().scale(xScale);

		var rects = svg.selectAll("rect")
		.data(data);

		//enter
		rects.enter()
		.append("rect")
		.attr("fill", "red")
		.attr("y", 25)
		.attr("width", 3)
		.attr("height", function(d){ 
			return scale(d[metric]);  
		})
		.attr("x", function(d){ 
			return 60+ xScale(d['age'])
		});

		svg.append("g")
		.attr("transform", "translate(60,0)")
		.call(axis);

		svg.append("g")
		.attr("transform", "translate(60,275)")
		.call(xAxis);
		
		//update
		rects.transition().duration(750)
		.attr("height", function(d){ 
			return scale(d[metric]);  
		})
		svg.append("g")
		.attr("transform", "translate(60,0)")
		.call(axis);

		svg.append("g")
		.attr("transform", "translate(60,275)")
		.call(xAxis);

		//exit
		rects.exit().remove();
	}
	render(d.filter(function(a){return a.total > 4000000}), "total")
});