// initiate, render, and handle input for our events

d3.queue()
  .defer(d3.json, "data/age.json")
  .defer(d3.json, "data/generation.json")
  .await(function(error, d, g) {
    // create our svg element on the page
    barGraph.container.svg = d3.select("#graph").append('svg')
      .attr("height", barGraph.container.height)
      .attr("width", barGraph.container.width);

    pieChart.container.svg = d3.select("#chart").append('svg')
      .attr("height", pieChart.container.height)
      .attr("width", pieChart.container.width)

    var dg = d.map(function(obj) {
      var title = "";
      g.forEach(function(e) {
        if (obj.age >= e.min && obj.age <= e.max) {
          title = e.title
        }
      })
      return {
        "generation": title,
        "total": obj.total,
        "males": obj.males,
        "females": obj.females
      };
    });
    var grp = d3.nest()
      .key(function(d) {
        return d.generation;
      })
      .rollup(function(v) {
        return d3.sum(v, function(d) {
          return d.total;
        })
      })
      .entries(dg);

    barGraph.render(d, "total");
    pieChart.render(grp, "value");

    //add our event listeners for the buttons
    document.getElementById("total").addEventListener('click', function() {
      barGraph.render(d, "total")
    });
    document.getElementById("male").addEventListener('click', function() {
      barGraph.render(d, "males")
    });
    document.getElementById("female").addEventListener('click', function() {
      barGraph.render(d, "females");
    })
    document.getElementById("over50").addEventListener('click', function() {
      let td = d.filter(function(a) {
        return a.age >= 50
      });
      barGraph.render(td, "total");
    });
    document.getElementById("under50").addEventListener('click', function() {
      let td = d.filter(function(a) {
        return a.age < 50
      });
      barGraph.render(td, "total");
    });
  });
