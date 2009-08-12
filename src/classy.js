/**
 * Yet another JS class implementation.
 * (c) 2008-9 Jason Frame (jason@onehackoranother.com)
 *
 * Usage:
 *
 * Class.extend("foo.Person", { init: function(name) { this.name = name; } });
 * foo.Person.extend("foo.Captain");
 *
 * var b = new foo.Captain("Jason");
 *
 * Issues:
 * calls to super are not possible from mixed-in methods; not sure if this is
 * really a problem...
 */

var classy = {
    OUTER_SCOPE:    this,
    NO_OP:          {},
    
    makeScope: function(scope) {
        if (typeof scope == 'string') scope = scope.split('.');
    	var at = classy.OUTER_SCOPE;
    	for (var i = 0; i < scope.length; i++) {
    		if (!at[scope[i]]) at[scope[i]] = {};
    		at = at[scope[i]];
    	}
    	return at;
    },
    
    features: {
        // append hash of instance methods to class
        methods: function(klass, methodsHash) {
            for (var k in methodsHash) {
                klass.append(k, methodsHash[k]);
            }
        },
        
        // set the defaults for a class
        // (this only applies to subclasses of Object)
        // defaults may be either a hash or a function which returns a hash
        defaults: function(klass, defaults) {
            klass.defaults = defaults;
        }
    }
};

function Class() {};

Class.prototype = {
	init: function() {},
	supr: function(callee) {
		var args = [], i = 1;
		while (i < arguments.length) args.push(arguments[i++]);
		return callee.__super__.prototype[callee.__symbol__].apply(this, args);		
	},
	respondTo: function(method) {
		return typeof this[method] == 'function';
	}
};

// Extend a class, creating a new class object
// Returns class constructor.
// If className (format: name.space.ClassName) is present, class constructor
// will also assigned to corresponding symbol in global namespace.
// features is optional hash of features to assign to the class via classy.features
Class.extend = function(className, features) {
	
	if (typeof className != 'string') {
		features = className;
		className = null;
	}
	
	var klass = function(_) {
	    if (_ != classy.NO_OP) {
	        this._class = this.constructor = arguments.callee;
			this.init.apply(this, arguments);
		}
	};
	
	klass._class        = true;
	klass._superClass   = this;
	klass.extend        = this.extend;
	klass.mix           = this.mix;
	klass.append        = this.append;
	klass.prototype     = new this(classy.NO_OP);
	klass.constructor   = klass;
	
    features = features || {};
    for (var k in features) {
        if (k in classy.features) {
            classy.features[k](klass, features[k]);
        }
    }
	
	if (className) {
		var namespace = className.split('.'),
			className = namespace.pop(),
			scope = classy.makeScope(namespace);
		scope[className] = klass;
	}
	
	return klass;
	
};

// Add something to this class' prototype
// Functions assigned this way will be modified to support supr() calls.
Class.append = function(name, thing) {
	if (typeof thing == 'function') {
		thing.__symbol__ = name;
		thing.__super__ = this._superClass;
	}
	this.prototype[name] = thing;
};

// Mix any number of objects into this class' prototype
// Unlike functions added via append(), functions "mixed-in" will be left
// unmodified to enable sharing between classes.
Class.mix = function() {
	for (var i = 0; i < arguments.length; i++) {
		var mixin = arguments[i];
		for (var m in mixin) {
			this.prototype[m] = mixin[m];
		}
	}
};

Class.extend('Base', {
    methods: {
        init: function(options) {
            this.options = this.parseOptions(options);
        },
        parseOptions: function(options) {
            var stack = [options || {}], klass = this._class, options = {};
            while (klass) {
                if ('defaults' in klass) {
                    var d = klass.defaults;
                    if (typeof d == 'function') d = d.apply(this);
                    stack.unshift(d);
                }
                klass = klass._superClass;
            }
            for (var i = 0; i < stack.length; i++) {
                var x = stack[i];
                for (var k in x) options[k] = x[k];
            }
            return options;
        }
    }
});
