define([
    "connecta.maps",
    "maps/project/service/project-service"
], function (maps) {

    return maps.lazy.controller("ProjectFormController", function ($scope, $timeout) {

        $scope.currentStep = 1;

        $scope.steps = {
            1 : {
                style : "active",
                templateUrl : "app/maps/project/template/_project-form-general-information.html",
                first : true
            },
            2 : {
                style : "disabled",
                templateUrl : "app/maps/project/template/_project-form-link-datasource.html"
            },
            3 : {
                style : "disabled",
                templateUrl : "app/maps/project/template/_project-form-tools.html"
            },
            4 : {
                style : "disabled",
                templateUrl : "app/maps/project/template/_project-form-exhibition.html",
                last : true
            }
        };

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
