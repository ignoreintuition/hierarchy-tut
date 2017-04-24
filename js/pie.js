// dataViz
// a tutorial on creating data vizualizations in JavaScript using D3

// Graph is an object that is accessible throughout the IIFE
// that contains all of the metadata about the graph and the container.
var pieChart = {
    container: {
        svg: null,
        xOffset: 60,
        yOffset: 0,
        height: 200,
        width: 300
    },
    radius: 100,
    metric: null,
    arc: null,
    path: null,
    arc: null,
    pie: null,
    color: null,

    _toolTip: function(d) {
        this.container.svg.append("text")
            .attr("x", 10)
            .attr("y", 10)
            .attr("class", "tt")
            .text(d.data["key"]);
    },

    //Remove tooltip will erase it from the screen on mouseout.
    _removeToolTip: function(d) {
        this.container.svg.selectAll(".tt").remove();
    },
    // _initPhase is going to set the metric, scales, domains, and axis
    // it will bind the data to our svg element
    _init: function(d, m) {
        let self = this;
        self.metric = m;
        self.pie = d3.pie()
        .sort(null)
        .value(function(d) { return d[self.metric]; });

        self.path = d3.arc()
            .outerRadius(self.radius - 10)
            .innerRadius(25);
        self.arc = this.container.svg.selectAll(".arc")
            .data(self.pie(d))
        self.color =  d3.scaleOrdinal()
            .range(["#C0D6CC", "#A3C2BA", "#7D9EA8", "#546A87", "#37386B", "5758AA"])
    },

    // _enterPhase will run once when our svg is first rendered
    // we will set any static attributes here
    _enter: function(d) {
        let self = this;
        self.arc.enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + self.container.width / 2 + "," + self.container.height / 2 + ")")
            .append("path")
            .attr("d", self.path)
            .attr("fill", function(d) {
              console.log(d.data["key"]);
              return self.color(d.data["key"]);
            })
            .on("mouseover", function(d) {
                self._toolTip(d);
            })
            .on("mouseout", function(d) {
                self._removeToolTip(d);
            });

    },

    // _updatePhase will run every time the graph is redrawn
    // we will only update dynamic elements here
    _update: function(d) {
        let self = this;
        self.arc.transition().
        duration(750)
        .attr("d", self.path)
        .attr("fill", function(d) {
          return self.color(d.key);
        });

    },

    // _exitPhase is for cleanup
    _exit: function() {
        this.arc.exit().remove();
    },

    // _render function should be called every time you want to redraw the graph
    // takes as parameters the data and the metric name
    render: function(d, m) {
        this._init(d, m);
        this._enter(d);
        this._update(d);
        this._exit();
    }
};
