Class.extend('Widget', {
    
    init: function(root, config) {
        this.root = root;
        this.$root = $(root);
        this.config = $.extend({}, this.defaults(), config || {});
        $.data(this.root, 'widget', this);
        this.setup();
    },
    
    destroy: function() {
        try {
            this.dispose();
        } catch (dontCareAboutThis) {}
        $.removeData(this.root, 'widget');
        this.root = null;
        this.$root = null;
    },
    
    /**
	 * Override to provide default configuration options.
	 * Any of these may be overwritten by configuration options passed to
	 * the constructor.
	 */
    defaults: function() { return {}; },
    
    /**
     * Implement custom Widget setup/initialisation logic here.
     */
    setup: function() {},
    
    /**
     * Implement custom destruction logic here.
     */
    dispose: function() {}

});

/**
 * Returns the widget wrapping a given element.
 * That is, the first parent (or self) that has the class 'widget'.
 * (or, more accurately, that has a data key 'widget')
 */
Widget.get = function(ele) {
    var w = null;
    while (ele) {
        if (w = $.data(ele, 'widget')) break;
        ele = ele.parentNode;
    }
    return w;
};

Widget.classForName = function(widgetName) {
    return "widget-" + widgetName.replace(/\./g, '-');
}

Widget.nameForClass = function(className) {
    var match = /(^|\s)widget-([\w-]+)($|\s)/.exec(className);
    if (match) {
        return match[2].replace(/[-_]+/g, '.');
    } else {
        return null;
    }
};

/**
 * Given a root DOM node, returns an array of root widget nodes.
 * Array elements will be organised such that it is safe to instantiate widgets
 * in this order.
 */
Widget.findAllRoots = function(root) {
    var q = [root], w = [], n = null;
    while (n = q.pop()) {
        if (n.className.match(/(?:\s|^)widget(?:\s|$)/)) {
            w.unshift(n);
        }
        for (var i = 0; i < n.childNodes.length; i++) {
            var c = n.childNodes[i];
            if (c.nodeType == 1) q.push(n.childNodes[i]);
        }
    }
    return w;
};

/**
 * Initialize all widgets in a given container.
 * Call this from document.ready or whenever elements potentially containing
 * widgets are inserted into the DOM.
 */
Widget.initializeAll = function(container) {
    var roots = Widget.findAllRoots(container);
    for (var i = 0; i < roots.length; i++) {
        Widget.initializeOne(roots[i]);
    }
};

Widget.destroyAll = function() {
    var roots = Widget.findAllRoots(document.body), w = null;
    for (var i = 0; i < roots.length; i++) {
        if (w = Widget.get(roots[i])) {
            w.destroy();
        }
    }
};

/**
 * Initialize a single widget rooted at a given element.
 */
Widget.initializeOne = function(element) {
    var wcn = Widget.nameForClass(element.className);
    if (wcn) {
        var wcn = wcn.split('.'), wc = Class.OUTER_SCOPE;
        for (var i = 0; i < wcn.length; i++) {
            if (!(wc = wc[wcn[i]])) return null;
        }
        var config = {};
        $('.widget-config', element).each(function() {
           $.extend(config, eval('(' + $(this).text() + ')')); 
        });
        return new wc(element, config);
    } else {
        return null;
    }
};

if (typeof jQuery != 'undefined') {
    $.fn.widget = function() {
        return Widget.get(this[0]);
    };
    
    $.rebind(function(context) {
        if (context == document) context = document.body;
        Widget.initializeAll(context);
    });
    
    $(window).unload(Widget.destroyAll);
}