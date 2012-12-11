/*
 * Todo:
 * should a Plugin be used for this functions?
 */
$.jfeC.addPlugin('core', {
	init: function() {
	 return true;
	},
	nl2br: function(string) {
		if (typeof (string) == "string") {
			string = string.replace(/\n/g, '<br />');
			string = string.replace(/  /g, '&nbsp; ');
		}
		return string;
	},

	br2nl: function(string) {
		if (typeof (string) == "string") {
			string = string.replace(/\n/g, '');
			string = string.replace(/<br>/g, '\n');
			string = string.replace(/<br \/>/g, '\n');
			string = string.replace(/&nbsp;/g, ' ');
		}
		return string;
	},
	/*
	 * todo:
	 * should the attributes be here? maybe they should be in the settings?
	 * check which attributes are missing.
	 */
	cssAttributes: ['fontSize','fontWeight', 'fontFamily', 'fontStyle', 'fontVariant', 'fontDecoration',
                     'color', 'backgroundColor',
                     'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
                     'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                     'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
                     'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
                     'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
                     'display', 'width', 'height', 'text-align', 'background-image', 'background-position',
                     'background-repeat', 'float', 'box-shadow', 'position', 'left', 'top', 'right', 'bottom'],
    getCss: function(el) {
		var attributes = {};
		for(key in this.cssAttributes) {
			attributes[this.cssAttributes[key]] = el.css(this.cssAttributes[key]);
			}
		return attributes;
	},
	setCss: function(el, attributes) {
		for(key in this.cssAttributes) {
			el.css(this.cssAttributes[key], attributes[this.cssAttributes[key]]);
			}
		return true;
	},
    hook: function (original, wrapper) {
				return function() {
					var result = original.apply(this, arguments);
					wrapper.apply(this, arguments);
					return result;
				}
			}
});