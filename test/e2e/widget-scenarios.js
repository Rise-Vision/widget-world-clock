var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;

casper.on("remote.message", function(message) {
  this.echo(message);
});

casper.test.begin("World Clock Widget - e2e Testing", function (test) {
  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html",
    function () {
      test.assertTitle("World Clock Widget", "Test page has loaded");
    }
  );

  casper.waitWhileVisible(".analog-clock", function() {
    casper.then(function() {
      casper.test.comment("Title");

      test.assertSelectorHasText("#title", "My Title", "Title is correct");
      test.assertExists(".digital", "Title has 'digital' class");
      test.assertExists(".left", "Title has 'left' class");
      test.assertExists(".valign-middle", "Title has 'valign-middle' class");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("padding-top") === "10px";
      }, "Title has correct padding");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("font-family") === "Verdana";
      }, "Title has correct font-family");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("font-size") === "20px";
      }, "Title has correct font-size");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("font-weight") === "normal";
      }, "Title has correct font-weight");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("font-style") === "normal";
      }, "Title has correct font-style");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("text-decoration") === "none";
      }, "Title has correct text-decoration");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("color") === "rgb(0, 0, 0)";
      }, "Title has correct color");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#title"), null).getPropertyValue("background-color") === "rgba(0, 0, 0, 0)";
      }, "Title has correct background-color");
    });

    casper.then(function() {
      casper.test.comment("Digital Clock");

      test.assertEval(function() {
        return $("#digital").html() === moment(new timezoneJS.Date(new Date(), "Canada/Pacific")).format("h:mm A");
      }, "Time is correct");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("font-family") === "Verdana";
      }, "Time has correct font-family");

      test.assertEval(function () {
        // 61px on CCI but 62px locally. Use 61px.
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("font-size") === "61px";
      }, "Time has correct font-size");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("font-weight") === "normal";
      }, "Time has correct font-weight");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("font-style") === "normal";
      }, "Time has correct font-style");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("text-decoration") === "none";
      }, "Time has correct text-decoration");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("color") === "rgb(0, 0, 0)";
      }, "Time has correct color");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#digital"), null).getPropertyValue("background-color") === "rgba(0, 0, 0, 0)";
      }, "Time has correct background-color");
    });

    casper.then(function() {
      casper.test.comment("Analog Clock");

      // Draw analog clock.
      casper.evaluate(function() {
        var analog = new RiseVision.WorldClock.Analog(window.gadget.settings.additionalParams);

        analog.init();
        $("#digital").hide();
        $("#analog").show();
      });

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("font-family") === "Verdana";
      }, "Time has correct font-family");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("font-size") === "48px";
      }, "Time has correct font-size");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("font-weight") === "normal";
      }, "Time has correct font-weight");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("font-style") === "normal";
      }, "Time has correct font-style");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("text-decoration") === "none";
      }, "Time has correct text-decoration");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("color") === "rgb(0, 0, 0)";
      }, "Time has correct color");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("#analog"), null).getPropertyValue("background-color") === "rgba(0, 0, 0, 0)";
      }, "Time has correct background-color");
    });

    casper.then(function() {
      casper.test.comment("Background Color");

      test.assertEval(function () {
        return document.defaultView.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color") === "rgb(217, 234, 211)";
      }, "Background color is correct");
    });
  });

  casper.run(function() {
    test.done();
  });
});
