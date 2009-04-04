load("../test-unit.js");
load("../../src/classy.js");
load("../../src/widgets.js");

test({
 
    "test class for name": function() {
        assertEqual("widget-Foo", Widget.classForName("Foo"));
        assertEqual("widget-FooBar", Widget.classForName("FooBar"));
        assertEqual("widget-a-b-Bar", Widget.classForName("a.b.Bar"));
    },
    
    "test name for class": function() {
        assertEqual('Foo', Widget.nameForClass('widget-Foo'));
        assertEqual('FooBar', Widget.nameForClass('widget-FooBar'));
        assertEqual('a.b.Bar', Widget.nameForClass('widget-a-b-Bar'));
        assertEqual('a.b.Bar', Widget.nameForClass('something widget-a-b-Bar else'));
    }
 
});