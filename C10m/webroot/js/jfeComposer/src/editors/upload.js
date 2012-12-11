$.jfeC.addEditor('Upload', {
	name: "uploadEditor",
	bindStart: function(el, options) {
		if(window.addEventListener) {
			/* browser shouldn't try to display the dropped file */
			
			$(document).get(0).addEventListener('drop', function(e) { e.stopPropagation(); e.preventDefault(); }, false);
			
			$(document).get(0).addEventListener('dragover', function(e) {
				e.preventDefault();
			}, false);
			el.get(0).addEventListener('drop', function(e) { e.preventDefault();
                $.jfeC.editors[options.editor].jfeCStop(el, options, e);
                }, false);
		}

        var input = $('<input type="file" id="'+options.elementId+'_uploadInput" style="position:absolute;left:0px;top:-1000px;" />');
        input.bind('change', function(e) {
           $.jfeC.editors[options.editor].jfeCStop(el, options, e);
        });
        $('body').append(input);
		return true;
	},
	bindStop: function() {
		return true;
	},
    start: function(el, options) {
        $('#'+options.elementId+'_uploadInput').trigger('click');
        return true;
    },
	stop: function(el, options, eData) {
        var files = eData.target.files || eData.dataTransfer.files;

        if($.type(options['Upload']['max']) == "number") {
            if(files.length > options['Upload']['max']) {
                var filesArray = [];
                for(i=0;i<options['Upload']['max'];i++) {
                    filesArray.push(files[i]);
                }
                files = filesArray;
            }
        }
		return {
			action: 'blobUpload',
            data: {
                fieldName: options['Upload']['fieldName'],
                files: files
            }
		};
	},
	validationErrors: function(el,options, data) {
		
		return true;
	},
	finish: function(el, options, data, success, response) {
		
		return true;
	}
});