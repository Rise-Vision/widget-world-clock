var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;

casper.test.begin("World Clock Widget - RiseVision.WorldClock.Digital", function (test) {
  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html");

  casper.then(function() {
    test.assertEval(function () {
      return typeof RiseVision.WorldClock.Digital === "function";
    }, "RiseVision.WorldClock.Digital is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Digital(window.gadget.settings.additionalParams).init === "function";
    }, "RiseVision.WorldClock.Digital.init is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Digital(window.gadget.settings.additionalParams).drawDigital === "function";
    }, "RiseVision.WorldClock.Digital.drawDigital is a function");

    test.assertEval(function () {
      return typeof new RiseVision.WorldClock.Digital(window.gadget.settings.additionalParams).pause === "function";
    }, "RiseVision.WorldClock.Digital.pause is a function");
  });

  casper.run(function() {
    test.done();
  });
});
