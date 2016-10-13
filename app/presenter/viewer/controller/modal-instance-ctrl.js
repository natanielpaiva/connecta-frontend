define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ModalInstanceCtrl',
            function ($scope, $uibModalInstance, ViewerService, $filter, $routeParams) {


                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.selectedTemplateType = {};

                // $scope.returnSelectedTemplateType = function(){
                //     return $scope.templates.filter(function(templates){
                //       return templates.active;
                //     })[0];
                // };

                ViewerService.getTemplates().then(function (response) {
                    //Ordena os templates por ordem alfabetica
                    //e coloca a aba Other em ultimo lugar
                    $scope.templates = $filter('orderBy')(response.data, 'id');
                    var otherCopy = {};
                    for (var i = 0; i < $scope.templates.length; i++) {
                        $scope.templates[i].templates =
                                $filter('orderBy')($scope.templates[i].templates, 'id');
                        if ($scope.templates[i].id === "other") {
                            otherCopy = $scope.templates[i];
                            $scope.templates.splice(i, 1);
                            break;
                        }
                    }
                    $scope.templates.push(otherCopy);
                });


                if ($routeParams.analysis) {
                    $scope.analysis = "analysis/" + $routeParams.analysis;
                }

            });
});
