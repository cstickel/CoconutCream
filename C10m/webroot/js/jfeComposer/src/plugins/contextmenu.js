$.jfeC.addPlugin('ContextMenu', {
    fixPosition: false,
    container: false,
    currentEditable: false,
    conditions: {},
    custom: {},
	init: function() {
        var ContextMenu = this;
		$.jfeC.jfeCEditable.init = $.jfeC.plugins['core'].hook($.jfeC.jfeCEditable.init,
				function(editable) {
                   var options = $.jfeC.jfeCEditable.getOptions(editable);
                   if(options['ContextMenu']) {
                       editable.bind('click', function(e) {
                           if(ContextMenu.currentEditable && !ContextMenu.currentEditable.is(editable)) ContextMenu.remove();
                           if(!ContextMenu.container) {
                                ContextMenu.create(editable, options['ContextMenu']);
                           }
                           else ContextMenu.container.addClass('dontRemove');
                       });
                   }
                });

        $(document).bind('click', this.remove);
	 return true;
	},
    create: function(editable, options) {
        this.currentEditable = editable;
        this.container = $('<span id="jfeComposerContextMenu" class="dontHide"></span>');
        this.container.css({
             position: 'absolute',
             "z-index": 299999
        });
        this.container.addClass('dontRemove');
        var container = this.container;
        var conditions = this.conditions;
        var custom = this.custom;
        $.each(options['actions'], function(key, value) {
            var add = true;
            if($.type(value['condition']) == 'string' && $.type(conditions[value['condition']]) == 'function')  add = conditions[value['condition']](editable, options, container);

            if(add) {
                var item = $('<span class="jfeComposerContextMenu'+value['class']+'"></span>');
                if(typeof value['description'] != 'undefined') item.attr('title', value['description']);
                item.click(function(event) {
                    if(value['custom']) {
                        custom[value['custom']](editable, options);
                    } else {
                        var options = $.jfeC.getEditorInstance(value['target']);
                        $.jfeC.jfeCEditor.jfeCStart(options.element, options, event);
                    }
                });
                container.append(item);
            }
        });
        $('body').append(this.container);
        this.refreshPosition();
        this.fixPosition = window.setInterval(this.refreshPosition, 1000);
    },
    remove: function() {
        var container = $.jfeC.plugins['ContextMenu'].container;
        if(container) {
            if(!container.hasClass('dontRemove')) {
                container.remove();
                window.clearInterval($.jfeC.plugins['ContextMenu'].fixPosition);
                $.jfeC.plugins['ContextMenu'].currentEditable = false;
                $.jfeC.plugins['ContextMenu'].container = false;
            } else $.jfeC.plugins['ContextMenu'].container.removeClass('dontRemove');
        }

    },
    refreshPosition: function() {
        var offset = $.jfeC.plugins['ContextMenu'].currentEditable.offset();
        $.jfeC.plugins['ContextMenu'].container.css({
            left: offset.left,
            top: offset.top
            });
    },
    addCondition: function(name, fn) {
        this.conditions[name] = fn;
    },
    addCustom: function(name, fn) {
        this.custom[name] = fn;
    }
});