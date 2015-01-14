/* jshint expr: true */

(function () {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);

  var expect = chai.expect;

  describe("World Clock Widget Settings - e2e Testing", function() {
    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load all components", function () {
      // Font pickers
      expect(element(by.css("#title-font font-picker")).isPresent()).to.eventually.be.true;
      expect(element(by.css("#analog-font font-picker")).isPresent()).to.eventually.be.true;
      expect(element(by.css("#digital-font font-picker")).isPresent()).to.eventually.be.true;

      // Color pickers
      expect(element(by.css("#frame-color + .sp-replacer.sp-light")).isPresent()).to.eventually.be.true;
      expect(element(by.css("#face-color + .sp-replacer.sp-light")).isPresent()).to.eventually.be.true;
      expect(element(by.css("#hand-color + .sp-replacer.sp-light")).isPresent()).to.eventually.be.true;
      expect(element(by.css("#second-hand-color + .sp-replacer.sp-light")).isPresent()).to.eventually.be.true;

      // Background setting
      expect(element(by.css("#background .section")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly load default settings", function () {
      expect(element(by.id("local-time")).isSelected()).to.eventually.be.true;
      expect(element(by.id("time-zone")).getAttribute("value")).to.eventually.equal("Pacific/Samoa");
      expect(element(by.id("show-title")).isSelected()).to.eventually.be.false;
      expect(element(by.id("title")).getAttribute("value")).to.eventually.equal("");
      expect(element(by.id("placement")).getAttribute("value")).to.eventually.equal("left");
      expect(element(by.id("padding")).getAttribute("value")).to.eventually.equal("10");
      expect(element(by.id("horizontal-align")).getAttribute("value")).to.eventually.equal("center");
      expect(element(by.id("vertical-align")).getAttribute("value")).to.eventually.equal("middle");
      expect(element(by.css("input[type='radio'][value='digital']")).isSelected()).to.eventually.be.true;
      expect(element(by.id("frame-width")).getAttribute("value")).to.eventually.equal("10");
      expect(element(by.id("hand-width")).getAttribute("value")).to.eventually.equal("5");
      expect(element(by.id("hour-tick-width")).getAttribute("value")).to.eventually.equal("5");
      expect(element(by.id("minute-tick-width")).getAttribute("value")).to.eventually.equal("2");
      expect(element(by.id("show-second-hand")).isSelected()).to.eventually.be.false;
      expect(element(by.id("second-hand-width")).getAttribute("value")).to.eventually.equal("5");
      expect(element(by.id("format")).getAttribute("value")).to.eventually.equal("standard-seconds");
    });

    it("Should set default visibility", function() {
      // Time
      expect(element(by.id("local-time")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("time-zone")).isDisplayed()).to.eventually.be.false;

      // Title
      expect(element(by.id("show-title")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("title")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("placement")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("padding")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("title-font")).isDisplayed()).to.eventually.be.false;

      // Clock Type
      expect(element(by.css("input[type='radio'][value='analog']")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("input[type='radio'][value='digital']")).isDisplayed()).to.eventually.be.true;

      // Analog settings
      expect(element(by.id("frame-color")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("frame-width")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("face-color")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("hand-color")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("hand-width")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("hour-tick-width")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("minute-tick-width")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("show-second-hand")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("second-hand-color")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("second-hand-width")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("analog-font")).isDisplayed()).to.eventually.be.false;

      // Digital settings
      expect(element(by.id("format")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("digital-font")).isDisplayed()).to.eventually.be.true;

      // Background
      expect(element(by.id("background")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show 'Time Zone' when 'Use Local Time' is not selected", function () {
      element(by.id("local-time")).click();

      expect(element(by.id("time-zone")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show additional settings when 'Show Title' is selected", function () {
      element(by.id("show-title")).click();

      expect(element(by.id("title")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("placement")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("padding")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("title-font")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show the appropriate 'Alignment' setting when 'Placement' is changed", function () {
      element(by.id("show-title")).click();

      // Top
      element(by.css("#placement option[value='top']")).click();

      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.false;

      // Bottom
      element(by.css("#placement option[value='bottom']")).click();

      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.false;

      // Left
      element(by.css("#placement option[value='left']")).click();

      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.true;

      // Right
      element(by.css("#placement option[value='right']")).click();

      expect(element(by.id("horizontal-align")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("vertical-align")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show and hide various settings when 'Analog' is selected", function () {
      element(by.css("input[type='radio'][value='analog']")).click();

      // Analog settings
      expect(element(by.css("#frame-color + .sp-replacer.sp-light")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("frame-width")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("#face-color + .sp-replacer.sp-light")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("#hand-color + .sp-replacer.sp-light")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("hand-width")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("hour-tick-width")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("minute-tick-width")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("show-second-hand")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("analog-font")).isDisplayed()).to.eventually.be.true;

      // Digital settings
      expect(element(by.id("format")).isDisplayed()).to.eventually.be.false;
      expect(element(by.id("digital-font")).isDisplayed()).to.eventually.be.false;
    });

    it("Should show additional settings when 'Show Second Hand' is selected", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("show-second-hand")).click();

      expect(element(by.css("#second-hand-color + .sp-replacer.sp-light")).isDisplayed()).to.eventually.be.true;
      expect(element(by.id("second-hand-width")).isDisplayed()).to.eventually.be.true;
    });

    it("Should be a valid form", function () {
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.false;
    });

    it("Should be an invalid form if 'Title' is empty", function () {
      element(by.id("show-title")).click();

      expect(element(by.css("#title + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Padding' is not numeric", function () {
      element(by.id("show-title")).click();
      element(by.id("title")).sendKeys("My Title");
      element(by.id("padding")).sendKeys("a");

      expect(element(by.css("#padding + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Frame Width' is not numeric", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("frame-width")).sendKeys("a");

      expect(element(by.css("#frame-width + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Hour/Minute Hand Width' is not numeric", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("hand-width")).sendKeys("a");

      expect(element(by.css("#hand-width + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Hour Tick Width' is not numeric", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("hour-tick-width")).sendKeys("a");

      expect(element(by.css("#hour-tick-width + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Minute Tick Width' is not numeric", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("minute-tick-width")).sendKeys("a");

      expect(element(by.css("#minute-tick-width + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should be an invalid form if 'Second Hand Width' is not numeric", function () {
      element(by.css("input[type='radio'][value='analog']")).click();
      element(by.id("show-second-hand")).click();
      element(by.id("second-hand-width")).sendKeys("a");

      expect(element(by.css("#second-hand-width + .text-danger")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly save settings", function (done) {
      var settings = {
        "params": {},
        "additionalParams": {
          "useLocalTime": true,
          "timeZone": "Pacific/Samoa",
          "showTitle": false,
          "title": "",
          "placement": "left",
          "padding": 10,
          "horizontalAlign": "center",
          "verticalAlign": "middle",
          "titleFont": {
            "font": {
              "type": "standard",
              "name": "Verdana",
              "family": "Verdana"
            },
            "size": "20",
            "bold": false,
            "italic": false,
            "underline": false,
            "color": "black",
            "highlightColor": "transparent"
          },
          "clockType": "digital",
          "frameColor": "rgb(0, 0, 0)",
          "frameWidth": 10,
          "faceColor": "rgb(255, 255, 255)",
          "handColor": "rgb(0, 0, 0)",
          "handWidth": 5,
          "hourTickWidth": 5,
          "minuteTickWidth": 2,
          "showSecondHand": false,
          "secondHandColor": "rgb(255, 0, 0)",
          "secondHandWidth": 5,
          "analogFont": {
            "size": "48",
            "font": {
              "type": "standard",
              "name": "Verdana",
              "family": "Verdana"
            },
            "bold": false,
            "italic": false,
            "underline": false,
            "color": "black",
            "highlightColor": "transparent"
          },
          "format": "standard-seconds",
          "digitalFont": {
            "font": {
              "type": "standard",
              "name": "Verdana",
              "family": "Verdana"
            },
            "size": "20",
            "bold": false,
            "italic": false,
            "underline": false,
            "color": "black",
            "highlightColor": "transparent"
          },
          "background": {
            "color": "transparent"
          }
        }
      };

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
        "params": "",
        "additionalParams": JSON.stringify(settings.additionalParams)
      });
    });
  });
})();
