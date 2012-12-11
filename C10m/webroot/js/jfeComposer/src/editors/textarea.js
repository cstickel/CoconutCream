$.jfeC.addEditor('Textarea', {
	name: "TextInputEditor",
    init: function(el, options) {
        this.defaultText(el, options);
        return true;
    },
	start: function(el, options) {
		var attributes = $.jfeC.plugins['core'].getCss(el);
		el.after('<textarea type="text" id="'+options.elementId+'_jfeCEditor" />').hide();
		var editor = $('#'+options.elementId+'_jfeCEditor');
		$.jfeC.plugins['core'].setCss(editor, attributes);
		if(options['defaultText'] != el.html()) editor.val($.jfeC.plugins['core'].br2nl(el.html()));
		editor.focus();
        
		return true;
	},
	stop: function(el, options) {
		el.show();
		this.getEditorElement(el).hide();

        var data = {};
        data[options['modelName']] = {};
        data[options['modelName']][options['Textarea']['fieldName']] = this.getEditorElement(el).val();
        $.extend(data[options['modelName']], options['Textarea']['addData']);
		
		return {
			action: options['Textarea']['action'] || "update",
			type: 'ajax',
			data: data
		};
	},
    validationErrors: function(el,options, data) {
		this.finish(el, options, data, false, false);
		return true;
	},
	finish: function(el, options, data, success, response) {
        var editorElement = this.getEditorElement(el);
		if(success) el.html($.jfeC.plugins['core'].nl2br(editorElement.val()));
		editorElement.remove();
        this.defaultText(el, options);
		return true;
	},
    defaultText: function(el, options) {
        if(options['defaultText'] && $.trim(el.html()).length < 1) el.html(options['defaultText']);
    }
});