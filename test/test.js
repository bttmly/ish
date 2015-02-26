var expect = require("chai").expect;

var nri = require("../");

var originalGlobals = Object.keys(global).reduce(function (dict, key) {
  dict[key] = true;
  return dict;
}, Object.create(null));

describe("nri", function () {

  // clean up global scope
  afterEach(function () {
    Object.keys(global).forEach(function (key) {
      if (!originalGlobals[key])
        delete global[key];
    });
  });

  describe("defaults", function () {
    it("adds all properties of `module.exports` into the global scope", function () {
      nri({files: ["./example.js"]});
      expect(d).to.equal(4);
      expect(e).to.equal(5);
      expect(global.a).to.equal(undefined);
    });
  });

  describe("topLevelVars option", function () {
    it("adds all of the module's top level variables into the global scope", function () {
      nri({topLevelVars: true, files: ["./example.js"]});
      expect(a).to.equal(1);
      expect(b).to.equal(2);
      expect(c).to.equal(3);
      expect(d).to.equal(4);
      expect(e).to.equal(5);
      expect(typeof g).to.equal("function");
      expect(global.innerVar).to.equal(undefined);
    });
  });

  describe("noModuleExports option", function () {
    it("doesn't add module.exports properties", function () {
      nri({noModuleExports: true, files: ["./example.js"]});
      expect(global.d).to.equal(undefined);
      expect(global.e).to.equal(undefined);
    });
  });

  describe("with a name option", function () {
    it("adds the module.exports object under that name", function () {
      nri({name: "stuff", files: ["./example.js"]});
      expect(stuff).to.be.ok;
      expect(stuff.d).to.equal(4);
      expect(stuff.e).to.equal(5);
    });

    it("doesn't add module.exports properties", function () {
      nri({name: "stuff", files: ["./example.js"]});
      expect(global.d).to.equal(undefined);
      expect(global.e).to.equal(undefined);
    });
  });

});