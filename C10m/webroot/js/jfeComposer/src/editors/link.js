$.jfeC.addEditor('Link', {
	name: "LinkEditor",
    input: false,
    defaults: {
        "Link": {
            "action": "update"
        }
    },
	start: function(el, options) {
        var content = $('<div id="jfeComposerLinkEditor"><h1>Link Eintragen</h1></div>');
        var input = $('<input type="text" id="'+options.elementId+'_jfeCEditor" />');
        var select = $('<select id="'+options.elementId+'_linkselect_jfeCEditor" />');

        select.append('<option></option>');
        $.ajax({
        				cache: false,
        				type: "GET",
        				url: options.selectOptions,
        				success: function(response) {
                            var data = $.parseJSON(response);
                            $.each(data, function() {
                               select.append('<option value="'+this['url']+'">'+this['name']+'</option>');
                            });
                        }
        });
        select.change(function() {
                   input.val($(this).val());
                });

        input.val(el.attr('href'));
        var newTab = $('<label>New window</label><input type="checkbox" id="'+options.elementId+'_newWindow" '+(el.data('newtab') ? 'checked="checked"' : '')+' />');
        var button = $('<span class="button">Speichern</span>');
        button.click(function(event) {
            $.jfeC.editors[options.editor].jfeCStop(el, options, event);
        });
        $(content).append(input).append(select).append(newTab).append(button);
        button.wrap('<div class="clearfix buttonWrap" />');

        $.jfeC.plugins['Overlay'].show(content, el, options);
        input.focus();
        this.input = input;

		return true;
	},
	stop: function(el, options) {
        var value = $('#'+options.elementId+'_jfeCEditor').val();
        if($.type(value) != 'string') return false;

        var data = {};
        /*data[options['modelName']] = {};
        data[options['modelName']][options['Link']['fieldName']] = value;*/

        data[options['modelName']] = [];
        var i18nData = {};
        i18nData['key'] = 'more_target';
        i18nData['value'] = value;
        data[options['modelName']].push(i18nData);
        i18nData = {};
        i18nData['key'] = 'newTab';
        i18nData['value'] = $('#'+options.elementId+'_newWindow').attr('checked') ? 1 : 0;
        data[options['modelName']].push(i18nData);

        $.extend(data[options['modelName']], options['Link']['addData']);

		return {
            action: options['Link']['action'],
			type: 'ajax',
			data: data
		};
	},
	validationErrors: function(el,options, data) {
		return true;
	},
	finish: function(el, options, data, success, response) {
        if(success) {
            el.attr('href', $('#'+options.elementId+'_jfeCEditor').val());
            el.data('newtab', $('#'+options.elementId+'_newWindow').attr('checked') ? true : false);
        }
        $.jfeC.plugins['Overlay'].hide();
		return true;
	},
    jfeCBindStop: function() {
        return true;
    }
});