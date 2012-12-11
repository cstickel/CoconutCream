$.jfeC.addEditor('TinyMCE', {
    name: "TinyMCEEditor",
    init: function(el, options) {
        this.defaultText(el, options);
        return true;
    },
    start: function(el, options) {
        var settings = {
            script_url : $.jfeC.settings['TinyMCE']['path'],
            theme : "advanced",
            plugins : "autoresize, lists,style,save,advlink,inlinepopups,insertdatetime,paste,nonbreaking,xhtmlxtras,template",
            "theme_advanced_buttons1" : "formatselect,bold,italic,underline,strikethrough,|,bullist,outdent,indent,|,removeformat, |,link,unlink",
            theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",
			theme_advanced_buttons4 : "",
			theme_advanced_blockformats : "",
			theme_advanced_styles: "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "none",
			document_base_url : $.jfeC.settings['baseURL'],
            auto_focus : el.attr('id'),
            oninit: function(ed) {
                /* we close it on mouseDown instead of click event, to avoid TinyMCE problems while sorting and stuff like that */
                $('body').bind('mousedown.jfeCTinyMCE_'+el.attr('id'), function(e) {
                        if($(e.target).parents().andSelf().filter('#'+el.attr('id')+'_parent, .mceListBoxMenu').length < 1) $.jfeC.editors[options.editor].jfeCStop(el, options);
                });
            }
        }

        $('body').addClass('c10mStopSort');

        if($.jfeC.settings['TinyMCE']['default']) $.extend(settings, $.jfeC.settings['TinyMCE']['default']);
        if(options['TinyMCE']['settings'] && $.type(options['TinyMCE']['settings']) == 'string' && $.jfeC.settings['TinyMCE'][options['TinyMCE']['settings']]) $.extend(settings, $.jfeC.settings['TinyMCE'][options['TinyMCE']['settings']]);
        else if($.type(options['settings']) == 'object') $.extend(settings, options['settings']);

        if(options['defaultText'] == el.html()) el.html('');

        $(el).tinymce(settings);

        return true;
    },
    bindStop: function(e, options) {
        //Has to be done asynchronously in "oninit" callback within the "start" method
        return true;
    },
    stop: function(el, options) {
        this.cleanUp(el);

        var data = {};
        data[options['modelName']] = {};
        data[options['modelName']][options['TinyMCE']['fieldName']] = el.html();
        $.extend(data[options['modelName']], options['TinyMCE']['addData']);

        return {
            action: options['TinyMCE']['action'] || "update",
            type: 'ajax',
            data: data
        };
    },
    validationErrors: function(el, options, data) {
        this.finish(el, options, data, false, false);
        return true;
    },
    finish: function(el, options, data, success, response) {
        $('body').unbind('mousedown.jfeCTinyMCE_'+el.attr('id'));
        //todo: replace with old content if unsuccessful
        $(el).tinymce().remove();
        this.defaultText(el, options);
        $('body').removeClass('c10mStopSort');
        return true;
    },
    defaultText: function(el, options) {
        if(options['defaultText'] && $.trim(el.html()).length < 1) el.html(options['defaultText']);
    },
    cleanUp: function(el) {
        var content = $('<div>'+el.tinymce().getContent()+'</div>');
        content.find('p').filter(function() {
           return ($(this).html() == '&nbsp;');
        }).remove();
        content.html($.trim(content.html()));
        el.tinymce().setContent(content.html());
    }
});