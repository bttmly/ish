# nri [![Build Status](https://travis-ci.org/nickb1080/nri.svg)](https://travis-ci.org/nickb1080/nri)
_node repl injector_

Choose some files, run them, and inject their `module.exports` properties into the global scope of a new REPL. Optionally, you can also (or instead) inject the module's top-level variables.

There are probably some lingering edge cases around properly resolving file paths depending on whether the caller is `bin/nri` or another script.

Given the following example file, here's what the various options will yield:

```js
// stuff.js

var privateToModule = "hello";

module.exports = {
  exportedA: "propA",
  exportedB: "propB"
};

```

Now you're at the command line...

Injecting each property of `module.exports` under it's property name:

```
> nri stuff.js

// ... starts a Node REPL

$ exportedA // "propA"
$ exportedB // "propB"
```


Injecting `module.exports` as a named variable:

```
> nri stuff.js -n stuff

// ... starts a Node REPL

$ stuff // { exportedA: 'propA', exportedB: 'propB' }
$ typeof exportedA // 'undefined'
```

Injecting `module.exports` properties AND top level variables

```
> nri stuff.js -t

// ... starts a Node REPL

$ exportedA // 'propA'
$ exportedB // 'propB'
$ privateToModule // 'hello'
```

Injecting just top level variables

```
> nri stuff.js -mt

// ... starts a Node REPL

$ typeof exportedA // 'undefined'
$ privateToModule // 'hello'
```

You can combine `-n` and `-m` to inject `module.exports` under a name and top level variables under their own identifiers. Checkout `bin/nri` for the command line arguments.
