Class.extend('Widget', {
    
    init: function(root, config) {
        this.root = root;
        this.$root = $(root);
        this.config = $.extend({}, this.defaults(), config || {});
        $.data(this.root, 'widget', this);
        this.setup();
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
    setup: function() {}
    
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
 * Initialize all widgets in a given container (default: document).
 * Call this from document.ready or whenever elements potentially containing
 * widgets are inserted into the DOM.
 */
Widget.initializeAll = function(container) {
    if ($(container).hasClass('widget')) {
        Widget.initializeOne(container);
    } else {
        var widgets = $('.widget', container);
        for (var i = 0; i < widgets.length; i++) {
            Widget.initializeOne(widgets[i]);
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
    
    $.rebind(function() {
        Widget.initializeAll(document);
    });
}