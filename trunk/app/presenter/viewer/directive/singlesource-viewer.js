define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('singlesourceViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/singlesource-viewer.html',
            scope: {
                model: '=?ngModel'
            },
            controller: function ($scope, fileExtensions) {

                $scope.fileExtensions = fileExtensions;

                $scope.config = {
                    draggable: {
                        enabled: true
                    },
                    resizable: {
                        enabled: true
                    }
                };

                $scope.$watchCollection("model.singlesource.list", function (newList, oldList) {
                    if (newList.length > 1) {
                        for (var key in newList) {
                            for (var k in oldList) {
                                if (oldList[k].id === newList[key].id) {
                                    $scope.model.singlesource.list.splice(key, 1);
                                }
                            }
                        }
                    }
                });

            }
        };
    });
});
