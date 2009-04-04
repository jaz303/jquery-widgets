load("../test-unit.js");
load("../../src/classy.js");

test({
	
	"makeScope should work properly": function() {
		var s = Class.makeScope(['t1', 'foo', 'bar']);
		assertEqual(s, t1.foo.bar);
	},
	
	"makeScope should be idempotent": function() {
		var s = Class.makeScope(['t2', 'foo', 'bar']);
		var t = Class.makeScope(['t2', 'foo', 'bar']);
		assertEqual(s, t);
	},
	
	"test classes are built sanely": function() {
		var c = Class.extend();
		assert(c._class);
		assertEqual(Class, c._super);
		assert(typeof c.extend == 'function');
	},
	
	"test classes can be subclassed": function() {
		var c = Class.extend();
		var d = c.extend();
		assert(d._class);
		assertEqual(c, d._super);
	},
	
	"test class refs assigned to instances": function() {
	
		var c = Class.extend();
		var d = c.extend();
		
		var ic = new c;
		assertEqual(c, ic._class);
		
		var id = new d;
		assertEqual(d, id._class);
		
	},
	
	"test methods are attached to class instances": function() {
		var c = Class.extend({ init: function() {}, bar: function() {} });
		var i = new c();
		assert(typeof i.init == 'function');
		assert(typeof i.bar == 'function');
	},
	
	"test initializer is called": function() {
		var c = Class.extend({ init: function() { this.foo = 10; } });
		assertEqual(10, new c().foo);
	},
	
	"test constructing subclass calls overriding initializer if present": function() {
		
		var c = Class.extend({ init: function() { this.foo = 10; } });
		var d = c.extend({ init: function() { this.foo = 20; } });
		
		assertEqual(20, new d().foo);
		
	},
	
	"test arguments are passed to initializer": function() {
		
		var c = Class.extend({
			init: function(a, b, c) {
				this.a = a;
				this.b = b;
				this.c = c;
			}
		});
		
		var i = new c(1,2,3);
		
		assertEqual(1, i.a);
		assertEqual(2, i.b);
		assertEqual(3, i.c);
		
	},
	
	"test initializer is bypassed for class prototype": function() {
		
		var c = Class.extend({
			init: function() { this.foo = 10; }
		});
		
		var d = c.extend();
		
		assert(typeof d.prototype.foo == 'undefined');
		
	},
	
	"test instanceof works": function() {
		
		var c = Class.extend(), d = c.extend();
		
		var ic = new c();
		var id = new d();
		
		assert(ic instanceof Class);
		assert(ic instanceof c);
		
		assert(id instanceof Class);
		assert(id instanceof c);
		assert(id instanceof d);
		
	},
	
	"test assigning classname creates appropriate global objects": function() {
		
		var c = Class.extend('com.onehackoranother.T1');
		var d = c.extend('com.onehackoranother.T2');
		
		assertEqual(c, com.onehackoranother.T1);
		assertEqual(d, com.onehackoranother.T2);
		
	},
	
	"test respondTo is sane": function() {
		
		var c = Class.extend({foo: function() {} });
		var i = new c;
		
		assert(i.respondTo('foo'));
		assert(!i.respondTo('bar'));
		
	},
	
	"test respondTo is sane when subclass implements method": function() {
		
		var c = Class.extend();
		var d = c.extend({foo: function() {} });
		var i = new d;
		
		assert(i.respondTo('foo'));
		assert(!i.respondTo('bar'));
		
	},
	
	"test respondTo is sane when subclass does not implement method": function() {
		
		var c = Class.extend({foo: function() {} });
		var d = c.extend();
		var e = d.extend();
		var i = new e;
		
		assert(i.respondTo('foo'));
		assert(!i.respondTo('bar'));
		
	},
	
	"test respondTo is sane when method exists directly on object": function() {
		
		var c = Class.extend();
		var d = c.extend();
		var i = new d;
		
		i.foo = function() {};
		
		assert(i.respondTo('foo'));
		assert(!i.respondTo('bar'));
		
	},
	
	"test superclass methods can be called": function() {
		
		var c = Class.extend({
			init: function(name) {
				this.name = name;
			},
			getName: function() {
				return this.name;
			}
		});
		
		var d = c.extend(); // gap in hierarchy
		
		var e = d.extend({
			getName: function() {
				return 'Mr. ' + this.super(arguments.callee);
			}
		});
		
		var i = new e('Jason');
		
		assertEqual('Mr. Jason', i.getName());
		
	},
	
	"test mix mixes in methods": function() {
		
		var c = Class.extend({
			foo: function() { return 1; }
		});
		
		c.mix({foo: function() { return 2; }, foo: function() { return 3; }});
		
		var i = new c;
		
		assertEqual(3, i.foo());
		
	}

});