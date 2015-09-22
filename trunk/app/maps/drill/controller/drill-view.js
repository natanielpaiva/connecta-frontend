define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('DrillViewController', function ($scope, DrillService, notify, $routeParams, $location, $translate,$modalTranslate) {


        DrillService.get($routeParams.id).then(function (response) {
            

            $scope.drill = response.data;  
            console.info("DRILL",$scope.drill);
            

            $scope.remove = function (id) {
                DrillService.delete(id).then(function () {
                    $translate('LAYERVIEWER.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/drill');
                    });
                }, function (response) {
                    $translate('LAYERVIEWER.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/drill');
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
            $modalTranslate($scope.modalParams, 'title', 'LAYERVIEWER.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERVIEWER.CONFIRM_DELETE');


//            ConnectaGeoService.showViewer($scope.layerViewer);

    });
});
});