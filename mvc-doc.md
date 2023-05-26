## DONE

You should write the documentation based on the tests

## TODO

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
