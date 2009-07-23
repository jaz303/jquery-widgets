Function.prototype.__actionName = null;
Function.prototype.actionName = function() { return this.__actionName; };
Function.prototype.isAction = function() { return this.__actionName !== null; };

Function.prototype.actionize = function(name, options) {
    if (this.isAction()) {
        return this;
    } else {
        return action(name, options || {}, this);
    }
};

function action(name, options, fun) {
    
    if (typeof options == 'function') {
        fun = options;
        options = {};
    }
  
    var action = function() {
        if (arguments.callee.isEnabled()) {
            return fun.apply(this, arguments);
        }
    }
  
    action.__actionName = name;
    action.__actionEnabled = ('enabled' in options) ? options.enabled : true;
    
    action.isEnabled        = function() { return this.__actionEnabled; };
    action.disable          = function() { this.__actionEnabled = false; };
    action.enable           = function() { this.__actionEnabled = true; };
    action.toggleEnabled    = function() { this.__actionEnabled = !this.__actionEnabled; };
  
    return action;
  
};
