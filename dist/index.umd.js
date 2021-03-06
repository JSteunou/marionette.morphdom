(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash'), require('backbone.marionette'), require('morphdom')) :
	typeof define === 'function' && define.amd ? define(['lodash', 'backbone.marionette', 'morphdom'], factory) :
	(global.marionette = global.marionette || {}, global.marionette.morphdom = factory(global.lodash,global.Mn,global.morphdom));
}(this, (function (lodash,Mn,morphdom) { 'use strict';

Mn = 'default' in Mn ? Mn['default'] : Mn;
morphdom = 'default' in morphdom ? morphdom['default'] : morphdom;

// View default el is just a simple <div></div>
// that act as DOM manipulation container
// it is replaced by template top node after render / attach
// You can drop View className / tagName / attributes... they arent be used anymore
//
// all render operation manipulate string or vdom
// all attach operation are diff & patch processed by morphdom

var morphdomMixin = {

    // can be boolean or Number
    // when set on true, will default to 16ms
    throttleRender: false,

    render: function render() {
        // if not rendered yet throttle render
        if (!this.isRendered()) {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            Mn.View.prototype.render.apply(this, args);
            this._throttleRender();
        } else {
            this._morphdomRender();
        }
        return this;
    },

    attachElContent: function attachElContent(content) {
        var _this = this;

        var newEl = void 0;
        // string html
        if (typeof content === 'string') {
            var wrapperEl = document.createElement('div');
            wrapperEl.innerHTML = content;
            newEl = wrapperEl.firstChild;
            // true dom
        } else {
            newEl = content;
        }

        // 1st render with top node !== 'DIV' (backbone default)
        // or new template that changed the top node (seriously?)
        //
        // you can avoid setElement with ui & events re-bindings
        // by setting View#tagName the same as template top node tagName
        if (newEl.tagName !== this.el.tagName) {
            this.setElement(newEl);
            // morph existing
        } else {
            morphdom(this.el, newEl, {
                // prevent region to be erased
                onBeforeElUpdated: function onBeforeElUpdated(fromEl, toEl) {
                    // equality depends if region.el was replaced or not
                    var isRegion = lodash.some(_this._regions, function (region) {
                        return region.el.isEqualNode(fromEl) || region.el.isEqualNode(toEl);
                    });
                    return !isRegion;
                }
            });
        }
    },

    _throttleRender: function _throttleRender() {
        if (this.throttleRender) {
            var interval = lodash.isNumber(this.throttleRender) ? this.throttleRender : 16;
            this.render = lodash.throttle(this.render.bind(this), interval);
            this.on('before:destroy', this.render.cancel);
        }
    },

    _morphdomRender: function _morphdomRender() {
        this.triggerMethod('before:render', this);
        this._renderTemplate();
        this.triggerMethod('render', this);
        return this;
    }

};

return morphdomMixin;

})));
