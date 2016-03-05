---
{
  "title": "Dynamically Generate Histogram Images with Node.js and Canvas",
  "subHead": "",
  "author": "Sam Mussell",
  "tags": ["swift", "javascript", "node"],
  "published": "Thu Aug 09 2012 19:52:17 GMT-0700 (PDT)"
}
---

As part of a new iOS app I've been working on I had the need to dynamically generate some images to represent some data.  I have played a little with HTML5 canvas before, and I stumbled upon [this project](https://github.com/learnboost/node-canvas/) a while back so I decided it was time to give it a try to see if it would fullfill my need.  In the end it ended up working out really well, I was able to throw the following proof of concept together in about 20 minutes (after about an hour of fighting through the install, there are a few pain points in Mountain Lion).   

#### Start by installing node-canvas

```
npm install --save canvas
```

_On Mac you may need to install Cairo_

```
brew install cairo
```

Here is the code used to render my histogram

```javascript
var http = require('http');
var Canvas = require('canvas');
var url = require('url');

var WIDTH = 30;
var HEIGHT = 60;
var DEFAULT_COLOR = '#58C6C2';

function render(canvas, numbers, color) { 
	ctx = canvas.getContext('2d');
	
	var biggestNumber = Math.max.apply(null, numbers);

	var currentX = 10 + WIDTH/2;
	var lineHeight = 0;
	
	ctx.beginPath();
	ctx.moveTo(currentX, HEIGHT + 10);
	ctx.lineWidth = WIDTH;
	ctx.strokeStyle = color;
	
 	numbers.forEach(function(it, ind) {
		lineHeight = (HEIGHT+10) - (HEIGHT * (it / biggestNumber));

		ctx.lineTo(currentX, lineHeight);
		currentX += WIDTH;
  	ctx.moveTo(currentX, HEIGHT + 10);
	});
	
	ctx.closePath();
	ctx.stroke();
}
```

So, you can see its really simple code, I just get a graphics context, then initialize some variables.  Then I just create a path containing a line for every number I pass in.  And one of the nice side effects of using node-canvas is that the above code will also run in the browser so I could generate my histograms client side or server side.

Now that I have my rendering code set up I need to create my web server.  This is very basic, but it works for a proof of concept.

```
http.createServer(function (req, res) {
	var q = url.parse(req.url, true).query;
	try {
		var numbers = JSON.parse(q.numbers);
		var canvas = new Canvas(numbers.length*WIDTH + 20, HEIGHT+10);
		var color = q.color ? '#' + q.color : DEFAULT_COLOR;
		render( canvas, numbers, color );
	  	
	  res.writeHead(200, { 'Content-Type': 'image/png' });
		canvas.toBuffer(function(err, buf){
			res.write(buf);
			res.end();
		});
	} catch (e) {
		console.error(e);
		res.writeHead(500);
		res.end('Internal Server Error');
	}
}).listen(8888, function() { console.log('Server started on port 8888'); });
```
	
That's pretty much it, I just write my canvas out to a buffer and then write the buffer to the client.  Now I can use the following to call my service.

[http://localhost:8888/img.png?numbers=[2,4,1,3,2,10,5,2,2,1,4]](http://localhost:8888/img.png?numbers=[2,4,1,3,2,10,5,2,2,1,4])

And I get:

![image](/images/histo1.png)

I can also specify a different color…

[http://localhost:8888/img.png?numbers=[3,4,6,3,2,2,8,2,7,2,1,4]&color=EA6045](http://localhost:8888/img.png?numbers=[3,4,6,3,2,2,8,2,7,2,1,4]&color=EA6045)

Which looks like:

![image](/images/histo2.png)

So this was pretty quick and dirty, but I think that this could prove very useful.  You can see that there are all sorts of possibilities where this could be useful.

Check out the full source on [GitHub](https://github.com/streets-ahead/histo-service).  Thanks for reading.

### Links

  * [Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Canvas_tutorial)
  * [node-canvas](https://github.com/learnboost/node-canvas/)
  * [GitHub Project](https://github.com/streets-ahead/histo-service)
	
