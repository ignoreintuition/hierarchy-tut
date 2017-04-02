d3.json("data/age.json", function(d){

	var scale = d3.scaleLinear()
	.domain([500000, 6000000])
	.range([50, 500])

	var svg = d3.select("#graph").append('svg')
	.attr("height", 300)
	.attr("width", 800);

	function render(data){
		// init
		var i = 0;
		var rects = svg.selectAll("rect")
		.data(data);

		//enter
		rects.enter()
		.append("rect")
		.attr("y", 5)
		.attr("width", 7)
		.attr("height", 100)
		.attr("x", function(d){ return i+=10; })
		//update

		//exit
		rects.exit().remove();
	}

	render(d)
});