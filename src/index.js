import {isNumber, some, throttle} from 'lodash';
import Mn  from 'backbone.marionette';
import morphdom from 'morphdom';



// View default el is just a simple <div></div>
// that act as DOM manipulation container
// it is replaced by template top node after render / attach
// You can drop View className / tagName / attributes... they arent be used anymore
//
// all render operation manipulate string or vdom
// all attach operation are diff & patch processed by morphdom

const morphdomMixin = {

    // can be boolean or Number
    // when set on true, will default to 16ms
    throttleRender: false,

    render: function(...args) {
        // if not rendered yet throttle render
        if (!this.isRendered()) {
            Mn.View.prototype.render.apply(this, args);
            this._throttleRender();
        } else {
            this._morphdomRender();
        }
        return this;
    },

    attachElContent: function(content) {
        let newEl;
        // string html
        if (typeof content === 'string') {
            const wrapperEl = document.createElement('div');
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
                onBeforeElUpdated: (fromEl, toEl) => {
                    // equality depends if region.el was replaced or not
                    const isRegion = some(this._regions, region => region.el.isEqualNode(fromEl) || region.el.isEqualNode(toEl));
                    return !isRegion;
                }
            });
        }
    },



    _throttleRender: function() {
        if (this.throttleRender) {
            const interval = isNumber(this.throttleRender) ? this.throttleRender : 16;
            this.render = throttle(this.render.bind(this), interval);
        }
    },

    _morphdomRender: function() {
        this.triggerMethod('before:render', this);
        this._renderTemplate();
        this.triggerMethod('render', this);
        return this;
    }

};



export default morphdomMixin;
