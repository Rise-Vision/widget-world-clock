var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;

casper.test.begin("World Clock Widget - RiseVision.WorldClock", function (test) {
  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html");

  casper.then(function() {
    test.assertEval(function () {
      return typeof RiseVision.WorldClock === "object";
    }, "RiseVision.WorldClock is an object");

    test.assertEval(function () {
      return typeof RiseVision.WorldClock.setParams === "function";
    }, "RiseVision.WorldClock.setParams is a function");

    test.assertEval(function () {
      return typeof RiseVision.WorldClock.play === "function";
    }, "RiseVision.WorldClock.play is a function");

    test.assertEval(function () {
      return typeof RiseVision.WorldClock.pause === "function";
    }, "RiseVision.WorldClock.pause is a function");

    test.assertEval(function () {
      return typeof RiseVision.WorldClock.stop === "function";
    }, "RiseVision.WorldClock.stop is a function");
  });

  casper.run(function() {
    test.done();
  });
});
