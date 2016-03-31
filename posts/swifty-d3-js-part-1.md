---
{
  "title": "Swifty d3.js: Part 1",
  "author": "Sam Mussell",
  "tags": ["swift","d3.js","data viz"],
  "published": "Thu Mar 31 2016 15:29:37 GMT-0700 (PDT)"
}
---

D3.js is a fantastic and powerful library, we've played with d3.js several times on this [blog](/posts/pretty-d3-js.html) [aleady](/posts/hack-of-the-week-charting-immaturity-with-d3-js.html).   D3 has all of sort of extremely powerful algorithms built in, it also has a DOM manipulation API, but one of the things that makes the d3 API great is the ability to separate the two.  You can take full advantage of d3's built in data crunching power, while rendering the output anyway you like.  In my day job I've done a lot of work with d3 + React.js.  React makes a great rendering engine for d3, it allows you to create reusable charting components that are easier for the end user to use than if it were pure d3.  Mike Bostock has been working hard in d3 4.0 to make this even better by breaking d3 down into smaller useful packages.  He has written several [articles](https://medium.com/@mbostock/introducing-d3-shape-73f8367e6d12?source=---------10-) on the [subject](https://medium.com/@mbostock/introducing-d3-scale-61980c51545f?source=---------9-).

We've also seen a ton of interest lately in React Native.  React native is interesting for several reasons, but the one I wanted to focus on here is that React Native allows you to process your UI in Javascript on a background thread and then render natively on the device.

## Let's Experiment

So, for this weeks experiment I wanted to make a simple POC using d3.js to process my data and then draw and animate the result using native Swift.  Swift Playgrounds offer a great way to throw together experiments like this.  There's just a couple things we need to setup to make the coding a little easier.  

### Webpack

First thing I want to setup is a really simple Webpack config so I can write my code with ES6 using babel, not strictly needed but useful.  This also makes it easy to serve my script using an HTTP server, I found this to be an easy way to load my script into the playground.  You could probably setup the webpack script to output to the resources folder in the playground, or pull some other trickery, but I had some trouble getting Xcode to pick up the changes reliably that way.  You can view my webpack script on [GitHub](https://github.com/streets-ahead/swifty-d3/blob/master/webpack.config.js).  

### d3 Time

The next step was coding up my d3 script, for the time being I kept it really simple.  Below is the whole script.

```javascript
import d3Scale from 'd3-scale';
import d3Shape from 'd3-shape';
import d3Array from 'd3-array';

export let getPath = (data, dim) => {  
  const [w, h] = dim;
  const x = d3Scale.scaleLinear()
    .domain([0, data.length])
    .range([0, w]);
  
  const y = d3Scale.scaleLinear()
    .domain([0, d3Array.max(data)])
    .range([0, h]);
    
  const line = d3Shape.line()
    .x((d, i) =>  x(i))
    .y((d, i) => y(d))
    .curve(d3Shape.curveBasis);
  
  return line(data);
}
```

All the script does is take an array of numbers and a w x h dimension, it creates x and y scales, then makes a simple line chart and returns the path.  In this case we're using the array to control the y axis and the array index to control the x.

Now we can test out the script, we just need to fire up webpack dev server.

```
webpack-dev-server --config webpack.config.js
```

At this point I created a little HTML page to load my script and did some simple testing, in a perfect world this would be the time to get out [Mocha](https://mochajs.org) and write some automated tests.

### Let's Play(ground)

Now that we have our JS working we need to create a new Playground.   I'll caution that I'm relatively new to Swift so it's possible I've done something less than optimal, if you have any suggestions let me know.  

The first step is to load the JS file, the following will give a warning because it uses the deprecated version of the API, but I had some issues when I tried to load the file async using the latest API, so I went back to the outdated sync version for now.

```
let url = NSURL(string: "http://localhost:8080/build/bundle.js")!
var request = NSURLRequest(URL: url)
var response: AutoreleasingUnsafeMutablePointer<NSURLResponse? >= nil
var error: NSErrorPointer = nil
var dataVal: NSData =  try NSURLConnection.sendSynchronousRequest(request, returningResponse: response)
let jsCode = NSString(data: dataVal, encoding: NSASCIIStringEncoding)
```

Now we have a `jsCode` variable containing the contents of our script, now we need to execute it.  To do that we'll use [JavascriptCore](https://developer.apple.com/library/tvos/documentation/Carbon/Reference/WebKit_JavaScriptCore_Ref/index.html).  This is effectively the same thing React Native does to execute your react code, I'd recommend checking out the [React implementation](https://github.com/facebook/react-native/blob/master/React/Executors/RCTJSCExecutor.m) if you're interested.

```
let jc = JSContext()
jc.evaluateScript(jsCode! as String)

let getPathFunc = jc.objectForKeyedSubscript("Paths").objectForKeyedSubscript("getPath")
```

Now we have a reference to our JS function we can go ahead and call it.

```
let result = getPathFunc.callWithArguments([[10,2,29,4,8,20,0,4], [500, 500]])
```

### Helpers

We now have our result string, which is an SVG path, SVG paths seemed like as good as any way to serialize the data from our JS so it works out well, we just need to process that path into CoreGraphics calls.  In order to do this I created a couple helper files.

The first thing we need is a way to parse the string, I decided to use some simple regex, the only issue I had is that I'm not a fan of NSRegularExpression, the API seems overly complicated, hopefully Swift can adopt a [good native](https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20160125/008593.html) regex syntax soon.  Anyway, for now here is my basic Swift regex utility.

```
import Foundation

public struct RegExp {
  let regExp: NSRegularExpression
  let pattern: String
  
  public init(_ pattern: String) {
    self.pattern = pattern
    do {
      try self.regExp = NSRegularExpression(pattern: pattern, options: .CaseInsensitive)
    } catch _ {
      self.regExp = NSRegularExpression()
    }
  }
  
  public func matches(input: String) -> [String] {
    let range = NSMakeRange(0, input.characters.count)
    return self.regExp.matchesInString(input, options: .WithoutAnchoringBounds, range: range)
      .map { (input as NSString).substringWithRange($0.range) }
  }
  
  public func test(input: String) -> Bool {
    let range = NSMakeRange(0, input.characters.count)
    return self.regExp.numberOfMatchesInString(input, options: .WithoutAnchoringBounds, range: range) > 0
  }
  
  public func test(input: Character) -> Bool {
    return self.test(String(input))
  }
}
```

I also decided to create a couple simple extensions to cleanup some of my calls for String and Array.  The following extension to string adds a regexp method to make it a little easier to instantiate a regex for a string.  I also added a splitBy method to make tokenization a little cleaner.

```
extension String {
  func regExp() -> RegExp {
    return RegExp(self)
  }
  
  func splitBy(token: String) -> [String] {
    return self.characters.split { String($0) == token }.map { String.init($0) }
  }
}
```

I also added a `chunk` method to array, this made it a little easier to group commands with arguments.

```
extension Array {
  func chunk(chunkSize : Int) -> Array<Array<Element>> {
    return 0.stride(to: self.count, by: chunkSize)
      .map { Array(self[$0..<$0.advancedBy(chunkSize, limit: self.count)]) }
  }
}
```

The last utility I created was a struct to represent an SVG drawing command. 

```
import Foundation
import UIKit


public struct Command {
  let code: String;
  let args: [Double];
  
  public static func pathToCommands(path: String) -> [Command]{
    let tokens = "([a-m])|(([0-9\\.]+,?)+)".regExp().matches(path)
    return tokens.chunk(2).map { Command(code: $0[0], args: $0[1]) }
  }
  
  public init(code: String, args: String) {
    self.code = code
    self.args = args.splitBy(",").map{ Double.init($0)! }
  }
  
  public var op: (bezierPath: UIBezierPath) -> Void {
    get {
      let args = self.args
      switch self.code {
      case "M":
        return { $0.moveToPoint(CGPoint(x: args[0], y: args[1])) }
      case "L":
        return { $0.addLineToPoint(CGPoint(x: args[0], y: args[1])) }
      case "C":
        return { $0.addCurveToPoint(CGPoint(x: args[4], y: args[5]),
          controlPoint1: CGPoint(x: args[0], y: args[1]),
          controlPoint2: CGPoint(x: args[2], y: args[3])) }
      default:
        return {_ in }
      }
    }
  }
}
```

This class includes a static method, `pathToCommands`, which breaks apart the path using a regular expression and returns a list Command instances.  Each command instance has a computed property which returns a function, which will actually invoke the command when called in a drawing context.

I then made one more function to create a `UIBezierPath` object by executing the list of commands.

```
func getPathFromCommands(commands: [Command]) -> UIBezierPath {
  let path = UIBezierPath()
  for c in commands {
    c.op(bezierPath: path)
  }
  return path
}
```

### Bring it Together

Now we have all the pieces in place we can create our view.  There are several ways to do this, I chose to use a CAShapeLayer, this seems to make it a little easier to animate the path transition later on.

```
let rect = CGRectMake(0, 0, 500, 500)
let layer = CAShapeLayer()
layer.strokeColor = UIColor.redColor().CGColor
layer.fillColor = UIColor.clearColor().CGColor
layer.backgroundColor = UIColor.whiteColor().CGColor

layer.path = getPathFromCommands(Command.pathToCommands(result.toString())).CGPath

let view = UIView(frame: rect)
view.backgroundColor = UIColor.whiteColor()
view.layer.addSublayer(layer)
```

With this code we can now output our path, rendered completely natively even though we coded our logic using d3.js.

One last addition was to animate path transitions.  To do this I used a CASpringAnimation, now I'm a little unclear whether this API is actually public and allowed to be used.  If you lookup the docs for [CABasicAnimation](https://developer.apple.com/library/mac/documentation/GraphicsImaging/Reference/CABasicAnimation_class/) this class is listed, but there is no real doc page for it, so use with caution.  The good news is that this technique works with `CABasicAnimation` as well, you just won't get the spring motion.  


```
let anim = CASpringAnimation(keyPath: "path")
anim.duration = 5.0;
anim.mass = 5.15
anim.stiffness = 162.07
anim.damping = 81.33;
anim.initialVelocity = 0.00009
anim.fromValue = layer.path
```

Now we can run our JS again using a different data set.

```
let result2 = getPathFunc.callWithArguments([[10,2,15,4,8,0,0,10], [500, 500]])
```

An finally update the layer.

```
layer.addAnimation(anim, forKey: "path")
layer.path = getPathFromCommands(Command.pathToCommands(result2.toString())).CGPath
```
## Running the Example

There's a couple notes about getting this example to show up, first is that you'll want the following line in your Playground in order to add the chart view as the playground's live view.

```
XCPlaygroundPage.currentPage.liveView = view
```

The second thing is that you'll want to show the timeline and the assistant editor in Xcode.  To show the assistant editor press `cmd+option+return`.  To turn on the timeline you'll need to press `cmd+option+1` and check the checkbox next to `Show Timeline` under Playground Settings.  The timeline is pretty cool, you can use it to scrub through your animation and view it frame by frame.

## Finish Up

So, we've seen that we can take advantage of d3's awesome flexibility to draw native visualizations.  There are many nice charting options already available for iOS, so whether or not this is the best option may depend on the situation.  At this point it was just an idea I had that I wanted to play with a little.  In a future article I'd like to push this example a little further by either extending my Command struct to support more SVG features, or try a more [full featured library](https://github.com/SVGKit/SVGKit) that offers full SVG support.  I like the idea that the power of d3 can be used across different platforms, and I think its worth exploring.  Anyway, thanks for reading, and checkout the full project over on [Github](https://github.com/streets-ahead/swifty-d3).

# Links

  * [Swifty-d3 on Github](https://github.com/streets-ahead/swifty-d3)
  * [JavascriptCore](https://developer.apple.com/library/tvos/documentation/Carbon/Reference/WebKit_JavaScriptCore_Ref/index.html)
  * [d3.js](https://d3js.org)
