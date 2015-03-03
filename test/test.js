var Module = require("module");

var expect = require("chai").expect;

var ish = require("../");

var originalGlobals = Object.keys(global).reduce(function (dict, key) {
  dict[key] = true;
  return dict;
}, Object.create(null));

describe("ish", function () {

  // clean up global scope
  afterEach(function () {
    Object.keys(global).forEach(function (key) {
      if (!originalGlobals[key])
        delete global[key];
    });
  });

  describe("bad call", function () {
    it("needs a settings object", function () {
      expect(ish).to.throw(TypeError);
    });

    it("needs a settings object with a `files` property", function () {
      expect(ish.bind(null, {})).to.throw(TypeError);
    });

    it("needs a settings object with a array at `files`", function () {
      expect(ish.bind(null, {files: "asdf"})).to.throw(TypeError);
      expect(ish( {files: [{path: "./example.js"}]} )[0]).to.be.instanceof(Module);
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
        ish(settings());
        expect(example).to.be.ok;
        expect(example.d).to.equal(4);
        expect(example.e).to.equal(5);
      });

      it("uses a passed in name if provided", function () {
        var s = settings();
        s.files.push({path: "./example3.js", name: "namedExample"});
        ish(s);
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
        ish(settings());
        expect(coffeeExample).to.be.ok;
        expect(coffeeExample.d).to.equal(4);
        expect(coffeeExample.e).to.equal(5);
      });

      it("uses a passed in name if provided", function () {
        var s = settings();
        s.files.push({path: "./coffee-example3.coffee", name: "namedExample"});
        ish(s);
        expect(coffeeExample).to.be.ok;
        expect(coffeeExample.d).to.equal(4);
        expect(coffeeExample.e).to.equal(5);
        expect(namedExample).to.be.ok;
        expect(namedExample.worked).to.equal(true);
      });
    });

  });

});
