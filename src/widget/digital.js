/* global timezoneJS, moment */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = RiseVision.WorldClock || {};
RiseVision.WorldClock.Digital = {};

RiseVision.WorldClock.Digital = function(params) {
  "use strict";

  var timeoutID,
    rsH = params.rsH,
    format = params.format,
    placement = params.placement,
    $title = $("#title"),
    $digitalClock = $(".digital-clock");

  /*
   *  Private Methods
   */
  function setBodyScale() {
    var fontSize = parseInt($digitalClock.css("font-size")),
      width = params.rsW;

    if (((placement === "left") || (placement === "right")) && (params.verticalAlign === "middle")) {
      if ($title.length > 0) {
        width = width - $("#title").outerWidth();
      }
    }

    // Use 00:00:00 AM format to create widest time possible.
    if (format === "standard-seconds") {
      $digitalClock.html("00:00:00 AM");
    }
    else if (format === "standard") {
      $digitalClock.html("00:00 AM");
    }
    else if (format === "military-seconds") {
      $digitalClock.html("00:00:00");
    }
    else {
      $digitalClock.html("00:00");
    }

    // Continually increase the font size until the content grows bigger than the Placeholder.
    while ((document.getElementById("digital").offsetWidth < width) &&
      (document.getElementById("digital").offsetHeight < rsH)) {
      $digitalClock.css("font-size", ++fontSize);
    }

    // It's too big; back up one.
    $digitalClock.css("font-size", --fontSize);
  }

  /*
   *  Public Methods
   */
  function init() {
    setBodyScale();

    // Vertical alignment
    if (params.showTitle) {
      if ((placement === "top") || (placement === "bottom")) {
        if ($title.length > 0) {
          $digitalClock.css("line-height", rsH - $title.outerHeight() + "px");
        }
        else {
          $digitalClock.css("line-height", rsH + "px");
        }
      }
      else {
        $digitalClock.css("line-height", rsH + "px");
      }
    }
    else {
      $digitalClock.css("line-height", rsH + "px");
    }
  }

  function draw() {
    var now = params.useLocalTime ? new Date() : new timezoneJS.Date(new Date(), params.timeZone);

    if (format === "standard-seconds") {
      $digitalClock.html(moment(now).format("h:mm:ss A"));
    }
    else if (format === "standard") {
      $digitalClock.html(moment(now).format("h:mm A"));
    }
    else if (format === "military-seconds") {
      $digitalClock.html(moment(now).format("H:mm:ss"));
    }
    else {
      $digitalClock.html(moment(now).format("H:mm"));
    }

    timeoutID = setTimeout(function() {
      draw();
    }, 1000);
  }

  function pause() {
    clearTimeout(timeoutID);
  }

  return {
    "init": init,
    "drawDigital": draw,
    "pause": pause
  };
};
