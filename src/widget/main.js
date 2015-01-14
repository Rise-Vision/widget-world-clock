/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    id = prefs.getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  function play() {
    RiseVision.WorldClock.play();
  }

  function pause() {
    RiseVision.WorldClock.pause();
  }

  function stop() {
    RiseVision.WorldClock.stop();
  }

  if (id) {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);

    gadgets.rpc.register("rsparam_set_" + id, RiseVision.WorldClock.setParams);
    gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
  }
})(window, document, gadgets);
