$.jfeC.addEditor('Select', {
	name: "SelectEditor",
    defaults: {

    },
	start: function(el, options) {
        var content = $('<ul id="jfeComposerSelectEditor"></ul>');
        $.each(options['Select']['options'], function(key, option) {
            content.append(
                $('<li><h2>'+option['title']+'</h2><p>'+option['description']+'</p></li>')
                    .data('jfeComposerSelectEditorValue', option['data'])

            );
        });

        $.jfeC.plugins['Overlay'].show(content, el, options);
        content.find('li').click(function(event) {
            $(this).addClass('selected');
            $.jfeC.editors[options.editor].jfeCStop(el, options);
        });

		return true;
	},
	stop: function(el, options) {
        var selected = $('#jfeComposerSelectEditor').find('li.selected');
        if(selected.length < 1) return false;

        var data = {};
        data[options['modelName']] = {};
        $.extend(data[options['modelName']], options['Select']['addData'], selected.data('jfeComposerSelectEditorValue'));

		return {
			action: options['Select']['action'] || "update",
			type: 'ajax',
			data: data
		};
	},
	validationErrors: function(el,options, data) {
		return true;
	},
	finish: function(el, options, data, success, response) {
        $.jfeC.plugins['Overlay'].hide();
		return true;
	},
    jfeCBindStop: function() {
        return true;
    }
});