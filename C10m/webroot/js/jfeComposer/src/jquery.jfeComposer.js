/*
 * todo:
 * error logging? (info, warning, error)
 */


$.jfeC = {};

(function() {
	var editors = {};
	var plugins = {};
	var adapters = {};
	var validators = {};
    var editorInstances = {};
    var activeEditors = [];

	var settings = {
		adapter : 'default',
		baseURL : '/',
		autoInit : true,
		editable: {
			id: false,
			editor: 'Textinput',
			language: 'en_us',
			validate: false,
            event: 'click',
            postData: {},
            bindToElement: false,
			beforeEdit: 'empty',
			afterEdit: 'empty',
			beforeValidate: 'empty',
			afterValidate: 'empty',
			beforeSave: 'empty',
			afterSave: 'empty',
			onSaveSuccess: 'empty',
			onSaveError: 'empty',
			beforeAction: 'empty',
			afterAction: 'empty',
			whileUpload: 'empty'
			/* todo:
			 * there are 3 seperated phases that could success or fail:
			 * 1. editor start (successes if the editor could be started without errors)
			 * 2. editor stop (successes if the editor could be stopped, data validated
			 * 	  and save call can be started without errors)
			 * 3. after save (successes if the data is saved to the server)
			 * 
			 * each of this phases should get suitable callbacks
			 */
		}
	};

	$.jfeC.addEditor = function(name, editor) {
		var editor = $.extend(true,{},jfeCEditor, editor);
		
		if(!editor.jfeCCreate()) return false;
		editors[name] = editor;
		return true;
	};
	$.jfeC.addPlugin = function(name, plugin) {
		if(!plugin.init()) return false;
		plugins[name] = plugin;
		return true;
	};
	$.jfeC.addAdapter = function(name, adapter) {
		adapters[name] = adapter;
		return true;
	};
	$.jfeC.addValidator = function(name, validator) {
		validators[validator] = validator;
		return true;
	};

	$.jfeC.addCallback = function(editor, name, fn) {
		editors[editor].addCallback(name, fn);
		return true;
	};

    $.jfeC.addEditorInstance = function(id, options) {
        if($.type(editorInstances[id]) == 'undefined') {
            editorInstances[id] = options;
            return true;
        }
        return false;
    };
    $.jfeC.getEditorInstance = function(id) {
        if($.type(editorInstances[id]) == 'undefined') return false;
        return editorInstances[id];
    }
    $.jfeC.updateEditorInstance = function(id, options) {
        editorInstances[id] = options;
        return true;
    }

    $.jfeC.stopEditors = function() {
        $.each(this.activeEditors, function() {
           /*todo: how to remove the stopped editors from the array? */
           $.jfeC.editors[this['options']['editor']].jfeCStop(this['el'], this['options']);
        });
    }
	
	function loadConfiguration() {
		var options = $('body').data('jfec');
		settings = $.extend(true,settings, options);
	}

	function init() {
		loadConfiguration();
		initEditables();

		if (settings.autoInit)
            $.fn.domManip = $.jfeC.plugins['core'].hook($.fn.domManip,
					function(args) {
						initEditables();
					});

        connector.init();
	}

	function initEditables(elements) {
		if(elements) {
			$(elements).filter('.jfeCEditable:not(.jfeCEditableInited)').each(function() {
				jfeCEditable.init($(this));
			});
			return elements;
		} else {
			$('.jfeCEditable:not(.jfeCEditableInited)').each(function() {
				jfeCEditable.init($(this));
			});
		}
	}

	var jfeCEditable = {
        init: function(editable) {
		    if(!$(editable).hasClass('.jfeCEditableInited')) {
                $(editable).addClass('jfeCEditableInited');
                var options = $(editable).data('jfec');

                var toInit = options['editors'];
                delete options['editors'];
                this.setOptions(editable, options);

                $.each(toInit, function(key, val) {
                    if(options['defaults']) val = $.extend(true, {} ,options['defaults'], val);
                    $.extend(val, {"editable": editable });
                    editors[val.editor].jfeCInit(val);
                });
            }
            return false;
	    },
        getOptions: function(el) {
            if($.type(el) == 'string') var el = $('#'+el);
            el = $(el);
            var options = el.data('jfeCData');
            if(!options) options = {};
            return options;
        },
        setOptions: function(el, options) {
            el.data('jfeCData', options);
            return options;
        }
    }


	var jfeCEditor = {
        defaults: {},
		jfeCInit: function(options) {
            options = $.extend(true, {},settings.editable, this.defaults, options, { element: $('#'+options.elementId) });
            el = options.element;

            if(options['id']) $.jfeC.updateEditorInstance(options['id'], options);
			if(!this.init(el, options)) return false;
            editors[options.editor].jfeCBindStart(el, options);
			return el;
		},
        jfeCCreate: function() {
			if(!this.create()) return false;
			return true;
		},
		jfeCBindStart: function(el,options) {
			if(!this.bindStart(el, options)) {
				/*
				 * todo:
				 * add more default events
				 */
                var bindTarget = el;
                if(options.bindToElement) bindTarget = $('#'+options.bindToElement);
				switch(options.event) {
                    case 'hover':
                        bindTarget.hover(function(event) {
                            jfeCEditor.jfeCStart(el, options, event);
                            //We want to start an editor for links and stuff like that, instead of following them
                            event.preventDefault();
                        });
                        break;
                    case 'none':
                        break;
                    default:
                        bindTarget.click(function(event) {
                            jfeCEditor.jfeCStart(el, options, event);
                            event.preventDefault();
                        });
                }

				}
		},
		jfeCBindStop: function(el, options) {
			if(!this.bindStop(el, options)) {
				/*
				 * todo:
				 * add more default events
				 */
				this.getEditorElement(el).blur(function(event) { jfeCEditor.jfeCStop(el, options, event); });
				}
		},
		jfeCStart: function(el, options, event) {
			if(!editors[options.editor].callbacks[options.beforeEdit](el, options, event)) return false;
			if(!editors[options.editor].start(el, options, event)) return false;
			editors[options.editor].jfeCBindStop(el, options);
            $.jfeC.activeEditors.push({'el': el, 'options': options});
			return true;
		},
		jfeCStop: function(el, options, event) {
			var data = editors[options.editor].stop(el,options, event);
			if(!data) return false;
			if(!editors[options.editor].jfeCSave(el,options, data)) return false;
			if(!editors[options.editor].callbacks[options.afterEdit](el, options, data)) return false;
			return true;
		},
		jfeCSave: function(el, options, data) {
			if(!editors[options.editor].callbacks[options.beforeSave](el, options, data)) return false;
			if(!editors[options.editor].jfeCValidate(el, options, data)) {
				editors[options.editor].callbacks[options.validationErrors](el,options, data);
				return false;
				}

			var requestData = adapters[settings.adapter][data.action](data, options, settings);
			if(!connector['send'](el, options, data, requestData)) {
				editors[options.editor].finish(el,options, data, false, false);
				return false;
				}
			return true;
		},
        jfeCFinish: function(el, options, data, response, success) {
            if(success) response = adapters[settings.adapter].parseResponse(response);

			if(success && adapters[settings.adapter].isSuccess(response)) {
				editors[options.editor].callbacks[options.onSaveSuccess](el, options, data, response);
				editors[options.editor].finish(el,options, data, true, response);
				}
			else {
				editors[options.editor].callbacks[options.onSaveError](el, options, data, response);
				editors[options.editor].finish(el,options, data, false, false);
			}

			editors[options.editor].callbacks[options.afterSave](el, options, data, response, success);
        },
		jfeCValidate: function(el, options) {
			if(!editors[options.editor].callbacks[options.beforeValidate](el, options)) return false;
			if(!editors[options.editor].validate(el, options)) return false;
			/* 
			 * todo:
			 * how should we handle the default
			 * validation with validators versus
			 * custom editor validation?
			 * 
			 * todo:
			 * use validators to validate
			 */
			if(!editors[options.editor].callbacks[options.afterValidate](el, options)) return false;
			return true;
		},
		init: function(el, options) {
			return true;
		},
        get: function(el) {
            if($.type(el) == 'string') var el = $('#'+el);
            el = $(el);
            var options = this.getOptions(el);
            return {
                el: el,
                options: options
            }
        },
        getOptions: function(el) {
            var data = el.data('jfeCData');
            if(!data) data = {};
            return data;
        },
        updateOptions: function(el, options) {
            var old = this.getOptions(el);
            options = $.extend(true, {}, old, options);
            el.data('jfeCData', options);
            return options;
        },
        create: function() {
			return true;
		},
		bindStart: function() {
			return false;
		},
		bindStop: function() {
			return false;
		},
		start: function() {
			return true;
		},
		stop: function() {
			return true;
		},
		finish: function() {
			return true;
		},
		validate: function() {
			return true;
		},
		getEditorElement: function(el) {
			return $('#'+$(el).attr('id')+'_jfeCEditor');
		},
		callbacks: {
			'empty': function() { return true; } 
		},
		addCallback: function(name,fn) {
			this.callbacks[name] = fn;
			return true;
		}
	}
	
	var connector = {
        init: function() {
          $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
            if(options.formDataObject) {
                options.contentType = false,
                options.data = options.formDataObject;
            }

              options.xhr = function() {
                  var xhr = jQuery.ajaxSettings.xhr();
                  xhr.onprogress = function(e) {
				    //options.whileUpload(el, options, data, e);
                  };
                  return xhr;
              }
          });
        },
		send: function(el, options, data, requestData) {
            if(!requestData.data) requestData.data = {};
            if(!requestData.formDataObject) requestData.formDataObject = false;

			$.ajax({
				cache: false,
				type: "POST",
				url: requestData.url,
				success: function(response) {
					/*
					 * todo:
					 * i'm not sure if the functions should get the response directly
					 * neither editor nor application should be dependend on the way
					 * a server respond.
					 * just don't know how the adapter function should work, it has
					 * to be very very flexible.
					 *
					 * todo:
					 * maybe the success and error methods should be part of the connector
					 * object and should only be called here. we'll know as soon as the
					 * fileupload and dndFileupload methods are ready.
					 */

                    editors[options.editor].jfeCFinish(el, options, data, response, true);
				},
				error: function(response) {
					editors[options.editor].jfeCFinish(el, options, data, response, false);
				},
				formDataObject: requestData.formDataObject,
                data: requestData.data
			});
			
			return true;
		}
	}

	$.jfeC.init = init;
	$.jfeC.initEditables = initEditables;
    $.jfeC.jfeCEditor = jfeCEditor;
    $.jfeC.jfeCEditable = jfeCEditable;
	$.jfeC.settings = settings;
    $.jfeC.activeEditors = activeEditors;
    $.jfeC.editors = editors;
	$.jfeC.plugins = plugins;
})();