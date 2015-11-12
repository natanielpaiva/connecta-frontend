define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'maps/drill-level/service/drill-level-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('DrillFormController', function (
            $scope, $routeParams, DrillService, DrillLevelService, notify, $translate, $location, $modal, $rootScope) {

        $scope.drill = null;
        $scope.isEditing = false;        

        if ($routeParams.id) {
            $scope.isEditing = true;
            DrillService.get($routeParams.id).success(function (data) {
                $scope.drill = data;
            });
        }

        $scope.submit = function () {


            DrillService.save($scope.drill).then(function (response) {

                $translate('SUPPLIER.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/drill');
                    $scope.tableParams.reload();
                });

            }, function () {

                $translate('SUPPLIER.ERROR_SAVING').then(function (text) {
                    notify.error(text);
                    $location.path('maps/drill');
                });

            });
        };

    });
});