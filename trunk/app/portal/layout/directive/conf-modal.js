define([
    'connecta.portal'
], function (portal) {
    
    function confModalCtrl($scope, $modalInstance, params) {
        $scope.params = params;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    return portal.directive('confModal', function ($modal) {
        return {
            restrict: 'A',
            scope: {
                confModal: '=',
                confModalArgs: '='
            },
            link: function ($scope, element) {
                element[0].onclick = function (e) {
                    var params = $scope.confModal;

                    var modalInstance = $modal.open({
                        templateUrl: 'app/portal/layout/directive/template/conf-modal-tpl.html',
                        controller: confModalCtrl,
                        size: params.size,
                        resolve: {
                            params: function () {
                                return params;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        if(params.success){
                            params.success.apply(null, $scope.confModalArgs);
                        }
                    });
                };
            }
        };
    });
});