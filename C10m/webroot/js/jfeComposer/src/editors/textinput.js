$.jfeC.addEditor('Textinput', {
	name: "TextInputEditor",
    saveContent: false,
    init: function(el, options) {
        this.defaultText(el, options);
        return true;
    },
	start: function(el, options) {
		var attributes = $.jfeC.plugins['core'].getCss(el);
        this.saveContent = el.html();
		el.attr('contenteditable', true);
        el.on('focus.jfe'+options.elementId+' keyup.jfe'+options.elementId+' paste.jfe'+options.elementId, function(event) {
           el.html(el.text());
        });
        el.focus();
		return true;
	},
    bindStop: function(el, options) {
        el.one('blur', function(event) {
            el.html(el.text());
            el.attr('contenteditable', false);
            el.off('.jfe'+options.elementId);
            $.jfeC.editors[options.editor].jfeCStop(el, options, event);
        });
    },
	stop: function(el, options) {
        var data = {};
        data[options['modelName']] = {};
        data[options['modelName']][options['Textinput']['fieldName']] = el.text();
        $.extend(data[options['modelName']], options['Textinput']['addData']);
		
		return {
			action: options['Textinput']['action'] || "update",
			type: 'ajax',
			data: data
		};
	},
	validationErrors: function(el,options, data) {
		this.finish(el, options, data, false, false);
		return true;
	},
	finish: function(el, options, data, success, response) {
        if(!success) el.html(this.saveContent);
        this.defaultText(el, options);
		return true;
	},
    defaultText: function(el, options) {
        if(options['defaultText'] && $.trim(el.html()).length < 1) el.html(options['defaultText']);
    }
});