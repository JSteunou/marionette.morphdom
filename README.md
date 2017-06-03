# Marionette Morphdom Plugin

A Mixin for [backbone.marionette][marionette-gh] to replace the standard view
rendering functions with [morphdom][morphdom-gh].

Morphdom is a lightweight module for manipulating your HTML DOM tree to match a
given HTML string, DOM or Virtual DOM input. Morphdom figures out the minimal
number of operations to achieve this.

This mixin lets you use morphdom with Marionette without changing your template
engine. The morphdom mixin patches `render` to update the view instead of using
`innerHTML`.

## Using marionette.morphdom

To use marionette.morphdom in your code, inject `morphdomMixin` into your `View`:

```js
import Mn from 'backbone.marionette';
import morphdomMixin from 'marionette.morphdom';

// Note the morphdomMixin inside the extend chain
export const Mn.View.extend(morphdomMixin).extend({
  // Your regular code here
})
```

### Install

`marionette.morphdom` is available on NPM:

```
npm i marionette.morphdom
```


### Example

To use the morphdom mixin, just import from `marionette.morphdom` and call
`Mn.View.extend` with the morphdom mixin. An example below:

```js
import Bb from 'backbone';
import Mn from 'backbone.marionette';
import morphdomMixin from 'marionette.morphdom';

export const MyView = Mn.View.extend(morphdomMixin).extend({
  template: data => `<section><h1>${data.title}</h1><p>${data.article}</p></section>`,

  modelEvents: {
    change: 'render'
  },

  initialize: function() {
    this.model = new Bb.Model({
      title: 'How do I keep this view update to date?',
      article: 'Use marionette morphdom!'
    });
  }

});
```

That's it. Anytime your model change, morphdom will take over the `render` for
you.


## FAQ

### Why?

Because default Marionette render does `innerHTML` to update the view.

### Is this slower or faster than... ?

For most Marionette users who just use `render` for updating your views, this
will be a huge performance boost.

If, however, you perform a lot of direct DOM manipulation or use data binding
tools like `backbone.stickit`, then this may be slower. Morpdom must render the
entire view before it can patch it. Depending on the size of your views, this
penalty may be larger or smaller - the less DOM your view looks after, the
smaller the performance penalty.

The benefit of using morphdom is that you can limit the amount of manual DOM
manipulation while maintaining acceptable performance in your app. In this
instance, using `marionette.morphdom` should greatly improve your team's
productivity.

A key advantage of morphdom against virtual-dom is that the diff and patch
process works on the actual DOM tree, reducing the number of intermediary steps
and reducing memory usage.

For more information on morphdom performance see this
[FAQ](https://github.com/patrick-steele-idem/morphdom#faq)

### Why Should I Drop View tagName, className, etc?

Because those properties are used by Backbone to build the view root `el` but if
you have some classes or attributes in it depending on your view state, those were
not updated on `render`, you had to update it manually. As this mixin only use the
content of your template and use the top root node as view `el` you can drop
Backbone.View `tagName`, `className`, `attributes` and stop mix html from view and
template.

### Why should I use only one root node in my templates?

See the [above question](#why-should-i-drop-view-tagname-classname-etc)

### How Can I Throttle Re-rendering if I update State a Lot?

This mixin comes with the `throttleRender` property, which is set on `false` by
default. By setting it on `true`, the render call will be throttled to 16ms. You
can also set it to a numerical value, like `150`, to throttle the render to 150ms.

```js
export const MyView = Mn.View.extend(morphdomMixin).extend({
  throttleRender: true // Throttle to every 16ms
});

export const SlowRenderView = Mn.View.extend(morphdomMixin).extend({
  throttleRender: 150 // Throttle to every 150ms
});
```

### How Are Regions Affected?

Regions will be preserved between `render` calls.

### Why morphdom?

Morphdom does one job really well without forcing you to make decisions elsewhere
in your Marionette stack. You can use any template engine and call `render` as
often as you like. You can mix morphdom into only the views that need it and
leave it out of the ones where you need to manage the update state manually.

[marionette-gh]: https://github.com/marionettejs/backbone.marionette
[morphdom-gh]: https://github.com/patrick-steele-idem/morphdom
