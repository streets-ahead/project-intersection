---
{
  "title": "Welcome to the New SA Labs",
  "author": "Sam Mussell",
  "tags": ["react.js","javascript"],
  "subHead": "We're back and better than ever... Find out how we built our brand new React.js based blog.",
  "published": "Mar 20 2016 22:17:06 GMT-0800 (PST)"
}
---

Welcome to our new SA Labs website.  We started Streets Ahead around four or five years ago as an outlet for side projects and pretty much anything that we found exciting or interesting.  During that time we've had several websites, we've moved around from Wordpress to Jekyll to custom built Node.js backend to Ghost and probably a couple more in between.  At the beginning of 2016 we set a goal to write more posts to this blog and in order to serve that goal we proudly present our newest website architecture.  In this article I'll go through some of the ideas behind the way we built this site and how we used React.js to do so.

## Decisions, Decisions

Before we wrote any code we needed to figure out what technologies/tools/languages we were goint to use to build the site.  Obviously this decision would also impact how we would serve and host the site.  Our previous site was powered by [Ghost](https://ghost.org) and hosted on an EC2 instance.  We used nginx as a reverse proxy to serve static files and provide some cacheing.  This setup was fine, but we wanted to move way from having to admin an EC2 server, we didn't want to worry about having to apply updates and patches or worry if it went down.  We decided that the best option would be a static site generator tool along with S3.  That way we have essentially no server admin duties, very minimal costs, and great scalability.  

So, now that we decided to go with a static site generator, which one should we go with?  There's certainly no shortage of options, if you checkout [StaticGen](https://www.staticgen.com) you'll see there are many, many options that span practically every language.  We looked at Jekyll as the classic choice, we had some experience with it, its heavily used, and would have been a great choice overall, but we decided we wanted something new since we've already had experience with Jekyll in the past we might as well branch out.  We kept looking, we considered some Clojure based options, some JavaScript based ones, even a [Go option](http://gohugo.io).  Then we started thinking, we love working with React.js, so having to build out our sites with some specific template language made us feel like we were giving up a lot of power and control.  

We made the decision to try and just use React.js as our sort of template engine.  Once we made this decision we found a cool project called [Gatsby](https://github.com/gatsbyjs/gatsby), it is basically a React.js based static site generator.  We considered using Gatsby, but then we started thinking, a static version of a React site could just be a crawl of a [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.pa5z58uuh) React.js app.  
This seemed like a great idea. First it allows us to play with making universal apps, something we hadn't really done before. Second we were able strive for ultimate simplicity and have full control and understanding of everything.  Third if we want something more dynamic someday we'll already have the sever ready to go.


## Implementation

With the decision made to go with a universal React.js app it was time to start building.  
