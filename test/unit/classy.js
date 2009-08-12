load("../test-unit.js");
load("../../src/classy.js");

test({
    
    "makeScope should work properly": function() {
        var s = classy.makeScope(['t1', 'foo', 'bar']);
        assertEqual(s, t1.foo.bar);
    },
    
    "makeScope should be idempotent": function() {
        var s = classy.makeScope(['t2', 'foo', 'bar']);
        var t = classy.makeScope(['t2', 'foo', 'bar']);
        assertEqual(s, t);
    },
    
    "test classes are built sanely": function() {
        var c = Class.extend();
        assert(c._class);
        assertEqual(Class, c._superClass);
        assert(typeof c.extend == 'function');
    },
    
    "test classes can be subclassed": function() {
        var c = Class.extend();
        var d = c.extend();
        assert(d._class);
        assertEqual(c, d._superClass);
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
        var c = Class.extend({ methods: { init: function() {}, bar: function() {} } });
        var i = new c();
        assert(typeof i.init == 'function');
        assert(typeof i.bar == 'function');
    },

    "test initializer is called": function() {
        var c = Class.extend({ methods: { init: function() { this.foo = 10; } } });
        assertEqual(10, new c().foo);
    },

    "test constructing subclass calls overriding initializer if present": function() {

        var c = Class.extend({ methods: { init: function() { this.foo = 10; } } });
        var d = c.extend({ methods: { init: function() { this.foo = 20; } } });

        assertEqual(20, new d().foo);

    },

    "test arguments are passed to initializer": function() {

        var c = Class.extend({
            methods: {
                init: function(a, b, c) {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                }
            }
        });

        var i = new c(1,2,3);

        assertEqual(1, i.a);
        assertEqual(2, i.b);
        assertEqual(3, i.c);

    },

    "test initializer is bypassed for class prototype": function() {

        var c = Class.extend({
            methods: {
                init: function() { this.foo = 10; }
            }
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

        var c = Class.extend({methods: { foo: function() {} } });
        var i = new c;

        assert(i.respondTo('foo'));
        assert(!i.respondTo('bar'));

    },

    "test respondTo is sane when subclass implements method": function() {

        var c = Class.extend();
        var d = c.extend({methods: { foo: function() {} } });
        var i = new d;

        assert(i.respondTo('foo'));
        assert(!i.respondTo('bar'));

    },

    "test respondTo is sane when subclass does not implement method": function() {

        var c = Class.extend({methods: { foo: function() {} } });
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
            methods: {
                init: function(name) { this.name = name; },
                getName: function() { return this.name; }
            }
        });

        var d = c.extend(); // gap in hierarchy

        var e = d.extend({
            methods: {
                getName: function() { return 'Mr. ' + this.supr(arguments.callee); }
            }
        });

        var i = new e('Jason');

        assertEqual('Mr. Jason', i.getName());
     
    },

    "test mix mixes in methods": function() {

        var c = Class.extend({
            methods: {
                foo: function() { return 1; }
            }
        });

        c.mix({foo: function() { return 2; }, foo: function() { return 3; }});

        var i = new c;

        assertEqual(3, i.foo());

    },
    
    "test extending base merges options correctly": function() {
        
        var c = Base.extend({
            defaults: {
                a: 'a in c',
                b: 'b in c',
                c: 'c in c',
                d: 'd in c'
            }
        });
        
        var d = c.extend({
            defaults: function() {
                return {
                    a: 'a in d',
                    b: 'b in d'
                };
            }
        });
        
        var obj = new d({d: 'd from params'});
        
        assertEqual('a in d', obj.options.a);
        assertEqual('b in d', obj.options.b);
        assertEqual('c in c', obj.options.c);
        assertEqual('d from params', obj.options.d);
        
    }

});