// dataViz
// a tutorial on creating data vizualizations in JavaScript using D3

// Graph is an object that is accessible throughout the IIFE
// that contains all of the metadata about the graph and the container.
var barGraph = {
  container: {
    svg: null,
    height: 300,
    width: 650
  },
  rects: null,
  metric: null,

  // _initPhase is going to set the metric, scales, domains, and axis
  // it will bind the data to our svg element
  _init: function(d, m) {
    this.metric = m;
    console.log(d);
    this.rects = this.container.svg.selectAll("rect")
        .data(d)
    this.text = this.container.svg.selectAll("text")
        .data(d)
  },

  // _enterPhase will run once when our svg is first rendered
  // we will set any static attributes here
  _enter: function(d) {
    let self = this;
    self.rects.enter()
        .append("rect")
        .attr("width", function(d){ return d.value / 50000 })
        .attr("y", function(d, i){ return 20 * i })
        .attr("height", 18)
        .attr("x", 100)

    self.text.enter()
        .append("text")
        .attr("x", 0)
        .attr("y", function(d, i){ return 20 * i + 16 })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .text(function(d){ return d.data.name })
  },

  // _updatePhase will run every time the graph is redrawn
  // we will only update dynamic elements here
  _update: function(d) {
    let self = this;
  },

  // _exitPhase is for cleanup
  _exit: function() {
    this.rects.exit().remove();
  },

  // _render function should be called every time you want to redraw the graph
  // takes as parameters the data and the metric name
  render: function(d, m) {

    var heir = d3.hierarchy(d, function(d){
      return d.regions;
    });

    var root = heir.sum(function(d){
      return d.population;
    });

    // h.children.forEach(function(d){
    //   root = d.sum(function(d){return d.population});
    //   console.log("- " + root.data.name + ":" + root.value);
    // })
    var data = root.children[0].children[1].children;
    this._init(data, m);
    this._enter(data);
    this._update(data);
    this._exit();
  }
};
