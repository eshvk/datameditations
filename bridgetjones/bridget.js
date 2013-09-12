			var TRANSPARENT = 0.3;
				var OPAQUE = 1.0;
				var DISTRACTION = 0.075;
				d3.json("book_1_gist_subsampled.json",function(error, data){
					if (error) {
						console.log(error);
					}
					else {
						var weights = [];
						for (var day in data) {
							var datapoint = [];
							datapoint.push(parseInt(day,10));
							datapoint.push(data[day]["weight"]);
							datapoint.push(data[day]["date"]);
							datapoint.push(data[day]["summary"]);
							weights.push(datapoint);
						}
						generateBridgetsLife(weights);
				
					}
				});
				var jitter = function (epsilon) {
					return Math.random()*(2*epsilon) - epsilon;
				};
				var eliminateDISTRACTIONs = function (circles, currCircle) {
					circles.filter(function(d){
						return d[0] != currCircle[0][0].__data__[0];
					})
					.transition()
					.duration(200)
					.attr("fill-opacity",DISTRACTION);
					currCircle
					.transition()
					.duration(200)
					.attr("fill-opacity",OPAQUE);
				};
				var restoreAll = function (circles) {
					circles
					.transition()
					.duration(200)
					.attr("fill-opacity",TRANSPARENT);
				};
				var generateBridgetsLife = function (dataset) {
		
					var mean = d3.mean(dataset, function (dp) {
						return dp[1];
					});
					var w = 500;
					var h = 200;
					var r = 5;
					var yPadding = 30;
					var xPadding = 30;
					var xScale = d3.scale.linear()
											.domain([-xPadding, d3.max(dataset, function(d) {return d[0];} )])
											 .range([xPadding, w - xPadding]).nice();
					var yScale = d3.scale.linear()
											.domain([0, 2*d3.max(dataset, function(d) {return d[1];} )])
											.range([h - yPadding, yPadding]).nice();
					var xAxis = d3.svg.axis()
											.scale(xScale)
											.orient("bottom")
											.ticks(5);
					var yAxis = d3.svg.axis()
											.scale(yScale)
											.orient("left")
											.ticks(5);
					var svg = d3.select("body")
								.append("svg")
								.attr("width", w)
								.attr("height", h);
					svg.append("g")
						.attr("class","axis")
						.attr("transform", "translate(0," + (h - xPadding) + ")")
						.call(xAxis);
					svg.append("g")
						.attr("class","axis")
						.attr("transform", "translate(" + 1.25*yPadding + ",0)")
						.call(yAxis);
					svg.append("text")
						.attr("class", "title")
						.attr("text-anchor", "middle")
						.attr("x", w/2)
						.attr("y", 15)
						.text("Bridget Jones: A year of emotions, pounds");
					svg.append("text")
						.attr("class","label")
	    				.attr("text-anchor", "middle")
	   				    .attr("x", w/2)
	    				.attr("y", h - 5)
	  				    .text("days");
	  				svg.append("text")
	    				.attr("class", "label")
	   				    .attr("text-anchor", "middle")
	   				    .attr("x", -h/2)
	    				.attr("y", -2)
	   				    .attr("dy", ".75em")
	    				.attr("transform", "rotate(-90)")
	    				.text("pounds");
					var circles = svg.selectAll("circle")
									.data(dataset)
									.enter()
									.append("circle").attr("class","circle");
					circles
						 .attr("cx", function(d) { return xScale(d[0]); })
						 .attr("cy", function (d) { return yScale(d[1]) + jitter(r); })
						 .attr("r", r)
						 .attr("fill",function (d) {
							if (d[1] >= mean) {
								return "red";
							}
							else {
								return "green";
							}
							} )
						 .attr("fill-opacity",TRANSPARENT)
						 .on("mouseover",function(d) {
						 	eliminateDISTRACTIONs(d3.selectAll("circle"),d3.select(this));
							var xPosition = parseFloat(d3.select(this).attr("cx")) + w/4;
							var yPosition = parseFloat(d3.select(this).attr("cy")) + yPadding;
							d3.select("#caption")
							  .style("left", xPosition + "px")
	  						  .style("top", yPosition + "px")
	  						  .select("#value")
	  						  .text("On " + d[2] + ", Bridget wrote \"" + d[3] + "\"");
							//Show the caption
							d3.select("#caption")
							  .classed("hidden", false);
						 })
						 .on("mouseout",function() {
						 	restoreAll(d3.selectAll("circle"),d3.select(this));
						 	d3.select("#caption")
						 	   .classed("hidden", true);
						 });
				};