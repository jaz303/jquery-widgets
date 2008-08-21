/**
 * Simple class inheritance thingamabob. Wrote for luck.
 * (c) 2008 Jason Frame (jason@onehackoranother.com)
 *
 * Usage:
 *
 * Base.extend("com.onehackoranother.Person", {
 *   init: function(name) { this.name = name; },
 *   greet: function() { alert("Hello, my name is " + this.getName()); },
 *   getName: function() { return this.name; }
 * });
 *
 * com.onehackoranother.Person.extend("com.onehackoranother.Manager", {
 *   getName: function() { return "Mr. " + this.super(arguments.callee, "getName"); }
 * });
 *
 * var p = com.onehackoranother.Manager.new("PHB");
 * p.greet(); // "Hello, my name is Mr. PHB"
 * alert(p.respondTo('greet')); // true
 * alert(p.respondTo('commonSense')); // false
 *
 * Issues:
 * calls to super are not possible from mixed-in methods; not sure if this is
 * really a problem...
 */

function Base() {};

Base.OUTER_SCOPE = this; // == window !?!?
Base.superClass = null;

Base.makeScope = function(scope) {
	var at = Base.OUTER_SCOPE;
	for (var i = 0; i < scope.length; i++) {
		if (!at[scope[i]]) at[scope[i]] = {};
		at = at[scope[i]];
	}
	return at;
};

Base.new = function() {
	var instance = new this();
	instance.class = this;
	instance.init.apply(instance, arguments);
	return instance;
};

Base.prototype = {
	init: function() {},
	super: function(callee, method) {
		var args = [], i = 2;
		while (i < arguments.length) args.push(arguments[i++]);
		return callee.__super__.prototype[method].apply(this, args);
	},
	respondTo: function(method) {
		return typeof this[method] == 'function';
	}
};

Base.extend = function(className, methods) {

	var namespace = className.split('.');
	var className = namespace.pop();
	var scope = Base.makeScope(namespace);
	
	var theClass = function() {};
	theClass.superClass = this;
	theClass.prototype = new this();
	
	methods = methods || {};
	for (var m in methods) {
		var tmp = methods[m];
		if (typeof tmp == 'function') {
			tmp.__super__ = this;
		}
		theClass.prototype[m] = tmp;
	}
	
	theClass.extend = this.extend;
	theClass.new = this.new;
	
	scope[className] = theClass;
	
	return theClass;

};
