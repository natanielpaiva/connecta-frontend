/* global angular */
define([
    'connecta.portal',
    'maps/layer-viewer/service/connecta-geo-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/uuid'
], function (portal) {
    return portal.lazy.directive('mapViewer', function () {
        return {
            templateUrl: 'app/maps/layer-viewer/directive/template/map-viewer.html',
            scope: {
                model: '=ngModel',
                height: '=?'
            },
            controller: function ($scope, LayerViewerService, ConnectaGeoService, uuid) {
//                $scope.model.type='MAP';
                $scope.mapDivId = uuid();
                
                LayerViewerService.getById($scope.model.id).then(function(response){
                    angular.extend($scope.model, response.data);
                    ConnectaGeoService.showViewer($scope.model, $scope.mapDivId);
                });
            }
        };
    });
});