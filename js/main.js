// initiate, render, and handle input for our events

d3.json("data/age.json", function(d) {
    // create our svg element on the page
    barGraph.container.svg = d3.select("#graph").append('svg')
        .attr("height", barGraph.container.height)
        .attr("width", barGraph.container.width);

    pieChart.container.svg = d3.select("#chart").append('svg')
            .attr("height", pieChart.container.height)
            .attr("width", pieChart.container.width)

    barGraph.render(d, "total");
    pieChart.render(d, "total");
    
    //add our event listeners for the buttons
    document.getElementById("total").addEventListener('click', function() {
        barGraph.render(d, "total")
        pieChart.render(d, "total");
    });
    document.getElementById("male").addEventListener('click', function() {
        barGraph.render(d, "males")
        pieChart.render(d, "males");
    });
    document.getElementById("female").addEventListener('click', function() {
        barGraph.render(d, "females");
        pieChart.render(d, "females");
    })
    document.getElementById("over50").addEventListener('click', function() {
        let td = d.filter(function(a) {
            return a.age >= 50
        });
        barGraph.render(td, "total");
        piechart.render(td, "total");
    });
    document.getElementById("under50").addEventListener('click', function() {
        let td = d.filter(function(a) {
            return a.age < 50
        });
        barGraph.render(td, "total");
        pieChart.render(td, "total");
    });
});
