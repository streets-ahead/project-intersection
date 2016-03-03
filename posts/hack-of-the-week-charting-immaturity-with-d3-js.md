---
{
  "title": "HOTW: Charting Immaturity with d3.js",
  "subHead": "In this the inaugural post of my Hack of the Week series I explore a question I've posed - at least to myself - several times.",
  "author": "Terry Keeney",
  "tags": ["react.js","d3","hack"],
  "published": "Wed Jul 08 2015 17:20:00 GMT-0700 (PDT)"
}
---
 > "Hack of the Week" is a weekly column wherein I produce some concoction of reasonably functional code aimed entirely at satisfying my own inner desires to experiment with various languages, libraries, frameworks or ideas. Topics are chosen for a number of reasons ranging from sheer curiosity to utter and complete jack-assery. Anything remotely related to the field of software development is fair game.

In this the inaugural post of my Hack of the Week series I explore a question I've posed - at least to myself - several times. 

Over the course of several years I've had an on-going group skype conversation with a few work proximity associates.  While Michael Scott was bringing back the always hilarious "That's what she said", we were stuck in our own world with the delightfully juvenile classic "your mom" quips.  At some point over the years I began to wonder - What would be our average "your mom" depth? - that is - how deep into a conversation on average do we get before someone's mother is dragged into the conversation?  This weeks hack is the result of exploring that very question - along with a long deep-seeded urge to play with d3 a little more in the hopes of convincing myself that mere mortals could in fact build wonderful things and it wasn't simply limited to the visualization sorcery of Mr. Bostock.

#### Collecting the Data
The first step was to accumulate the data in an easily processable format.  I chose CSV because of d3's built in csv capabilities - and frankly exporting the results of a SQL query to CSV is a trivial task.  Luckily a quick Something Search revealed that someone had [already done the work of figuring out how to query Skype's SQLite database on your local machine](http://www.huesler-informatik.ch/2014/08/29/exporting-skype-conversations-on-osx/).  If you don't want to read the guide the short version is to open the SQLite database with the following command (I'm on a Mac): 
`sqlite3 ~/Library/Application\ Support/Skype/<your skype name>/main.db`.  Once you're there you'll want to play around with the tables and queries for a bit to find exactly what you want - but eventually I got to the point of creating my csv with the following:  

```
sqlite> .mode csv  
sqlite> .output /tmp/your-mom.csv  
sqlite> select author, timestamp, body_xml from messages where convo_id=275;   
sqlite> .quit
```

#### Making the Magic Happen
After downloading the data and some quick groovy scripting (not part of this) I had my answer for our median "your mom" depth.  The result was thoroughly underwhelming and I wondered what it'd look like to graph the results. I brilliantly concluded a scatter plot would be best to showcase who amongst us generally initiated the mother bashing and how deep into the conversation it happened.  So d3 to the rescue.

First up is to include the d3 library in your page.  You can choose to download locally but I pulled from a cdn
```language-html
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
```

Next, I'll setup an area in my HTML where I'll create my canvas

```language-html
<body>
   <div id="container"></div>
</body>
```

Then we move on to some real javascript work and start digging into some d3 code.  I begin by creating setting up my canvas that will host this masterpiece.

```language-javascript
//setup your canvas
var svg = d3.select("#container")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 500)
    .append("g")
    .attr("transform","translate(35,25)");
```

The numbers here and as I continue are mostly trial and error as I settle on something acceptable.  I may or may not get better at that as I continue my visualization journey.  

Next setup the functions that will drive the axes and the x and y coordinates for the data points

```language-javascript
// Set the ranges
var x = d3.time.scale().range([0, 950]);
var y = d3.scale.linear().range([0, 450]);
	 
// Define the axes
var xAxis = d3.svg.axis().scale(x).orient("top").ticks(5);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
```

Now that the canvas is set and some foundations are established we fetch our beautifully extracted csv and join the data 

```language-javascript
// Get the data
d3.csv("redacted.csv", function(error, data) {
  data.forEach(function(d){
    // data calculations
  });

  // more data transformation/setup

  /* Paint the canvas */
  // Scale the range of the data
  x.domain(d3.extent(dataList, function(d) { return d.date; }));
  y.domain([0, d3.max(dataList, function(d) { return d.momDepth || 0; })]);

  // Add the X Axis
  svg.append("g")		
    .attr("class", "x axis")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")		
    .attr("class", "y axis")
    .call(yAxis);

  svg.selectAll("circle")
    .data(dataList)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d){ return x(d.date); })
    .attr("cy", function(d){ return y(d.momDepth)})
    .attr("fill", function(d){ 
      return {"T": "#EEA941",
              "S": "#47FDE2",
              "D": "#FEABC8"}[d.thread[d.momDepth].author] 
    });

});
```

The details of the data setup is left as an exercise for the reader - but suffice it to say it calculates the information I wanted to plot and prepares the dataList for joining the data with the canvas elements. If you're absolutely dying to see what's going on there feel free to check it out on [github](https://github.com/terrylk2/WeeklyHacks/tree/master/20150707-d3-skype).  After we have the data calculated the way we like it - it's time to join it with the canvas elements and paint our masterpiece.
Moving through the rest of the code above we:

* setup the x and y data domains with the date and depths respectively - this basically sets the bounds of our axes
* call the axes functions to create our axes
* join the data to the circle elements and set some attributes
  * set the x & y coordinates using the functions created earlier
  * add some fill based on author to color code the whole thing
* Remember to do this all inside the csv callback as it's fetch asynchronously and it's difficult to chart data you don't have

Annnnd....Voila!

![](/images/maturity.png)

#### Facing Difficult Truths

When all was said and done I realized I'd accidentally graphed the relative maturities of those in the group and, perhaps un-shockingly, discovered I'm by far the most immature in the group.  Being the most likely to rail on the mothers early and hitting it as often as my colleagues combined, I'm clearly stuck in a state of arrested development.  After some serious reflection and reevaluating my options I've decided not to change a single thing about myself.  It took some serious soul searching but I've decided after thirty years I'm unlikely to really change anyway - and this way I still get to write these sort of posts.

Good Day and Hasta la Next Week
