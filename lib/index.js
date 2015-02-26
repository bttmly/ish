var fs = require("fs");
var vm = require("vm");
var path = require("path");
var repl = require("repl");

var callsite = require("callsite");
var makeModule = require("make-module");
var esprima = require("esprima");


var evalInModule = fs.readFileSync(path.join(__dirname, "./eval.js"));

function parseFile (filepath) {
  var ext = path.extname(filepath);

  if (ext === "") {
    filepath += ".js";
    ext = ".js";
  }

  var codeAsString = fs.readFileSync(filepath).toString();

  switch (ext) {
    case ".js":
      return codeAsString;
    case ".coffee":
      var CoffeeScript = require("coffee-script");
      CoffeeScript.register();
      return CoffeeScript.compile(codeAsString, {
        bare: true
      });
    default:
      throw new Error("No extension registered for " + ext);
  }
}

module.exports = function main (settings) {

  var bin = path.resolve(path.join(__dirname, "../bin/nri"));
  var caller = callsite()[1].getFileName();
  var location = caller === bin ? process.cwd() : path.dirname(caller);

  var modules = settings.files
    .map(processFile)
    .map(checkModule);

  if (settings.topLevelVars)
    modules.forEach(injectTopLevelVars);

  if (!settings.noModuleExports)
    modules.forEach(injectModuleExports);

  function processFile (file) {
    var dest = path.join(location, file);
    var code = parseFile(dest);
    var ast = esprima.parse(code);

    if (settings.topLevelVars) code += evalInModule;

    var mdl = makeModule(code, dest);

    if (settings.topLevelVars) {
      mdl.topLevelVars = [];
      ast.body.forEach(function (n) {
        if (n.type === "VariableDeclaration")
          return [].push.apply(mdl.topLevelVars, n.declarations.map(function (n) {
              return n.id.name;
            }));

        if (n.type === "FunctionDeclaration")
          mdl.topLevelVars.push(n.id.name);
      });
    }


    return mdl;
  }

  function injectTopLevelVars (mdl) {
    mdl.topLevelVars.forEach(function (id) {
      global[id] = mdl.exports.___get___(id);
    });
  }

  function injectModuleExports (mdl) {
    delete mdl.exports.___get___;

    if (settings.name)
      return global[settings.name] = mdl.exports;

    Object.keys(mdl.exports).forEach(function (key) {
      global[key] = mdl.exports[key];
    });
  }

  function checkModule (mdl) {
    if (mdl.error) throw mdl.error;
    return mdl;
  }

}
