/* global config: true */
/* exported config */
if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "components/rv-common-i18n/dist/locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}

if (typeof config === "undefined") {
  var config = {
    zoneFileBasePath: "../src/timezone"
  };
}
