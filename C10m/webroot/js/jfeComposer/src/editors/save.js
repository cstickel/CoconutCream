$.jfeC.addEditor('Save', {
	name: "SaveEditor",
	start: function(el, options) {
        if(typeof options['Save']['confirm'] == 'undefined' || confirm('Soll das Element wirklich gelöscht werden?')) {
		    $.jfeC.editors[options.editor].jfeCStop(el, options);
        }
		return true;
	},
	stop: function(el, options) {
        var data = {};
        data[options['modelName']] = {};
        $.extend(data[options['modelName']], options['Save']['addData']);
        
		return {
			action: options['Save']['action'] || "update",
			type: 'ajax',
			data: data
		};
	},
	validationErrors: function(el,options, data) {
		return true;
	},
	finish: function(el, options, data, success, response) {
		return true;
	},
    jfeCBindStop: function() {
        return true;
    }
});