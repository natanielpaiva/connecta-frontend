define([
    'connecta.inspection'
], function (inspection) {

    return inspection.directive('statusChange', function () {
        return {
            restrict: 'E',
            controller: function ($scope, $http, inspectionResource) {

                $scope.changeStatus = function (status, $event) {
                    var url = inspectionResource.base + $scope.url;
                    $scope.object.status = status.name;
                    $http.post(url, $scope.object).then(function () {
                        $scope.callback.apply(null, $scope.object);
                    });
                    
                };

                $scope.getIconByState = function (stateName) {
                    for (var index in $scope.types) {
                        if ($scope.types[index].name === stateName) {
                            return $scope.types[index].icon;
                        }
                    }
                };
            },
            scope: {
                types: "=",
                object: "=",
                url: "@",
                callback: '='
            },
            link: function ($scope, elements, attrs) {
                $scope.path = "popoverConfig.html";
            },
            templateUrl: 'app/inspection/inspection/directive/template/status-change.html'
        };
    });
});