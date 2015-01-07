/* global timezoneJS */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = RiseVision.WorldClock || {};
RiseVision.WorldClock.Analog = {};

RiseVision.WorldClock.Analog = function(params) {
  "use strict";
  var timeoutID = 0,
    clockSize = 0,
    canvasFont = "";

  /*
   *  Public Methods
   */
  function init() {
    var $container = $(".container"),
      $title = $("#title"),
      $analog = $(".analog-clock"),
      canvas = document.getElementById("analog"),
      placement = params.placement,
      rsW = params.rsW,
      rsH = params.rsH,
      analogFont = params.analogFont;

    $container.width(rsW).height(rsH);

    // Calculate dimensions of clock canvas. Must be a square.
    if (params.showTitle) {
      if ((placement === "top") || (placement === "bottom")) {
        clockSize = rsH - $title.outerHeight();

        if (clockSize > rsW) {
          clockSize = rsW;
        }

        canvas.width = clockSize;
        canvas.height = clockSize;

        $container.addClass("halign-center");
      }
      else {
        if (params.verticalAlign === "middle") {
          clockSize = rsW - $title.outerWidth();

          if (clockSize > rsH) {
            clockSize = rsH;
          }

          // Vertical alignment
          $analog.addClass("valign");
          $analog.css("margin-top", -clockSize / 2 + "px");
        }
        else {
          clockSize = rsH - $title.outerHeight();

          if (clockSize > rsW) {
            clockSize = rsW;
          }

          $container.addClass("halign-center");
        }

        canvas.width = clockSize;
        canvas.height = clockSize;
      }
    }
    else {
      // Ensure clock's canvas is a square.
      // Landscape
      if (rsW > rsH) {
        clockSize = rsH;

        // Center horizontally.
        $container.addClass("halign-center");
      }
      // Portrait
      else if (rsW < rsH) {
        clockSize = rsW;

        // Center vertically.
        $analog.css("margin-top", (rsH / 2) - (clockSize / 2) + "px");
      }
      else {
        clockSize = rsW;
      }

      canvas.width = clockSize;
      canvas.height = clockSize;
    }

    // Set canvas font.
    canvasFont = analogFont.bold ? "bold " : "";
    canvasFont += analogFont.italic ? "italic " : "";
    canvasFont += analogFont.size + "px ";
    canvasFont += analogFont.font.family;
  }

  /* This function is adapted from code located at http://www.neilwallis.com/projects/html5/clock/ */
  function draw() {
    var ang = 0,
      sang = 0,
      cang = 0,
      sx = 0,
      sy = 0,
      ex = 0,
      ey = 0,
      nx = 0,
      ny = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      c2d = null,
      now = null,
      canvas = document.getElementById("analog");

    if (canvas.getContext) {
      c2d = canvas.getContext("2d");

      c2d.clearRect(0, 0, clockSize, clockSize);

      c2d.font = canvasFont;
      c2d.textBaseline = "middle";
      c2d.textAlign = "center";
      c2d.lineWidth = 1;
      c2d.save();

      // Frame and face
      c2d.strokeStyle = params.frameColor;
      c2d.fillStyle = params.faceColor;
      c2d.lineWidth = params.frameWidth;
      c2d.beginPath();
      c2d.arc(clockSize / 2, clockSize / 2, (clockSize / 2) - (params.frameWidth / 2), 0, Math.PI * 2, true);
      c2d.fill();
      c2d.stroke();

      c2d.strokeStyle = params.analogFont.color;
      c2d.fillStyle = params.analogFont.color;
      c2d.save();

      c2d.translate(clockSize / 2, clockSize / 2);

      // Ticks and numerals
      for (var i = 1; i <= 60; i++) {
        ang = Math.PI / 30 * i;
        sang = Math.sin(ang);
        cang = Math.cos(ang);

        // If modulus of divide by 5 is zero then draw an hour marker/numeral.
        if (i % 5 === 0) {
          c2d.lineWidth = params.hourTickWidth;
          sx = sang * clockSize / 2.9;
          sy = cang * -clockSize / 2.9;
          ex = sang * clockSize / 2.3;
          ey = cang * -clockSize / 2.3;
          nx = sang * clockSize / 3.55;
          ny = cang * -clockSize / 3.55;

          c2d.fillText(i / 5, nx, ny);
        }
        // Minute marker
        else {
          if (params.minuteTickWidth > 0) {
            c2d.lineWidth = params.minuteTickWidth;
            sx = sang * clockSize / 2.5;
            sy = cang * clockSize / 2.5;
            ex = sang * clockSize / 2.3;
            ey = cang * clockSize / 2.3;
          }
        }

        c2d.beginPath();
        c2d.moveTo(sx, sy);
        c2d.lineTo(ex, ey);
        c2d.stroke();
      }

      // Time
      now = params.useLocalTime ? new Date() : new timezoneJS.Date(new Date(), params.timeZone);
      hours = now.getHours();
      minutes = now.getMinutes();
      seconds = now.getSeconds();

      c2d.strokeStyle = params.handColor;
      c2d.lineWidth = params.handWidth;
      c2d.save();

      /* Draw clock pointers but this time rotate the canvas rather than
       calculating x/y start/end positions. */

      // Hour hand
      c2d.rotate(Math.PI / 6 * (hours + (minutes / 60) + (seconds / 3600)));
      c2d.beginPath();
      c2d.moveTo(0, clockSize / 30);
      c2d.lineTo(0, -clockSize / 5);
      c2d.stroke();
      c2d.restore();
      c2d.save();

      // Minute hand
      c2d.rotate(Math.PI / 30 * (minutes + (seconds / 60)));
      c2d.beginPath();
      c2d.moveTo(0, clockSize / 15);
      c2d.lineTo(0, -clockSize / 2.5);
      c2d.stroke();
      c2d.restore();
      c2d.save();

      // Second hand
      if (params.showSecondHand) {
        c2d.rotate(Math.PI / 30 * seconds);
        c2d.strokeStyle = params.secondHandColor;
        c2d.lineWidth = params.secondHandWidth;
        c2d.beginPath();
        c2d.moveTo(0, clockSize / 15);
        c2d.lineTo(0, -clockSize / 2.5);
        c2d.stroke();
      }

      c2d.restore();

      /* Additional restore to go back to state before translate.
         Alternative would be to simply reverse the original translate. */
      c2d.restore();

      timeoutID = setTimeout(function() {
        draw();
      }, 1000);
    }
  }

  function pause() {
    clearTimeout(timeoutID);
  }

  return {
    "init": init,
    "drawAnalog": draw,
    "pause": pause
  };
};
