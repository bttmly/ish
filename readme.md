# nri
_node repl injector_

Choose some files, run them, and inject their `module.exports` properties into the global scope of a new REPL. Optionally, you can also (or instead) inject the module's top-level variables.

```js
// stuff.js

module.exports = {
  a: 1,
  b: 2
}

// then at the command line...

> nri stuff.js
// ... starts a Node REPL
$ a // 1
$ b // 2
```