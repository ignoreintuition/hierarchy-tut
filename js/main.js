// initiate, render, and handle input for our events

d3.queue()
  .defer(d3.json, "data/state_pop.json")
  .await(function(error, d) {
    // create our svg element on the page
    barGraph.container.svg = d3.select("#graph").append('svg')
      .attr("height", barGraph.container.height)
      .attr("width", barGraph.container.width);
    barGraph.render(d, "total");
  });
