## DONE

You should write the documentation based on the tests

## TODO

_Yeah it seems like our MVC framework is a real pirate code of concealment by complexity_

### Dynamic Rendering

We should create dynamic rendering by making View define and Block use the STATIC onBlock and onElem properties and these properties get called with ctx instance that has View template data passed from outside but these properties don't get called with a real View instance but View gets instantiated only on client when it hydrates

The ctx instance should have methods .getParam(s) / .getBlockParam(s) / .getMod(s) / .getBlockMod(s) and something like options for accessing the rest of template data passed in

Also if you want to render subviews not by a reference to View class but by name then we could have the @view([block]) decorator that would reference a singleton appState and be able to enable this feature but we actually figured out the more beautiful solution is actually by reference

But don't hasten to make Block aware of all this. View should be rendered client-side via calling HTMLRenderer which would create verstka first and then instantiate the View making the constructor client side only and always with an element passed to it

The way onBlock property is going to be invoked is by using dependency injection, in other words you have another class like HTMLRenderer and you pass a view to one of its methods and this HTMLRenderer class knows when to call onBlock onElem and all

### Little step but MVC ideas

There are JS View params, for example when you ask the library to render a view you can do { block, ...params } like { block, value: 1, smth: new Smth() } and these params from above will be passed as JS values into onBlock / onElem via the ctx.blockParams() / ctx.params() interface

And there are also the params that we get via this.getParam() this.getParams() in an instance part. These params are defined by what the onBlock / onElem returns in bemjson as in { block, params: { ...here } }

Therefore the jsparams -> bemjson params is a way to pass data between the View template part and the View JS part. Very handy for example for passing models around by id

Note: maybe we should pass the bemjson params as ctx.js({ key: value }) and if we do ctx.js({ ...params } | true) only then does the View gets instantiated. OR it could be that we only need to call ctx.js(false) IF we don't want the View to have an instance part

The sole job of the Controller is to create the Model somehow (either it gets from the server side code or it calls model.fetch itself) and then render the View by passing a model to it (render html of the View server side and init the View client side or do both at once if client side) and all the rest of the application logic is handled by all the subviews and their communication with the models

Now when the models are created server side they are assigned id's. Then these id's become the bemjson params of the Views and all this stuff is transfered client side where models get instantiated with the same id's and Views get the same id's of their models therefore ensuring the same Views end up with the same Model instances

### Event listeners revision

The on + off / dispatch (better rename to dispatch from trigger) API of Blocks remains the same. In terms of View it seems like we need to have bindTo / dispatch methods for native DOM events and on + off / trigger methods for View event listener MVC events. Just think about it our whole current delegate + on + off / dispatch API can be reduced to just bindTo([element], eventName, listener) / dispatch(...) methods and then we can create the on + off / trigger methods to handle a scenario where there are 2 blocks on the same DOM element and we want to listen to and trigger the events of one block but not the other

Note that judging from BEM liveBindTo(element, handler, context) = delegate(element, handler, context) and bindTo(element, handler, context) = find(element).on(handler, context). Naming may be extended here not to break someone's brain like delegate should be an alias for liveBindTo

As a result we get the API:
Block.on / .off / .dispatch
View.bindTo / .liveBindTo / .delegate / .dispatch / .on / .off / .trigger

### Block name in inheritance

If one View extends another then the name of the block and therefore the figuring out of the subsequent onElem methods to be called is to be derived from the first View class in the inheritance chain that specifies explicitly its block name. For this reason we should make static block = ... declaration a compulsory one

### Accessing onBlock / onElem in inheritance

These methods when defined as static properties onBlock = ... override the setter so you should get the onBlock / onElem of the parent View by traversing prototype tree until this === View:
Object.getPrototypeOf(ExtendingView) === BaseView > Object.getPrototypeOf(BaseView) === View

### Integrational note

The inheritance of one View from another may be also manifested in definiing the bemjson for elements undefined in the base View. Therefore the purpose of client side routing may be confined to having base Views define the logic for which elements to update with what undefined elements and the extending Views defining these undefined elements as well as being used as a final View for the controller

### Little ideas

#### Block useful instance helper methods

Create for Block class useful instance helpers like this.rect() this.px(...) this.append(...) this.prepend(...) this.before(...) this.after(...) this.content(...)

### Accessing the document

Any View instance should have a useful this.doc getter that would return window.document element
