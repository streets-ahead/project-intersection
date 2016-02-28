---
{
  "title": "HOTW: Charting Immaturity with d3.js",
  "subHead": "In this the inaugural post of my Hack of the Week series I explore a question I've posed - at least to myself - several times.",
  "author": "Terry Keeney",
  "tags": ["react.js","d3","hack"],
  "published": "Sun Feb 14 2016 00:38:33 GMT-0800 (PST)"
}
---
 > "Hack of the Week" is a weekly column wherein I produce some concoction of reasonably functional code aimed entirely at satisfying my own inner desires to experiment with various languages, libraries, frameworks or ideas. Topics are chosen for a number of reasons ranging from sheer curiosity to utter and complete jack-assery. Anything remotely related to the field of software development is fair game.

In this the inaugural post of my Hack of the Week series I explore a question I've posed - at least to myself - several times.

Over the course of several years I've had an on-going group skype conversation with a few work proximity associates. While Michael Scott was bringing back the always hilarious "That's what she said", we were stuck in our own world with the delightfully juvenile classic "your mom" quips. At some point over the years I began to wonder - What would be our average "your mom" depth? - that is - how deep into a conversation on average do we get before someone's mother is dragged into the conversation? This weeks hack is the result of exploring that very question - along with a long deep-seeded urge to play with d3 a little more in the hopes of convincing myself that mere mortals could in fact build wonderful things and it wasn't simply limited to the visualization sorcery of Mr. Bostock.

## Collecting the Data

The first step was to accumulate the data in an easily processable format. I chose CSV because of d3's built in csv capabilities - and frankly exporting the results of a SQL query to CSV is a trivial task. Luckily a quick Something Search revealed that someone had already done the work of figuring out how to query Skype's SQLite database on your local machine. If you don't want to read the guide the short version is to open the SQLite database with the following command (I'm on a Mac): 
sqlite3 ~/Library/Application\ Support/Skype/<your skype name>/main.db. Once you're there you'll want to play around with the tables and queries for a bit to find exactly what you want - but eventually I got to the point of creating my csv with the following:

## Making the Magic Happen

After downloading the data and some quick groovy scripting (not part of this) I had my answer for our median "your mom" depth. The result was thoroughly underwhelming and I wondered what it'd look like to graph the results. I brilliantly concluded a scatter plot would be best to showcase who amongst us generally initiated the mother bashing and how deep into the conversation it happened. So d3 to the rescue.

First up is to include the d3 library in your page. You can choose to download locally but I pulled from a cdn

The numbers here and as I continue are mostly trial and error as I settle on something acceptable. I may or may not get better at that as I continue my visualization journey.

Next setup the functions that will drive the axes and the x and y coordinates for the data points

The details of the data setup is left as an exercise for the reader - but suffice it to say it calculates the information I wanted to plot and prepares the dataList for joining the data with the canvas elements. If you're absolutely dying to see what's going on there feel free to check it out on github. After we have the data calculated the way we like it - it's time to join it with the canvas elements and paint our masterpiece. 
Moving through the rest of the code above we:

  * setup the x and y data domains with the date and depths respectively - this basically sets the bounds of our axes
  * call the axes functions to create our axes
  * join the data to the circle elements and set some attributes
  * set the x & y coordinates using the functions created earlier
  * add some fill based on author to color code the whole thing
  * Remember to do this all inside the csv callback as it's fetch asynchronously and it's difficult to chart data you don't have

Annnnd....Voila! 
