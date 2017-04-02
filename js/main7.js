//Adding in update phase, second parameter

d3.json("data/age.json", function(d){

	var scale = d3.scaleLinear()
	.domain([500000, 6000000])
	.range([25, 250])

	var svg = d3.select("#graph").append('svg')
	.attr("height", 600)
	.attr("width", 800);

	function render(data, metric){
		// init
		var i = 0;
		var rects = svg.selectAll("rect")
		.data(data);

		//enter
		rects.enter()
		.append("rect")
		.attr("fill", "red")
		.attr("y", 5)
		.attr("width", 3)
		.attr("height", function(d){ 
			return scale(d[metric]);  
		})
		.attr("x", function(d){ return i+=4; })
		//update
		
		rects.transition().duration(750)
		.attr("height", function(d){ 
			return scale(d[metric]);  
		})

		//exit
		rects.exit().remove();
	}
	render(d, "males");

	setTimeout(function(){
		render(d, 'total');
	}, 1000);

	setTimeout(function(){
		render(d, 'males');
	}, 2000);

});