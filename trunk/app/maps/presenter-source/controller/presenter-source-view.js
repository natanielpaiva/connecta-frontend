define([
    'connecta.maps',
    'maps/presenter-source/service/presenter-source-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('PresenterSourceViewController', function ($scope, PresenterSourceService, notify, $routeParams, $location, $modalTranslate, $translate) {


        PresenterSourceService.get($routeParams.id).then(function (response) {
            $scope.presenterSource = response.data;
            
            $scope.remove = function (id) {
                console.info("REMOVE PRESENTERSOURCE");
                PresenterSourceService.delete(id).then(function () {
                    $translate('PRESENTERSOURCE.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/presenter-source');
                    });
                }, function (response) {
                    $translate('PRESENTERSOURCE.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/presenter-source');
                    });
                });
            };

            //Parâmetros da Modal
            $scope.modalParams = {
                title: "",
                text: "",
                size: 'sm',
                success: $scope.remove
            };

            //translate das propriedades da modal
            $modalTranslate($scope.modalParams, 'title', 'PRESENTERSOURCE.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'PRESENTERSOURCE.CONFIRM_DELETE');


        });

    });
});