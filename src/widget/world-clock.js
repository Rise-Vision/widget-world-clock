/* global gadgets, config, timezoneJS */

var RiseVision = RiseVision || {};
RiseVision.WorldClock = {};

RiseVision.WorldClock = (function (gadgets, config) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    clockType = "digital",
    params = null,
    analog = null,
    digital = null;

  /*
   *  Private Methods
   */
  function init() {
    var $title = "",
      $container = $(".container"),
      placement = params.placement;

    // Title
    if (params.showTitle) {
      $title = $("<div id='title' class='title'></div>");
      $title.text(params.title);
      $title.addClass(clockType + " " + placement);
      $title.css("padding", params.padding + "px");

      if ((placement === "top") || (placement === "bottom")) {
        $title.addClass("halign-" + params.horizontalAlign);

        if (placement === "top") {
          $container.prepend($title);
        }
        else {
          $container.append($title);
        }
      }
      else {
        $title.addClass("valign-" + params.verticalAlign);

        if (params.verticalAlign === "middle") {
          $title.css("line-height", params.rsH - params.padding * 2 + "px");
          $container.css("text-align", "left");
        }

        $container.prepend($title);
      }
    }

    timezoneJS.timezone.zoneFileBasePath = config.zoneFileBasePath;
    timezoneJS.timezone.init({ async : false });

    if (clockType === "analog") {
      analog = new RiseVision.WorldClock.Analog(params);
      analog.init();
      $(".digital-clock").hide();
    }
    else {
      digital = new RiseVision.WorldClock.Digital(params);
      digital.init();
      $(".analog-clock").hide();
    }

    document.body.style.background = params.background.color;

    ready();
  }

  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, false);
  }

  /*
   *  Public Methods
   */
  function setParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        clockType = params.clockType;
        params.rsW = prefs.getString("rsW");
        params.rsH = prefs.getString("rsH");
        $(".container").width(params.rsW).height(params.rsH);

        // Load fonts.
        var fontSettings = [
          {
            "class": "title",
            "fontSetting": params.titleFont
          },
          {
            "class": "analog-clock",
            "fontSetting": params.analogFont
          },
          {
            "class": "digital-clock",
            "fontSetting": params.digitalFont
          }
        ];

        RiseVision.Common.Utilities.loadFonts(fontSettings);
        init();
      }
    }
  }

  function play() {
    if (clockType === "analog") {
      analog.drawAnalog();
    }
    else {
      digital.drawDigital();
    }
  }

  function pause() {
    if (clockType === "analog") {
      analog.pause();
    }
    else {
      digital.pause();
    }
  }

  function stop() {
    /* Ideally, the Widget should destroy itself, but unable to do so right now
      since `stop` is being called by RVA instead of `pause` when it's the only
      item in a Playlist. */
    pause();
  }

  return {
    "setParams": setParams,
    "play": play,
    "pause": pause,
    "stop": stop
  };
})(gadgets, config);
