load("../test-unit.js");
load("../../src/actions.js");

test({
    
   "action should be function": function() {
       assertEqual('function', typeof action('foo', function() {}));
   },
   
   "action should be invoked as function": function() {
       assertEqual(10, action('bar', function(a, b) { return a + b; })(6, 4));
   },
   
   "vanilla function should not be action": function() {
       assert(!(function() {}).isAction());
   },
   
   "action should know it is action": function() {
       assert(action('bleem', function() {}).isAction());
   },
   
   "action should be enabled by default": function() {
       assert(action('foo', function() {}).isEnabled());
   },
   
   "action should respect enabled setting": function() {
       var a = action('a', {enabled: false}, function() {});
       assert(!a.isEnabled());
       var b = action('b', {enabled: true}, function() {});
       assert(b.isEnabled());
   },
   
   "action's enabled setting should be toggleable": function() {
       var f = action('f', function() {});
       f.toggleEnabled();
       assert(!f.isEnabled());
       f.toggleEnabled();
       assert(f.isEnabled());
   },
   
   "action should do nothing when disabled": function() {
       
       var foo = 0;
       var inc = action('inc', function() { foo++; });
       
       inc();
       assertEqual(1, foo);
       
       inc.disable();
       inc();
       assertEqual(1, foo);
       
       inc.toggleEnabled();
       inc();
       assertEqual(2, foo);
       
   },
   
   "actionize should change functions into actions": function() {
       
       var fun = function() {};
       var act = fun.actionize('foof');
       
       assert(act.isAction());
       assertEqual('foof', act.actionName());
       
   },
   
   "actionize should leave existing actions untouched": function() {
       var act = action('boof', function() {});
       assertEqual(act, act.actionize());
   }
    
});