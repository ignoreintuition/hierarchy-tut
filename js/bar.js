// dataViz
// a tutorial on creating data vizualizations in JavaScript using D3

// Graph is an object that is accessible throughout the IIFE
// that contains all of the metadata about the graph and the container.
var barGraph = {
    container: {
        svg: null,
        xOffset: 60,
        yOffset: 0,
        height: 300,
        width: 650
    },
    rects: null,
    xScale: null,
    yScale: null,
    xAxis: null,
    yAxis: null,
    metric: null,
    x: function(d) {
        return this.container.xOffset + this.xScale(d['age'])
    },
    y: function(d) {
        return this.yScale(d[this.metric]);
    },
    height: function(d) {
        return (this.yScale(0) - this.yScale(d[this.metric]));
    },

    // tooltips will display the info about the currently highlignted item.
    _toolTip: function(d) {
        this.container.svg.append("text")
            .attr("x", this.xScale(d['age']))
            .attr("y", this.yScale(d[this.metric]))
            .attr("class", "tt")
            .text("Age: " + d.age + " Pop: " + d[this.metric]);
    },

    //Remove tooltip will erase it from the screen on mouseout.
    _removeToolTip: function(d) {
        this.container.svg.selectAll(".tt").remove();
    },

    // _drawAxis draws a new x and y axis based off of the offsets
    // in the this object
    _drawAxis: function(d) {
			self = this;
        self.container.svg.selectAll("g").remove();
        self.container.svg.selectAll("g").data(d).enter()
            .append("g")
            .attr("transform", "translate(" + self.container.xOffset + "," + self.container.yOffset + ")")
            .call(self.yAxis);

        self.container.svg.append("g")
            .attr("transform", "translate(" + self.container.xOffset + ",275)")
            .call(self.xAxis);
    },

    // _initPhase is going to set the metric, scales, domains, and axis
    // it will bind the data to our svg element
    _init: function(d, m) {
        this.metric = m;
        this.xScale = d3.scaleLinear()
            .domain([
                d3.min(d, function(d) {
                    return d.age;
                }),
                d3.max(d, function(d) {
                    return d.age;
                })
            ])
            .range([0, 540]);

        this.yScale = d3.scaleLinear()
            .domain([500000, 5000000])
            .range([250, 25]);
        this.yAxis = d3.axisLeft().scale(this.yScale);
        this.xAxis = d3.axisBottom().scale(this.xScale);

        this.rects = this.container.svg.selectAll("rect")
            .data(d)
    },

    // _enterPhase will run once when our svg is first rendered
    // we will set any static attributes here
    _enter: function(d) {
        let self = this;
        let w = (480 / d.length);
        self.rects.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", w)
            .attr("y", function(d) {
                return self.y(d);
            })
            .attr("height", function(d) {
                return self.height(d);
            })
            .attr("x", function(d) {
                return self.x(d);
            })
            .on("mouseover", function(d) {
                self._toolTip(d);
            })
            .on("mouseout", function(d) {
                self._removeToolTip(d);
            });
        self._drawAxis(d)
    },

    // _updatePhase will run every time the graph is redrawn
    // we will only update dynamic elements here
    _update: function(d) {
        let self = this;
        let w = Math.floor(540 / d.length);
        self.rects.transition().
        duration(750)
            .attr("width", w)
            .attr("y", function(d) {
                return self.y(d);
            })
            .attr("height", function(d) {
                return self.height(d);
            })
            .attr("x", function(d) {
                return self.x(d);
            });
    },

    // _exitPhase is for cleanup
    _exit: function() {
        this.rects.exit().remove();
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
