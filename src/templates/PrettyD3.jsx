import React from 'react';
import charts from './utils/charts';
import styles from '../../styles/custom.css';

export default class PrettyD3 extends React.Component {
  componentDidMount() {
    charts.bounce(this.refs.bounce);
    charts.siri(this.refs.siri);
    charts.sinChart(this.refs.wave);
  }
  
  render() {
    const {content} = this.props;
    
    return (
      <div>
        <p>D3 is an amazing data visualization library, but this article has little to do with that.  
        Recently I took a couple hours just to play around with making some d3.js exmaples that look cool,
        without much purpose other than that.
        </p>
        <h2>Rocking Out</h2>
        <div className={styles['bounce']}>
          <div style={{width: 600, margin: "30px auto"}} ref="bounce"></div>
        </div>
        <p>
          The first sample has some bouncing lines, looks a little like a music visualizer, but 
          in this case the data is random.  This is a pretty basic example of a d3 line chart with some styling
          and a transition.  
        </p>
        <pre>
          <code dangerouslySetInnerHTML={{__html: `  
<span class="hljs-keyword">const</span> dataset = <span class="hljs-keyword">range</span>(bars).map((<span class="hljs-keyword">d</span>) =&gt; 0);

let yScale = d3Scale.scaleLinear()
  .domain([d3Array.<span class="hljs-built_in">min</span>(dataset), d3Array.<span class="hljs-built_in">max</span>(dataset)])
  .<span class="hljs-keyword">range</span>([0, <span class="hljs-keyword">h</span>]);

<span class="hljs-comment">//Create SVG element</span>
<span class="hljs-keyword">const</span> svg = d3Selection.select(domNode)
  .<span class="hljs-keyword">append</span>(<span class="hljs-string">&quot;svg&quot;</span>)
  .attr(<span class="hljs-string">&quot;width&quot;</span>, w)
  .attr(<span class="hljs-string">&quot;height&quot;</span>, <span class="hljs-keyword">h</span>);

<span class="hljs-comment">//Create bars</span>
svg.selectAll(<span class="hljs-string">&quot;rect&quot;</span>)
  .data(dataset, (<span class="hljs-keyword">d</span>, i) =&gt;  i)
  .enter()
  .<span class="hljs-keyword">append</span>(<span class="hljs-string">&quot;rect&quot;</span>)
  .attr(<span class="hljs-string">&quot;x&quot;</span>, (<span class="hljs-keyword">d</span>, i) =&gt; (i * (distance + width)))
  .attr(<span class="hljs-string">&quot;y&quot;</span>, (<span class="hljs-keyword">d</span>, i) =&gt; <span class="hljs-keyword">h</span> - yScale(<span class="hljs-keyword">d</span>))
  .attr(<span class="hljs-string">&quot;width&quot;</span>, width)
  .attr(<span class="hljs-string">&quot;height&quot;</span>, (<span class="hljs-keyword">d</span>) =&gt; yScale(<span class="hljs-keyword">d</span>))
  .attr(<span class="hljs-string">&quot;fill&quot;</span>, (<span class="hljs-keyword">d</span>) =&gt; <span class="hljs-string">&quot;rgba(255, 255, 255, 0.7)&quot;</span>)

<span class="hljs-keyword">const</span> step = 0;
setInterval(() =&gt; {
  <span class="hljs-keyword">const</span> cos = step % 2;
  <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">range</span>(bars)
    .map((<span class="hljs-keyword">d</span>) =&gt; randomBetween(0, 100));

    yScale = d3Scale.scaleLinear()
      .domain([d3Array.<span class="hljs-built_in">min</span>(data), d3Array.<span class="hljs-built_in">max</span>(data)])
      .<span class="hljs-keyword">range</span>([30, <span class="hljs-keyword">h</span>]);

    svg.selectAll(<span class="hljs-string">&quot;rect&quot;</span>)
      .data(data)
      .transition().ease(d3Ease.easeLinear).duration(anim)
      .attr(<span class="hljs-string">&quot;y&quot;</span>, (<span class="hljs-keyword">d</span>, i) =&gt; <span class="hljs-keyword">h</span> - yScale(<span class="hljs-keyword">d</span>))
      .attr(<span class="hljs-string">&quot;height&quot;</span>, (<span class="hljs-keyword">d</span>) =&gt; yScale(<span class="hljs-keyword">d</span>))
  }, anim);
          `}}>
          </code>
        </pre>
        
        <h2>Sin Wave</h2>
        <div className={styles['wave']}>
          <div style={{width: 600, margin: "30px auto"}} ref="wave"></div>
        </div>
        <p>
          What if you replace the setInterval portion of the first sample with the following?
          Replacing the bar height function with a sin wave instead of just random data.
        </p>
        <pre><code dangerouslySetInnerHTML={{__html: `
let step = 0;
setInterval(() =&gt; {
    <span class="hljs-keyword">const</span> cos = step % 2;
    <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">range</span>(bars)
    .map((<span class="hljs-keyword">d</span>) =&gt; Math.<span class="hljs-built_in">sin</span>(0.1*<span class="hljs-keyword">d</span> + ((Math.PI * step) / 2)));
    step += 0.5;
    yScale = d3Scale.scaleLinear()
        .domain([d3Array.<span class="hljs-built_in">min</span>(data), d3Array.<span class="hljs-built_in">max</span>(data)])
        .<span class="hljs-keyword">range</span>([30, <span class="hljs-keyword">h</span>]);

    svg.selectAll(<span class="hljs-string">&quot;rect&quot;</span>)
        .data(data)
        .transition().ease(d3Ease.easeLinear).duration(anim)
        .attr(<span class="hljs-string">&quot;y&quot;</span>, (<span class="hljs-keyword">d</span>, i) =&gt; <span class="hljs-keyword">h</span> - yScale(<span class="hljs-keyword">d</span>))
        .attr(<span class="hljs-string">&quot;height&quot;</span>, (<span class="hljs-keyword">d</span>) =&gt; yScale(<span class="hljs-keyword">d</span>))
  }, anim);
`}}></code></pre>
        
        <h2>WatchOS 1 Siri</h2>
        <div className={styles['siri']}>
          <div style={{width: 600, margin: "30px auto"}} ref="siri"></div>
        </div>
        <p>
          The last exaple resembles the siri visualization from the first WatchOS, on iOS 9 and WatchOS2 
          its a little different, so that is a challenge for another day.  Again this example is 
          pretty simple.  One additional thing I had to do to get this effect was to apply <code>mix-blend-mode: lighten;</code> style to the SVG paths.
        </p>
        <pre><code dangerouslySetInnerHTML={{__html: `
const svg = d3Selection.select(domNode)
  .append(<span class="hljs-string">&quot;svg&quot;</span>)
  .attr(<span class="hljs-string">&quot;width&quot;</span>, w)
  .attr(<span class="hljs-string">&quot;height&quot;</span>, h);

function generateChart(container, key) {
  const dataset = range(<span class="hljs-number">3</span>).map(<span class="hljs-function"><span class="hljs-params">(i)</span> =&gt;</span> {
    <span class="hljs-keyword">return</span> range(bars).map(<span class="hljs-function"><span class="hljs-params">(d)</span> =&gt;</span> randomBetween(<span class="hljs-number">0</span>, <span class="hljs-number">3</span>));
  });

  const x = d3Scale.scaleLinear()
    .domain([<span class="hljs-number">0</span>, bars])
    .range([<span class="hljs-number">0</span>, w]);

  var y = d3Scale.scaleLinear()
    .domain([<span class="hljs-number">5</span>, <span class="hljs-number">0</span>])
    .range([<span class="hljs-number">0</span>, h]);

  var area = d3Shape.area()
    .x(<span class="hljs-function"><span class="hljs-params">(d, i)</span> =&gt;</span>  x(i))
    .y1(h)
    .y0(<span class="hljs-function"><span class="hljs-params">(d)</span> =&gt;</span> y(d))
    .curve(d3Shape.curveBasis);

  var el = container.selectAll(<span class="hljs-string">&apos;path&apos;</span>)
    .data(dataset, <span class="hljs-function"><span class="hljs-params">(d, i)</span> =&gt;</span> i);

  el.enter()
    .append(<span class="hljs-string">&quot;path&quot;</span>)
    .attr(<span class="hljs-string">&quot;class&quot;</span>, <span class="hljs-function"><span class="hljs-params">(d, i)</span> =&gt;</span> <span class="hljs-string">&quot;area&quot;</span> + i);

  el.transition().ease(d3Ease.easeLinear).duration(anim)
    .attr(<span class="hljs-string">&quot;d&quot;</span>, area);
}

generateChart(svg);
setInterval(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> generateChart(svg), anim);
`}}></code></pre>
        
      <p>Well that's all for today. You can checkout the entire source on <a href="https://github.com/streets-ahead/project-intersection/blob/master/src/templates/utils/charts.es">github</a>.  
      Thanks for reading!
      </p>
      </div>
    );
  }  
}
