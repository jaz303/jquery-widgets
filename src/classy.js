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

function Class() {};

Class.OUTER_SCOPE = this;
Class.NO_OP = {};

Class.makeScope = function(scope) {
	if (typeof scope == 'string') scope = scope.split('.');
	var at = Class.OUTER_SCOPE;
	for (var i = 0; i < scope.length; i++) {
		if (!at[scope[i]]) at[scope[i]] = {};
		at = at[scope[i]];
	}
	return at;
};

// Extend a class, creating a new class object
// Returns class constructor.
// If className (format: name.space.ClassName) is present, class constructor
// will also assigned to corresponding symbol in global namespace.
// methods is optional hash of functions to assign to prototype - these will
// become instance methods. They will be modified, so best not to share them
// with anything else.
Class.extend = function(className, methods) {
	
	if (typeof className != 'string') {
		methods = className;
		className = null;
	}
	
	var theClass = function(options) {
		if (options != Class.NO_OP) {
			this._class = arguments.callee;
			this.init.apply(this, arguments);
		}
	};
	
	theClass._class = true;
	theClass._super = this;
	theClass.extend = this.extend;
	theClass.mix    = this.mix;
	theClass.append = this.append;
	theClass.prototype = new this(Class.NO_OP);
	
	methods = methods || {};
	for (var m in methods) theClass.append(m, methods[m]);
	
	if (className) {
		var namespace = className.split('.'),
			className = namespace.pop(),
			scope = Class.makeScope(namespace);
		scope[className] = theClass;
	}
	
	return theClass;
	
};

// Add something to this class' prototype
// Functions assigned this way will be modified to support super() calls.
Class.append = function(name, thing) {
	if (typeof thing == 'function') {
		thing.__symbol__ = name;
		thing.__super__ = this._super;
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

Class.prototype = {
	init: function() {},
	super: function(callee) {
		var args = [], i = 1;
		while (i < arguments.length) args.push(arguments[i++]);
		return callee.__super__.prototype[callee.__symbol__].apply(this, args);		
	},
	respondTo: function(method) {
		return typeof this[method] == 'function';
	}
};
