# ish [![Build Status](https://travis-ci.org/nickb1080/ish.svg?branch=master)](https://travis-ci.org/nickb1080/ish)

Install it globally

```
npm i -g ish
```

Choose some files, run them, and inject their `module.exports` properties into the global scope of a new REPL.

There are probably some lingering edge cases around properly resolving file paths depending on whether the caller is `bin/ish` or another script.


Given a file with CommonJS exports...
```
// my-module.js
module.exports = "some value";
```

Then, from the command line...
```
> ish myModule=./my-module.js

$ console.log(myModule)
"some value"
```

It's basically the same as opening a Node REPL and requiring the module, except it can do a couple extra things:
- Automatically compile CoffeeScript
- Compile ES6 JavaScript with the `--babel` flag
- Inject exported properties into scope under their property names
- Access top level private variables of a module

Docs on using these settings coming soon.
