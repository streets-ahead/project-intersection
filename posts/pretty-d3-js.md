---
{
  "title": "Pretty d3.js",
  "author": "Sam Mussell",
  "subHead": "Some simple fun with d3.js.",
  "tags": ["data viz","d3.js","javascript"],
  "published": "Thu Mar 10 2016 22:58:54 GMT-0800 (PST)",
  "innerTemplate": "PrettyD3"
}
---

D3 is an amazing data visualization library, but this article has little to do with that.  
Recently I took a couple hours just to play around with making some d3.js exmaples that look cool,
without much purpose other than that.  The following three examples are all based around the same basic code and data generation.  Obvioulsy if this was production code I'd do a little more work to refactor the common pieces, but this code was more about hacking to get it to look right.

## Rocking Out

<div class='bounce'>
  <div style="width: 600px; margin: 30px auto" ref="bounce"></div>
</div>

The first sample has some bouncing lines, looks a little like a music visualizer, but 
in this case the data is random.  This is a pretty basic example of a d3 line chart with some styling
and a transition.  

```
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
```

## Sin Wave

<div class="wave">
  <div style="width: 600px, margin: 30px auto"></div>
</div>

What if you replace the setInterval portion of the first sample with the following? Replacing the bar height function with a sin wave instead of just random data.

```
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
```

## WatchOS 1 Siri

<div class="siri">
  <div style="width: 600px, margin: 30px auto"></div>
</div>

The last exaple resembles the siri visualization from the first WatchOS, on iOS 9 and WatchOS2 
its a little different, so that is a challenge for another day.  Again this example is 
pretty simple.  One additional thing I had to do to get this effect was to apply <code>mix-blend-mode: lighten;</code> style to the SVG paths.

```
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
```
                
Well that's all for today. You can checkout the entire source on [github](https://github.com/streets-ahead/project-intersection/blob/master/src/templates/utils/charts.es).  Thanks for reading!
      
