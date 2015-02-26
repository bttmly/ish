;(function () {
  if (module.exports.__get) 
    throw new Error("`___get___` already defined on `module.exports`");

  module.exports.___get___ = function (str) { 
    return eval(str);
  };
})();