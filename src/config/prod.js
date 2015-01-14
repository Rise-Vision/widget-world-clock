/* global config: true */
/* exported config */
if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}

if (typeof config === "undefined") {
  var config = {
    zoneFileBasePath: "http://s3.amazonaws.com/widget-world-clock/0.1.0/dist/timezone"
  };
}
