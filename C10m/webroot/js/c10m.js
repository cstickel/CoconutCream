$(document).ready(function() {
       /*     var appendCallback = function(el, options, data, response) {
               el.append(response['html']);
               return true;
            }

           $.jfeC.addCallback('Select', 'append', appendCallback);
           $.jfeC.addCallback('Save', 'append', appendCallback);
           $.jfeC.addCallback('Save', 'prepend', function(el, options, data, response) {
               if(options['Save']['prependTarget']) el = $(options['Save']['prependTarget']);
               el.prepend(response['html']);
               return true;
           });

            $.jfeC.addCallback('Save', 'insertAfter', function(el, options, data, response) {
                   if(options['Save']['insertTarget']) el = $(options['Save']['insertTarget']);
                   $(response['html']).insertAfter(el);
                   return true;
               });

            $.jfeC.addCallback('TinyMCE', 'hideImage', function(el, options, data, response) {
                options.editable.find('figure, img').hide();
                return true;
            });
            $.jfeC.addCallback('TinyMCE', 'showImage', function(el, options, data, response) {
                options.editable.find('figure, img').show();
                return true;
            });

            var replaceCallback = function(el, options, data, response) {
                el.replaceWith(response['html']);
                return true;
            };

            $.jfeC.addCallback('Select', 'replace', replaceCallback);
            $.jfeC.addCallback('Save', 'replace', replaceCallback);

            $.jfeC.addCallback('Save', 'hide', function(el, options, data, response) {
                el.addClass('hidden');
                return true;
            });
            $.jfeC.addCallback('Save', 'show', function(el, options, data, response) {
                el.removeClass('hidden');
                return true;
            });

            $.jfeC.addCallback('Save', 'highlight', function(el, options, data, response) {
                el.addClass('highlight');
                return true;
            });

            $.jfeC.addCallback('Save', 'unhighlight', function(el, options, data, response) {
                el.removeClass('highlight');
                return true;
            });

            $.jfeC['plugins']['ContextMenu'].addCondition('highlighted', function(el, options) {
                return el.hasClass('highlight');
            });

            $.jfeC['plugins']['ContextMenu'].addCondition('unhighlighted', function(el, options) {
                return !el.hasClass('highlight');
            });

            $.jfeC['plugins']['ContextMenu'].addCondition('hidden', function(el, options) {
                return el.hasClass('hidden');
            });

            $.jfeC['plugins']['ContextMenu'].addCondition('visible', function(el, options) {
                return !el.hasClass('hidden');
            });

            $.jfeC['plugins']['ContextMenu'].addCustom('c10mModuleTextTranslate', function(el, options) {
                var id = $(el).attr('id');
                id = id.substr(id.lastIndexOf('_')+1);

                $.ajax({
                        cache: false,
                        type: "get",
                        url: BaseURL+'c10m/C10mContentElements/translate/'+id+'/de'
                   });
            });

            $.jfeC.addCallback('Upload', 'replaceImage', function(el, options, data, response) {
                el.attr('src', $(response['html']).find('#'+el.attr('id')).attr('src'));
                return true;
            });


            var sortOptions = {
               items: '.c10mContentElement',
               delay: 200,
               cancel: ".c10mStopSort",
               stop: function() {
                   //$.jfeC.stopEditors();
               },
               connectWith: '#mainColLeft, #mainColRight',
               receive: function(event, ui) {
                   var id = $(ui.item).attr('id');
                   id = id.substr(id.lastIndexOf('_')+1);

                   var section = 'left';
                   if(ui.item.parent().attr('id') == 'mainColRight') section = 'right';
                   $.ajax({
                        cache: false,
                        type: "post",
                        url: BaseURL+'c10m/C10mContentElements/edit/',
                        data: {
                            "data": {
                                "C10mContentElement": {
                                    "id": id,
                                    "section": section
                                }
                            }
                        }
                   });
               },
               update: function(e, ui) {
                   if($(ui.item).next().length > 0) {
                       var next = $(ui.item).next().attr('id');
                       next = next.substr(next.lastIndexOf('_')+1);
                   }
                   else next = '0';
                   var id = $(ui.item).attr('id');
                   id = id.substr(id.lastIndexOf('_')+1);

                   $.ajax({
                        cache: false,
                        type: "GET",
                        url: BaseURL+'c10m/C10mContentElements/sort/'+id+'/'+next
                   });

               }
            }

            $('#mainColLeft, #mainColRight').sortable(sortOptions);
            sortOptions['connectWith'] = false;
            $('#mainColCenter').sortable(sortOptions);


            $('#c10mNewsletterItems').sortable({
                delay: 200,
                update: function(e, ui) {
                    if($(ui.item).prev().length > 0) {
                        var next = $(ui.item).prev().attr('id');
                        next = next.substr(next.lastIndexOf('_')+1);
                    }
                    else next = '0';
                    var id = $(ui.item).attr('id');
                    id = id.substr(id.lastIndexOf('_')+1);

                    $.ajax({
                        cache: false,
                        type: "GET",
                        url: BaseURL+'c10m/C10mNewsletterItems/sort/'+id+'/'+next
                    });
                }
            });

            $('#c10mEditorBar .publish').click(function() {
                if(confirm('Sollen die aktuellen Inhalte wirklich veröffentlicht werden?')) {
                    $.ajax({
                            cache: false,
                            type: "GET",
                            url: BaseURL+'c10m/C10mPreviews/publish/'
                       });
                };
            });

            $('#c10mEditorBar .metadata').click(function() {
               var o = overlay.open();
               o.append('<h1>Metainformationen</h1>');
               var form = $('<form class="c10mMetaForm"><label>Keywords</label><input value="'+$('meta[name=keywords]').attr('content')+'" type="text" name="keywords" id="c10mMetaFormKeywords" /><label>Description</label><input value="'+$('meta[name=description]').attr('content')+'" name="description" id="c10mMetaFormDescription" type="text" /><button type="submit">Speichern</button></form>');
                o.append(form);
                form.submit(function() {
                   $.ajax({
                        cache: false,
                        type: "POST",
                        url: BaseURL+'c10m/C10mDocuments/edit/',
                        data: {
                            requestType:'ajax',
                            data: {
                                C10mDocument: {
                                    keywords: form.find('input[name=keywords]').val(),
                                    description: form.find('input[name=description]').val(),
                                    id: currentDocumentId
                                }
                            }
                        },
                       complete: function() {
                           window.location.reload(true);
                       }
                    });
                   return false;
                });
               return false;
            });*/


            $.jfeC.addCallback('Save', 'appendToC10mEditorSitemap', function(el, options, data, response) {
                $('div#C10mEditorSitemap > ul').append(response['html']);
            });


            $('div#C10mEditorSitemap > ul').nestedSortable({
                delay: 200,
                items: 'li',
                listType: 'ul',
                'update': function(event, element) {
                    var documentId = element.item.attr('id').substr(element.item.attr('id').lastIndexOf('_')+1);
                    var parentId = false;
                    if(element.item.parents('ul').length > 1) {
                        var parent = element.item.parents('li').slice(0,1);
                        parentId = parent.attr('id').substr(parent.attr('id').lastIndexOf('_')+1);
                    }
                    var documents = [];
                    element.item.siblings().andSelf().each(function() {
                        documents.push($(this).attr('id').substr($(this).attr('id').lastIndexOf('_')+1));
                    });
                    $.ajax({
                        cache: false,
                        type: "post",
                        url: BaseURL+'c10m/C10mDocuments/sort/',
                        data: {
                            "documents": documents,
                            "id": documentId,
                            "parent_id": parentId
                        }
                    });
                }
            });

            $.jfeC.init();
        });