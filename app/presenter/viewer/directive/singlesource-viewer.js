/* global angular */

define([
    'connecta.portal',
    'presenter/singlesource/service/singlesource-service'
], function (portal) {
    return portal.lazy.directive('singlesourceViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/singlesource-viewer.html',
            scope: {
                model: '=?ngModel'
            },
            controller: function ($scope, fileExtensions, SingleSourceService) {
                // FIXME gato feioso enquanto não refatora a diretiva
                $scope.isEditing = $scope.model.singlesource &&
                        angular.isArray($scope.model.singlesource.list);
                
                if ($scope.model.singleSource.type === 'FILE') {
                    $scope.model.singleSource.binaryFile = SingleSourceService
                        .getFileById($scope.model.singleSource.id);
                }

                $scope.fileExtensions = fileExtensions;

                // FIXME remover isso para o código do form, isso não é da diretiva
                $scope.$watchCollection("model.singlesource.list", function (newList, oldList) {
                    if ($scope.isEditing && newList.length > 1) {
                        for (var key in newList) {
                            for (var k in oldList) {
                                if (oldList[k].id === newList[key].id) {
                                    $scope.model.singlesource.list.splice(key, 1);
                                }
                            }
                        }
                    }
                });

                window.loadConnectaMaps = function(){
                    setTimeout(function () {
                        var iframeId = 'iframe_' + $scope.model.singleSource.id;
                        var iframe = document.getElementById(iframeId);
                        console.log(iframe);
                        if(iframe){
                            $scope.model.singleSource.singleSourceAttributes.forEach(function(ssa){
                                if(ssa.attribute.type === 'CONNECTA_MAPS'){
                                    console.log(ssa.value);
                                    iframe.contentWindow.postMessage(JSON.parse(ssa.value),'*');
                                }
                            });
                        }
                    }, 2000);
                };
            },
        };
    });
});
