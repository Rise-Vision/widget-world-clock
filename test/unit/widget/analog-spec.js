var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;

casper.test.begin("World Clock Widget - RiseVision.WorldClock.Analog", function (test) {
  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html");

  casper.then(function() {
    test.assertEval(function () {
      return typeof RiseVision.WorldClock.Analog === "function";
    }, "RiseVision.WorldClock.Analog is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Analog(window.gadget.settings.additionalParams).init === "function";
    }, "RiseVision.WorldClock.Analog.init is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Analog(window.gadget.settings.additionalParams).drawAnalog === "function";
    }, "RiseVision.WorldClock.Analog.drawAnalog is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Analog(window.gadget.settings.additionalParams).pause === "function";
    }, "RiseVision.WorldClock.Analog.pause is a function");
  });

  casper.run(function() {
    test.done();
  });
});
