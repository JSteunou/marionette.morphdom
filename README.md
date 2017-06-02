# marionette.morphdom

This is a [backbone.marionette](https://github.com/marionettejs/backbone.marionette) mixin to use [morphdom](https://github.com/patrick-steele-idem/morphdom) in your views.

Using morphdom in your view will allow you to have DOM diffing & patching without changing your template engine as morphdom deals with real DOM and can take String, DOM or V-DOM as input.

When using this mixin, each call to render will patch your view, make it always up to date if render is called after each state change.


# Install

```
npm i marionette.morphdom
```


# Example

```js
import Backone from 'backbone';
import Mn from 'backbone.marionette';
import morphdomMixin from 'marionette.morphdom';

const MyView = Mn.View.extend(morphdomMixin).extend({
    template: data => `<section><h1>${data.title}</h1><p>${data.article}</p></section>`,

    modelEvents: {
        change: 'render'
    },

    initialize: function() {
        this.model = new Backbone.Model({
            title: 'How to keep this view update to date?',
            article: 'You should use marionette morphdom!'
        });
    }

});

export default MyView;
```

That's it. Anytime your model change, your view will be patched.


# FAQ

## Why?

Because default Marionette render does `innerHTML` to update the view.

## Is this slower or faster than... ?

If you already update all your view by *hand* using jquery or vanilla DOM update or tools for data binding like backbone.stickit this might be slower because it will render the all view before patching. The real advantage is that you can drop all your code dealing with manual precise update and develop quicker. See it as a compromise between performance and development speed. Also if your view are not too big and well split and your template engine fast, you should not experience a big performance regression while the gain in development is quite big.

If you are already just calling render in your views, this should improve greatly your app performance.

The other real performance advantage against things like vdom, is that the diffing & patching process is DOM against DOM. There is no intermediary tree or vtree in memory, no steps between.

For more information on morphdom performance see this [FAQ](https://github.com/patrick-steele-idem/morphdom#faq)

## Why I should drop View tagName, className, ... ?

Because those properties are used by Backbone to build the view root `el` but if you have some classes or attributes in it depending on your view state, those were not updated on `render`, you had to update it manually. As this mixin only use the content of your template and use the top root node as view `el` you can drop Backbone.View `tagName`, `className`, `attributes` and stop mix html from view and template.

## Why should I use only one root node in my templates?

See above ;)

## If my state updates a lot, very fast, how can I prevent the view to be rendered at the same rate?

This mixin comes with the `throttleRender` property, which is set on `false` by default. By setting it on `true`, the render call will be throttled to 16ms. You can also set it to a numerical value, like `150`, to throttle the render to 150ms.

## Will my regions be erased on each render?

Nope. If it happens, please fill an issue with your case.

## Why morphdom and not X?

Because morphdom does one job, only, but does it very well, without making other assumption on your stack for you. You are free to use any template engine as input. You are free to call the render mechanism anytime at the rate you want. You are free to not using it and keep manual update for big, critical views. Also I agree with the author, the DOM is not slow, and you can bet browser vendors will keep making it faster & faster ;)
