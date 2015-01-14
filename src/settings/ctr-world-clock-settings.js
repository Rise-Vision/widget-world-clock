angular.module("risevision.widget.worldClock.settings")
  .controller("worldClockSettingsController", ["$scope",
    function ($scope) {
      $scope.currentDate = new Date();

      $scope.$watch("settings.additionalParams.useLocalTime", function (useLocalTime) {
        if (useLocalTime !== undefined) {
          $scope.useLocalTime = useLocalTime;
        }
      });

      $scope.$watch("settings.additionalParams.showTitle", function (showTitle) {
        if (showTitle !== undefined) {
          $scope.showTitle = showTitle;
        }
      });

      $scope.$watch("settings.additionalParams.placement", function (placement) {
        if (placement !== undefined) {
          if ((placement === "top") || (placement === "bottom")) {
            $scope.showVerticalAlign = false;
          }
          else {
            $scope.showVerticalAlign = true;
          }
        }
      });

      $scope.$watch("settings.additionalParams.clockType", function (clockType) {
        if (clockType !== undefined) {
          if (clockType === "digital") {
            $scope.showDigital = true;
          }
          else {
            $scope.showDigital = false;
          }
        }
      });

      $scope.$watch("settings.additionalParams.showSecondHand", function (showSecondHand) {
        if (showSecondHand !== undefined) {
          $scope.showSecondHand = showSecondHand;
        }
      });
    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      "useLocalTime": true,
      "timeZone": "Pacific/Samoa",
      "showTitle": false,
      "title": "",
      "placement": "left",
      "padding": 10,
      "horizontalAlign": "center",
      "verticalAlign": "middle",
      "titleFont": {},
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
        "size": "48"
      },
      "format": "standard-seconds",
      "digitalFont": {},
      "background": {}
    }
  });
