---
{
  "title": "HOTW: Tornado Chasing with Clojure",
  "author": "Terry Keeney",
  "subHead": "Will my quest to learn Clojure aid me in my quest to spot a twister?",
  "tags": ["clojure","hack"],
  "published": "Sun Feb 14 2016 00:36:41 GMT-0800 (PST)"
}
---

 > "Hack of the Week" is a weekly column wherein I produce some concoction of reasonably functional code aimed entirely at satisfying my own inner desires to experiment with various languages, libraries, frameworks or ideas. Topics are chosen for a number of reasons ranging from sheer curiosity to utter and complete jack-assery. Anything remotely related to the field of software development is fair game.

I grew up smack dab in the middle of Tornado Alley and in the ten or so years I was there a remarkable thing happened - I didn't see a single tornado! Perhaps it's because of this shocking aberration - or maybe it's sheer twisted desire - but I now have a very strong urge to be close enough to actually witness a tornado touch down. We're not talking "Bill Paxton strapped down in a toolshed close" - but close enough to see one from a "safe" distance with my naked eye - maybe even snap a pic to document my storm chasing prowess.

I had some close calls in the last few years - but I always JUST missed it - or was out of town the ONE week where I stood a reasonable chance. This week's hack won't actually help me see the tornado - but can go the extra step in torturing me and letting me know just how close I was to achieving my dream. Because I also have a strong interest in working more in functional languages I'll use my attempts to learn clojure to determine just how angry I should be on a daily basis.

The good folks at the University of Michigan have put together a decent enough site that I'll use for collecting my data. They post reported tornados over the last 48 hours - and it's this set I'll run daily. I'll be using the haversine formula to calculate distances - which will be good enough for my purposes - and because I'm either lazy or opportunistic googling returned the following clojure implementation of haversine in gist form. I'll be using it as is except to swap in the radius in miles as I was born in the States and I'm allergic to metric by birth.

Below is the result of my hour-ish of tinkering. Working from the inside out we have:

  * (parse <url>) - which will convert the xml returned to a map we can operate on
  * (:content ...) - which returns the list of xml nodes inside the root
  * (filter ...) - filters the list of nodes down to just those with the tag :tornado using the function defined: (fn [x] (= (:tag x) :tornado))
  * (map ...) - maps each item in the list of remaining maps to a new map defined by the provided function (fn [x] { :distance (haversine whereIBe {:lng <getLNGFromXML> :lat <getLATFromXML>}) :location <locationFromXML> :state <stateFromXML>})
  * uses the convenience function attr for pulling attributes from the xml map
  * uses the whereIBe variable that is my hard-coded location (ish)
  * creates a distance property in the map by calling the haversine method above
  * (sort-by (juxt :distance) ...) - takes the returned map and sorts the list by the distance

## Observations and Next Steps

  1) Clojure is a lot of fun and I think I'll continue my journey 
  1) coming from a largely imperative/OO world I feel I was forced to think a little more about what I was doing - could be the new paradigm - could be just that it was a new language - but I liked it!
  1) Light Table is awesome for real-time inline feedback as you code
  1) Next Up - barring the introduction of something shiny into my field of view - a bot to automatically calculate and send me the results
  1) AND as of this writing the nearest tornado over the last 48 hours was 274 miles away in Nebraska! 
