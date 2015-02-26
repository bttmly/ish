var fs = require("fs");
var vm = require("vm");
var path = require("path");
var repl = require("repl");

var callsite = require("callsite");
var makeModule = require("make-module");
var esprima = require("esprima");

var evalInModule = "module.exports.___get___ = function (str) { return eval(str); };\n"

module.exports = function main (settings) {

  var bin = path.resolve(path.join(__dirname, "../bin/nri"));
  var caller = callsite()[1].getFileName();

  var location = caller === bin ? process.cwd() : path.dirname(caller);

  console.log(location);

  var modules = settings.files
    .map(processFile)
    .map(checkModule);
  
  if (settings.topLevelVars) 
    modules.forEach(injectTopLevelVars);

  if (!settings.noModuleExports)
    modules.forEach(injectModuleExports);

  function processFile (file) {
    var dest = path.join(location, file);
    var code = fs.readFileSync(dest).toString();
    var ast = esprima.parse(code);
    var modCode = code + evalInModule;
    var mdl = makeModule(modCode, dest);
    

    if (settings.topLevelVars) {
      mdl.topLevelVars = [];
      ast.body.forEach(function (n) {
        if (n.type === "VariableDeclaration") {
          return [].push.apply(mdl.topLevelVars, n.declarations.map(function (n) {
              return n.id.name;
            })
          );
        }
        if (n.type === "FunctionDeclaration") {
          mdl.topLevelVars.push(n.id.name);
        }
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
    Object.keys(mdl.exports).forEach(function (key) {
      global[key] = mdl.exports[key];
    });
  }

  function checkModule (mdl) {
    if (mdl.error) throw mdl.error;
    return mdl;
  }

}
