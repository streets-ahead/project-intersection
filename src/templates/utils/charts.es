import d3Selection from 'd3-selection';
import d3Scale from 'd3-scale';
import d3Array from 'd3-array';
import range from 'lodash/range';
import d3Transition from 'd3-transition';
import d3Shape from 'd3-shape';
import d3Ease from 'd3-ease';
import d3Interpolate from 'd3-interpolate';

const randomBetween = (from, to) => Math.floor(Math.random() * (to - from + 1) + from);

const w = 600;
const h = 200;
const width = 1;

function bounce(domNode) {
	const bars = 120;
	const anim = 300;
	const distance = 4;
	const dataset = range(bars).map((d) => 0);

	let yScale = d3Scale.scaleLinear()
		.domain([d3Array.min(dataset), d3Array.max(dataset)])
		.range([0, h]);

	//Create SVG element
	const svg = d3Selection.select(domNode)
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	//Create bars
	svg.selectAll("rect")
		.data(dataset, (d, i) =>  i)
		.enter()
		.append("rect")
		.attr("x", (d, i) => (i * (distance + width)))
		.attr("y", (d, i) => h - yScale(d))
		.attr("width", width)
		.attr("height", (d) => yScale(d))
		.attr("fill", (d) => "rgba(255, 255, 255, 0.7)")

	const step = 0;
	setInterval(() => {
		const cos = step % 2;
		const data = range(bars)
	    .map((d) => randomBetween(0, 100));

	    yScale = d3Scale.scaleLinear()
		    .domain([d3Array.min(data), d3Array.max(data)])
		    .range([30, h]);
        
	    svg.selectAll("rect")
		    .data(data)
		    .transition().ease(d3Ease.easeLinear).duration(anim)
		    .attr("y", (d, i) => h - yScale(d))
		    .attr("height", (d) => yScale(d))
	  }, anim);
}

function siri(domNode) {
	const bars = 10;
	const anim = 400;
  const distance = 7;

  const svg = d3Selection.select(domNode)
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  function generateChart(container, key) {
    const dataset = range(3).map((i) => {
      return range(bars).map((d) => randomBetween(0, 3));
    });
  
    const x = d3Scale.scaleLinear()
      .domain([0, bars])
      .range([0, w]);

    var y = d3Scale.scaleLinear()
      .domain([5, 0])
      .range([0, h]);

    var area = d3Shape.area()
      .x((d, i) =>  x(i))
      .y1(h)
      .y0((d) => y(d))
      .curve(d3Shape.curveBasis);

    var el = container.selectAll('path')
      .data(dataset, (d, i) => i);

    el.enter()
      .append("path")
      .attr("class", (d, i) => "area" + i);
    
    el.transition().ease(d3Ease.easeLinear).duration(anim)
      .attr("d", area);
  }

  generateChart(svg);
	setInterval(() => generateChart(svg), anim);
}

function sinChart(domNode) {
	const bars = 120;
	const anim = 800;
	const distance = 7;

	const dataset = range(bars).map((d) => 0);

	let yScale = d3Scale.scaleLinear()
		.domain([d3Array.min(dataset), d3Array.max(dataset)])
		.range([0, h]);

	//Create SVG element
	const svg = d3Selection.select(domNode)
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	//Create bars
	svg.selectAll("rect")
		.data(dataset, (d, i) => i)
		.enter()
		.append("rect")
		.attr("x", (d, i) => (i * (distance + width)))
		.attr("y", (d, i) => h - yScale(d))
		.attr("width", width)
		.attr("height", (d) => yScale(d))
		.attr("fill", (d) => "rgba(255, 255, 255, 0.7)");

	let step = 0;
	setInterval(() => {
		const cos = step % 2;
		const data = range(bars)
	    .map((d) => Math.sin(0.1*d + ((Math.PI * step) / 2)));
	    step += 0.5;
	    yScale = d3Scale.scaleLinear()
		    .domain([d3Array.min(data), d3Array.max(data)])
		    .range([30, h]);
	    
      svg.selectAll("rect")
		    .data(data)
		    .transition().ease(d3Ease.easeLinear).duration(anim)
		    .attr("y", (d, i) => h - yScale(d))
		    .attr("height", (d) => yScale(d))
	  }, anim);
}

export default {bounce, siri, sinChart};
