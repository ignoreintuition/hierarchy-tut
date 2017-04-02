//example 2
d3.json("data/age.json", function(d){

	var scale = d3.scaleLinear()
	.domain([500000, 6000000])
	.range([50, 500])

	// console.log(scale(500000))
	// console.log(scale(6000000))
	// console.log(scale(3000000))

	d.forEach( function(a){
		console.log("domain: " + a.total )
		console.log("range: " + scale(a.total) )
	})
});