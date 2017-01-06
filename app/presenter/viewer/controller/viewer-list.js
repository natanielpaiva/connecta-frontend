/* global angular */
define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/viewer/controller/modal-instance-ctrl',
    'portal/layout/service/confirm'
], function (presenter) {
    return presenter.lazy.controller('ViewerListController', function ($scope, $confirm, ViewerService, ngTableParams, $modal, $routeParams) {
        $scope.viewers = [];
        
        $scope.types = ViewerService.getTypes();
        
        $scope.tableParams = new ngTableParams({
            count: 50,
            page: 1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return ViewerService.list(params.url()).then(function(response){
                    $scope.viewers = response.data;
                });
            },
            counts:[50,100,150,200]
        });
        
        $scope.bulkRemove = function (viewers) {
            $confirm('VIEWER.BULK_DELETE_CONFIRM', 'VIEWER.BULK_CONFIRM_DELETE').then(function(){
                ViewerService.bulkRemove(viewers).then(function(){
                    angular.forEach(viewers, function(viewer){
                        $scope.viewers.splice(
                            $scope.viewers.indexOf(viewer), 1);
                    });
                });
            });
        };

        function openModal(){
            $modal.open({
                animation: true,
                templateUrl: 'app/presenter/viewer/template/_template-types.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg'
            });
        }

        $scope.open = function () {
            openModal();
        };
        
        if($routeParams.analysis){
             openModal();
        }
        
    });
});