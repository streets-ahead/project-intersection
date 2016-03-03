---
{
  "title": "Key Value Observing NSArray and NSDictionary",
  "author": "Sam Mussell",
  "tags": ["mobile","iOS","Objective-C"],
  "published": "Thu Sep 15 2011 10:11:16 GMT-0700 (PDT)"
}
---
This is a quick post to share some iOS SDK / Objective-C Key Value Observing tips I've recently discovered.  First a very brief introduction to KVO.  Key Value Observing provides a simple way to observe changes to properties on an object without doing all sorts of extra work by creating your own observers or using NSNotificationCenter.  At its most basic you simply register an observer and then implement the observe method.  Here is a short example using a UITableViewController class,     the full project is available on     [GitHub](https://github.com/streets-ahead/KVO-Test).

#### Header	
	...
	@interface RootViewController : UITableViewController {       
	    NSString* myString;
	    }    
	
	@property (retain) NSString* myString;
	...
	
#### Implementation
```
...
@synthesize myString;
- (void)viewDidLoad {       
    [super viewDidLoad];

    //Add observer
	[self addObserver:self forKeyPath:@"myString" options:0 context:@"myContext"];
	
	NSLog(@"setting myString...");
	self.myString = @"Hello World";
}    

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {       
    //View change
	NSLog(@"it changed: %@", [change objectForKey:NSKeyValueChangeKindKey]);
}    
...
```

#### Output

```
2011-04-26 12:29:07.132 test    [9055:207]     setting myString...
2011-04-26 12:29:07.134 test    [9055:207]     it changed: 1
```

The above code is pretty simple,     but should illustrate the basic idea of observing a key,     whenever <span class='inline-code'>myString</span> is changed the <span class='inline-code'>observeValueForKeyPath:</span> method will get called.  There are a couple of things that are important to understand about this.  First,     there is only one <span class='inline-code'>observeValueForKeyPath:</span> method,     so if I add more observers they will call the same method and I will have to add some logic to figure out what changed.  Second,     I am passing 0 for options,     this will give me only basic information about what change occurred,     you can specify an option defined in the     [NSKeyValueObservingOptions](http://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Protocols/NSKeyValueObserving_Protocol/Reference/Reference.html#//apple_ref/doc/c_ref/NSKeyValueObservingOptions) enum to get more detailed information.  Also notice the context parameter this can be used to differentiate the different observers you register.  Lastly notice that after "it changed:" it printed 1,     this is the type of change that occurred,     1 is defined as NSKeyValueChangeSetting,     which means the variable was set to a new value.  What I was interested in was observing when items were added to an NSMutableArray,     and it turned out to be slightly trickier than I thought. 

First lets modify the code to use an array ivar:

#### Header

```
@interface RootViewController : UITableViewController {       
    NSMutableArray* arr;
}    
@property (retain) NSMutableArray* arr;
```	

#### Implementation:

```
@synthesize arr;
- (void)viewDidLoad {       
            [super viewDidLoad];

    //Add observer
	[self addObserver:self forKeyPath:@"arr" options:0 context:@"myContext"];

    NSLog(@"setting arr...");
    self.arr = [NSMutableArray array];
	[self.arr addObject:@"test"];
}    

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {     
    //View change
    NSLog(@"it changed: %@", [change objectForKey:NSKeyValueChangeKindKey]);
}   
``` 
	
So as you can see,     the only changes I made was that I changed the string ivar to an array and I then add one object into the array.  If you run this you can see that you get the same output as before.  We can observe the variable getting set,     but we don't get notified when @"test" is added to the array.  In order to fix this there are two options.  The first is to use the mutable proxy object,     if I change the addObject call to look like:
	
```
  [[self mutableArrayValueForKey:@"arr"]         addObject:@"test"];
```

Now my output looks like:

```
2011-04-26 12:37:20.707 test    [9316:207]     setting arr...
2011-04-26 12:37:20.708 test    [9316:207]     it changed: 1
2011-04-26 12:37:20.709 test    [9316:207]     it changed: 2
```

Which is what I want.  If you look up 2 in the NSKeyValueChange enum it is NSKeyValueChangeInsertion.  This works because mutableArrayValueForKey: doesn't return the actual array,     it returns a proxy for the array that is supports KVO.  The other option you have,     which may seem like more work at first,     but is actually preferable is to add array accessor method to the class.  Array accessor methods allow you to have more control over how things get accessed,     added,     and removed from your internal collections.  This provides a cleaner interface to anyone who wants to use your class,     imagine you come along one day and decide you want to use a different array collection implementation,     if you have set up the collection accessor method you can make these type of changes and your users don't have to worry about it.  So,     what are the collection accessor methods?

	- (NSUInteger)countOf<key>;
	- (id)objectIn<key>AtIndex:(NSUInteger)index;
	- (void)insertObject:(id)obj in<key>AtIndex:(NSUInteger)index;
	- (void)removeObjectFrom<key>AtIndex:(NSUInteger)index;
	- (void)replaceObjectIn<key>AtIndex:(NSUInteger)index withObject:(id)obj;

In my testing it appears you have to implement them all for KVO to work with your array.  Here are my implementations for these methods:

```
- (NSUInteger)countOfArr {       
	return [self.arr count];
}    

- (id)objectInArrAtIndex:(NSUInteger)index {       
	return [self.arr objectAtIndex:index];
}    

- (void)insertObject:(id)obj inArrAtIndex:(NSUInteger)index {       
  [self.arr insertObject:obj atIndex:index];
}    

- (void)removeObjectFromArrAtIndex:(NSUInteger)index {       
 	[self.arr removeObjectAtIndex:index];
}    

- (void)replaceObjectInArrAtIndex:(NSUInteger)index withObject:(id)obj {       
	[self.arr replaceObjectAtIndex:index withObject:obj];
}    
```
	
Now I change my insert line to

```
  [self insertObject:@"test" inArrAtIndex:0];
```

And boom ...

```
2011-04-26 12:47:54.809 test    [9413:207]     setting arr...
2011-04-26 12:47:54.810 test    [9413:207]     it changed: 1
2011-04-26 12:47:54.811 test    [9413:207]     it changed: 2
```

If you are so inclined you could also add an additional convenience method to add items:

```
- (void) addObjectToArr:(id)obj {       
	[self insertObject:obj inArrAtIndex:[self.arr count]];
}
```    
	
You can also use KVO to observe changes to an NSDictionary, however I wasn't able to find a way to observe all inserts and updates to the dictionary,     without creating a wrapper or sublcass of NSDictionary.  You can observe specific keys in a dictionary by using the full path to the key. If you have a dictionary stored in the ivar dict that contains `[title="test1"]` then you can observe changes with:

```
[self addObserver:self forKeyPath:@"dict.title" options:0 context:@"myContext"];
```

Lastly, one of the main reasons that this came up for me was that I was playing with the     [JSONKit](https://github.com/johnezang/JSONKit) library to deal with my JSON calls.  The library makes it really fast and easy to convert JSON to Obj-C dictionaries and arrays,     however it should be noted that JSONKit does not return NSDictionary or NSArray objects,     it returns custom subclasses,     which as far as I can tell are not KVO compliant.  

### Links

  *     [Get the source](https://github.com/streets-ahead/KVO-Test)
  *     [Apple KVO docs](http://developer.apple.com/library/ios/#documentation/cocoa/conceptual/KeyValueObserving/KeyValueObserving.html)
  *     [JSONKit](https://github.com/johnezang/JSONKit)
