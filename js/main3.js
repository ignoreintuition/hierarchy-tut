d3.json("data/age.json", function(d){

	var scale = d3.scaleLinear()
	.domain([500000, 6000000])
	.range([50, 500])

	var svg = d3.select("#graph").append('svg')
	.attr("height", 300)
	.attr("width", 800)
	.attr("style", "background: blue");

});