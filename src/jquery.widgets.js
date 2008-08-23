jQuery.fn.widget = function() { return Widget.get(this[0]); };

Base.extend("Widget", {
	
	init: function(root, config) {
		this.root = root;
		this.config = jQuery.extend({}, this.defaults(), config || {});
		jQuery.data(this.root, 'widget', this);
		this.setup();
	},
	
	/**
	 * Override to provide default configuration options.
	 * Any of these may be overwritten by configuration options passed to
	 * the constructor.
	 */
	defaults: function() { return {}; },
	
	/**
	 * Override this to implement custom setup.
	 * For example: bind event listeners, create HTML.
	 */
	setup: function() {},
	
	getValue: function() { return this.value; },
	
	filterValue: function(value) { return value; },
	
	setValue: function(newValue) {
		this.value = this.filterValue(newValue);
		return this;
	}
	
});

/**
 * Returns the widget wrapping a given element.
 * That is, the first parent (or self) that has the class 'widget'.
 * (or, more accurately, that has a data key 'widget')
 */
Widget.get = function(ele) {
    var w = null;
    while (ele) {
        if (w = jQuery.data(ele, 'widget')) break;
        ele = ele.parentNode;
    }
    return w;
};

/**
 * Call a method on every instance of a given widget.
 * A respondTo() check is performed for each widget.
 *
 * @param widgetClassName fully-qualified class name of widget
 * @param name of method to call
 */
Widget.send = function(widgetClassName, method) {
    $('.' + Widget.classForName(widgetClassName)).each(function() {
        var w = Widget.get(this);
        if (w && w.respondTo(method)) {
            w[method]();
        }
    });
}

/**
 * Initialize all widgets in a given container (default: document).
 * Call this from document.ready or whenever elements potentially containing
 * widgets are inserted into the DOM.
 */
Widget.initializeAll = function(container) {
    container = container || document;
    if (jQuery(container).hasClass('widget')) {
        Widget.initializeOne(container);
    } else {
        var widgets = jQuery('.widget', container);
        for (var i = 0; i < widgets.length; i++) {
            Widget.initializeOne(widgets[i]);
        }
    }
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
 * Initialize a single widget rooted at a given element.
 */
Widget.initializeOne = function(element) {
    var wcn = Widget.nameForClass(element.className);
    if (wcn) {
        var wcn = wcn.split('.'), wc = Base.OUTER_SCOPE;
        for (var i = 0; i < wcn.length; i++) {
            if (!(wc = wc[wcn[i]])) return null;
        }
        var config = {};
        jQuery('.config', element).each(function() {
           jQuery.extend(config, eval('(' + jQuery(this).text() + ')')); 
        });
        return wc.new(element, config);
    } else {
        return null;
    }
};
