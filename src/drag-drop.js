Class.extend('Draggable', {
    
    init: function(ele, options) {
        this.root = ele;
        this.handleOptions(options);
        this.$handle = this._resolveHandle();
        this._bind();
    },
    
    defaults: function() {
        return { enabled: true, filter: null, axis: null };
    },
    
    enable: function() { this.enabled = true; },
    disable: function() { this.enabled = false; },
    isEnabled: function() { return this.enabled; },
    
    //
    // Private
    
    _resolveHandle: function() {
        if (typeof this.handle == 'string') {
            return $(this.root).find(this.handle);
        } else if (this.handle) {
            return $(this.handle);
        } else {
            return $(this.root);
        }
    },
    
    _bind: function() {
        
        var self = this;
        
        this.$handle.bind('selectstart', function() { return false; })
                    .attr('unselectable', 'on')
                    .css('MozUserSelect', 'none')
                    .mousedown(function(eo) {
                        
            if (!self.enabled) return;
            
            $(self.root).addClass('dragging').css('zIndex', ScreenUtils.nextZ());
            
            // hooks?
            self._start(eo.pageX, eo.pageY);
            $(document).bind('mousemove.drag-handler', function(ei) {
                $(self.root).css(self._newPos(ei.pageX, ei.pageY));
            });
        });
        
        $(document).mouseup(function() {
            self.$handle.removeClass('dragging');
            $(document).unbind('mousemove.drag-handler');
        });
        
    },
    
    _start: function(cursorX, cursorY) {
        this.startPos = [this.root.offsetLeft, this.root.offsetTop];
        this.offset   = [cursorX - this.startPos[0], cursorY - this.startPos[1]];
    },
    
    _newPos: function(x, y) {
        
        var pos = [x - this.offset[0], y - this.offset[1]];
        
        if (this.axis == 'x') pos[1] = this.startPos[1];
        else if (this.axis == 'y') pos[0] = this.startPos[0];
        
        if (this.filter) pos = this.filter(pos[0], pos[1]);
        
        return {left: pos[0], top: pos[1]};
        
    }

});
