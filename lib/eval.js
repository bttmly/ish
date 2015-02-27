;(function () {
  // this approach borrowed from jhnns/rewire
  if (module.exports.___get___) 
    throw new Error("`___get___` already defined on `module.exports`");

  module.exports.___get___ = function () { 
    if (arguments[0] && typeof arguments[0] === "string")
      return eval(arguments[0]);
    throw new TypeError("Pass a string identifier to `___get___`");
  };
})();