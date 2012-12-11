$.jfeC.addEditor('Delete', {
	name: "DeleteEditor",
    defaults: {
        "fadeOutSpeed": 200
    },
	start: function(el, options) {
        if(confirm('Soll das Element wirklich gelöscht werden?')) {
            $.jfeC.editors[options.editor].jfeCStop(el, options);
        }
		return true;
	},
	stop: function(el, options) {
        var data = {};
        data[options['modelName']] = {};
        $.extend(true, data[options['modelName']], options['Delete']['addData']);
        
		return {
			action: 'delete',
			type: 'ajax',
			data: data,
            id: options['Delete']['id']
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

$.jfeC.addCallback('Delete', 'fadeOut', function(el, options, data, response) {
           var settings = $.extend(true, {}, $.jfeC.editors[options.editor].defaults, options['Delete']);

            el.fadeOut(settings['fadeOutSpeed'], function() {
                $(this).remove();
                });
               return true;
            });