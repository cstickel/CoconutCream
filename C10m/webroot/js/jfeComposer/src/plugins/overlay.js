$.jfeC.addPlugin('Overlay', {
    overlay: false,
    init: function() {
        return true;
    },
    show: function(content, el, options) {
        var hide = this.hide;
        if(!this.overlay) {
            this.overlay = $('<div id="jfeComposerOverlay"><div class="content"></div></div><div id="jfeComposerOverlayDimmer"></div>');
            $('body').append(this.overlay);
            var contentFrame = $(this.overlay).find('.content');
            contentFrame.append(content);
            var width = contentFrame.outerWidth();
            $(this.overlay).filter('#jfeComposerOverlay').css({
                'margin-left': width/-2+'px',
                'top': $(document).scrollTop()+50+'px'
            });
            this.overlay.click(function(event) {
                if($(event.target).parents().andSelf().filter('#jfeComposerOverlay .content').length < 1) {
                    hide();
                    if(el && options) {
                        $.jfeC.editors[options.editor].jfeCStop(el, options, event);
                    }
                }
            });
        }
    },
    hide: function() {
        var overlay = $.jfeC.plugins['Overlay'].overlay;
        if(overlay) {
            overlay.remove();
            $.jfeC.plugins['Overlay'].overlay = false;
            return true;
        }
        return false;
    }
});