"use strict";

describe("World Clock Widget Settings", function() {
  beforeEach(module("risevision.widget.worldClock.settings"));

  var defaultSettings, $scope;

  beforeEach(function() {
    inject(function($injector, $rootScope, $controller) {
      defaultSettings = $injector.get("defaultSettings");
      $scope = $rootScope.$new();

      $controller("worldClockSettingsController", { $scope: $scope });
    });
  });

  it("should define defaultSettings", function() {
    expect(defaultSettings).to.be.truely;
    expect(defaultSettings).to.be.an("object");
  });

  it("should define worldClockSettingsController", function() {
    expect($scope.currentDate).to.be.truely;
    expect($scope.currentDate).to.be.an.instanceof(Date);
  });
});
