var Module = require("module");

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

  describe("bad call", function () {
    it("needs a settings object", function () {
      expect(nri).to.throw(TypeError);
    });

    it("needs a settings object with a `files` property", function () {
      expect(nri.bind(null, {})).to.throw(TypeError);
    });

    it("needs a settings object with a array at `files`", function () {
      expect(nri.bind(null, {files: "asdf"})).to.throw(TypeError);
      expect(nri( {files: [{path: "./example.js"}]} )[0]).to.be.instanceof(Module);
    });
  });

  describe("injecting .js scripts", function () {

    function settings () {
      var obj = {files: [{path: "./example.js"}]};
      [].slice.call(arguments).forEach(function (str) {
        obj[str] = true;
      });
      return obj;
    }

    describe("defaults", function () {
      it("injects `module.exports` into the global scope under its parsed name", function () {
        nri(settings());
        expect(example).to.be.ok;
        expect(example.d).to.equal(4);
        expect(example.e).to.equal(5);
      });

      it("uses a passed in name if provided", function () {
        var s = settings();
        s.files.push({path: "./example3.js", name: "namedExample"});
        nri(s);
        expect(example).to.be.ok;
        expect(example.d).to.equal(4);
        expect(example.e).to.equal(5);
        expect(namedExample).to.be.ok;
        expect(namedExample.worked).to.equal(true);
      });
    });

  });

  describe("injecting .coffee scripts", function () {

    function settings () {
      var obj = {files: [{path: "./coffee-example.coffee"}]};
      [].slice.call(arguments).forEach(function (str) {
        obj[str] = true;
      });
      return obj;
    }

    describe("defaults", function () {
      it("injects `module.exports` into the global scope under its parsed name", function () {
        nri(settings());
        expect(coffeeExample).to.be.ok;
        expect(coffeeExample.d).to.equal(4);
        expect(coffeeExample.e).to.equal(5);
      });

      it("uses a passed in name if provided", function () {
        var s = settings();
        s.files.push({path: "./coffee-example3.coffee", name: "namedExample"});
        nri(s);
        expect(coffeeExample).to.be.ok;
        expect(coffeeExample.d).to.equal(4);
        expect(coffeeExample.e).to.equal(5);
        expect(namedExample).to.be.ok;
        expect(namedExample.worked).to.equal(true);
      });
    });

  });

});
