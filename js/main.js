d3.json("data/age.json", function(d){

	var svg = d3.select("#graph").append('svg')
	.attr("height", 900)
	.attr("width", 1000);


	function render(data, metric, minRange, maxRange){
		// init
		minRange = minRange || 0;
		maxRange = maxRange || 100;	
		var scale = d3.scaleLinear()
		.domain([500000, 5000000])
		.range([250, 25]);

	//add in another scale
		var xScale = d3.scaleLinear()
		.domain([minRange, maxRange])
		.range([0,540]);

	//added x & y axis
		var axis = d3.axisLeft().scale(scale);
		var xAxis = d3.axisBottom().scale(xScale);

		var rects = svg.selectAll("rect")
		.data(data);
		
		//enter
		rects.enter()
		.append("rect")
		.attr("fill", "red")
		.attr("y", function(d){ 
			return scale(d[metric]);  
		})
		.attr("width", function(){
			return 500/data.length - 1;
		})
		.attr("height", function(d){ 
			return (scale(0) - scale(d[metric]));  
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
		.attr("y", function(d){ 
			return scale(d[metric]);  
		})
		.attr("height", function(d){ 
			return (scale(0) - scale(d[metric]));  
		})
		.attr("x", function(d){ 
			return 60+ xScale(d['age'])
		})
		.attr("width", function(){
			return 500/data.length - 1;
		})
		
		svg.selectAll("g")
        	.remove();		

		svg.append("g")
		.attr("transform", "translate(60,0)")
		.call(axis);

		svg.append("g")
		.attr("transform", "translate(60,275)")
		.call(xAxis);

        //exit
		rects.exit().remove();
	}

//added binding for buttons
	render(d, "total");
	document.getElementById("total").addEventListener('click',function(){
		render(d, "total");
	});
	document.getElementById("male").addEventListener('click',function(){
		render(d, "males");
	});
	document.getElementById("female").addEventListener('click',function(){
		render(d, "females");
	})
	document.getElementById("allAges").addEventListener('click',function(){
		render(d, "total");
	});
	document.getElementById("over50").addEventListener('click',function(){
		render(d.filter(function(a){return a.age >= 50}), "total", 50, 100);
	});
	document.getElementById("under50").addEventListener('click',function(){
		render(d.filter(function(a){return a.age < 50}), "total", 0, 49);
	});
});