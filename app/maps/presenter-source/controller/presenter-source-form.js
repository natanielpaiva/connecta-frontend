define([
    'connecta.maps',
    'maps/presenter-source/service/presenter-source-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('PresenterSourceFormController', function ($scope, PresenterSourceService, notify, $location, $routeParams, $translate) {
        $scope.presenterSource = null;
        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            PresenterSourceService.get($routeParams.id).success(function (data) {
                $scope.presenterSource = data;

            });
        }

        $scope.submit = function () {
            console.info("aqui", $scope.presenterSource);
            PresenterSourceService.save($scope.presenterSource).then(function () {
                $translate('PRESENTERSOURCE.ADDED_SUCCESS').then(function (text) {
                    notify.success(text);
                });
                $location.path('maps/presenter-source');
            }, function (response) {
                notify.error(response);
            });

        };
    });
});