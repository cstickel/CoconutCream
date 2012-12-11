$.jfeC.addEditor('Hallo', {
	name: "HalloEditor",
    saveContent: false,
    init: function(el, options) {
        this.defaultText(el, options);
        return true;
    },
	start: function(el, options) {
		this.saveContent = el.html();
		el.hallo({
            editable: true,
		    plugins: {
		      'halloformat': {},
		      'halloblock': {},
		      'hallolists': {}
		    },
		    showAlways: true
		  });
		return true;
	},
    bindStop: function(el, options) {
        el.one('hallodeactivated', function(event) {
            el.hallo({editable: false});
            el.off('.jfe'+options.elementId);
            $.jfeC.editors[options.editor].jfeCStop(el, options, event);
        });
    },
	stop: function(el, options) {
        var data = {};
        data[options['modelName']] = {};
        data[options['modelName']][options['Hallo']['fieldName']] = el.html();
        $.extend(data[options['modelName']], options['Hallo']['addData']);
		
		return {
			action: options['Hallo']['action'] || "update",
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