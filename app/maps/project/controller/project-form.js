define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/steps",
    "maps/project/service/project-service",
    'maps/project/directive/menu-carrousel'
], function (maps, baseMapsConfig, stepsConfig) {

    return maps.lazy.controller("ProjectFormController", function ($scope) {

        $scope.currentStep = 1;

        $scope.steps = stepsConfig;

        $scope.baseMapThumbUrl = 'app/maps/project/template/_project_base_map_thumb.html';

        $scope.baseMaps = baseMapsConfig.baseMaps;

        $scope.changeStep = function (increment) {

            var active = "active",
                disabled = "disabled",
                complete = "complete",
                nextStep;

            if (increment) {
                $scope.steps[$scope.currentStep].style = complete;
                nextStep = $scope.currentStep + 1;
            } else {
                $scope.steps[$scope.currentStep].style = disabled;
                nextStep = $scope.currentStep - 1;
            }

            $scope.steps[nextStep].style = active;
            $scope.currentStep = nextStep;

        };

    });

});
