define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'maps/presenter-source/service/presenter-source-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('DrillFormController', function (
            $scope, $routeParams, DrillService, LayerViewerService, PresenterSourceService, notify, $translate, $location, $modal, $rootScope) {

        $scope.drill = null;
        $scope.isEditing = false;
        $rootScope.drillLevels = [];
        $rootScope.viewers = [];
        $rootScope.parentColumns = [];
        $rootScope.childColumns = [];

        //Lista de análises do presenter 1.0
        PresenterSourceService.list().then(function (response) {
            PresenterSourceService.get(response.data[0].id).then(function (response) {
                $scope.presenterSource = response.data;
                PresenterSourceService.getUserDomain($scope.presenterSource, $scope);
            }, function (response) {
                console.info("error", response);
            });
        });



        //Lista de visualizadores de mapa 
        LayerViewerService.listAllWmsViewers().then(function (response) {
            console.info("response", response, response.data);
            $rootScope.viewers = response.data;
            console.info("$scope.viewers", $scope.viewers);
        }, function (response) {
            console.info("error", response);
        });


        //Retorna lista de colunas da Layer do Visualizador
        $rootScope.getLayerColumnsFromViewer = function (viewer, type) {
            var columns = viewer.layerEntity.txt_columns.split('#');
            var columnsArray = [];
            for (var col in columns) {
                columnsArray.push({'columnName': columns[col]});
            }

            if (type === 'parent') {
                $rootScope.parentColumns = columnsArray;
            } else {
                $rootScope.childColumns = columnsArray;
            }
        };



        if ($routeParams.id) {
            $scope.isEditing = true;
            DrillService.get($routeParams.id).success(function (data) {
                $scope.drill = data;
                $rootScope.drillLevels = $scope.drill.drillLevels;
                for (var dLevel in $rootScope.drillLevels) {
                    $rootScope.drillLevels[dLevel].parentColumn = "";
                    $rootScope.drillLevels[dLevel].parentColumn = {'columnName': $rootScope.drillLevels[dLevel].parentViewerColumn};
                    $rootScope.drillLevels[dLevel].childColumn = {'columnName': $rootScope.drillLevels[dLevel].childViewerColumn};
                }

                $scope.drill.drillLevels = $rootScope.drillLevels;

                //define o valor da análise selecionada
                var interval = setInterval(function () {
                    if (typeof $scope.presenterAnalysis != 'undefined') {

                        for (var obj in $scope.presenterAnalysis) {
                            if ($scope.presenterAnalysis[obj].id === $scope.drill.analysis) {
                                angular.element("#analysis").find("option[label='" + $scope.presenterAnalysis[obj].title + "']").attr('selected', 'true');
                                angular.element("#analysis").trigger('change');
                                clearInterval(interval);
                            }
                        }
                    }
                }, 10);



            });
        }

        $scope.deleteDrillLevel = function (drillLevel) {
            var objDrillLevel = null;
            for (var obj in $rootScope.drillLevels) {
                if ($rootScope.drillLevels[obj].name == drillLevel.name) {
                    objDrillLevel = $rootScope.drillLevels[obj];
                }
            }
            var index = $rootScope.drillLevels.indexOf(objDrillLevel);
            $rootScope.drillLevels.splice(index, 1);
        };


        $scope.openModal = function (drillLevel) {
            var isEdit = false;
            if (typeof drillLevel != 'undefined') {
                isEdit = true;
                var dLevel = "";
                for (var obj in $rootScope.drillLevels) {
                    if ($rootScope.drillLevels[obj].name === drillLevel.name) {
                        dLevel = $rootScope.drillLevels[obj];
                    }
                }
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/maps/drill/template/drill-level-form.html",
                controller: function ($scope, $rootScope) {
                    $scope.drillLevel = drillLevel;
                    $scope.viewers = $rootScope.viewers;


                    //Preenche o Formulário
                    if (!isEdit && $rootScope.drillLevels.length === 0) {

                    } else {
                        var interval = setInterval(function () {
                            if (typeof $scope.formulario != 'undefined') {
                                if (!isEdit && $rootScope.drillLevels.length > 0) {
                                    //TODO
                                    //angular.element("#parent").trigger('change').find("option[label='Sprint Goiaba Nadal']").attr('selected', 'true');

                                    angular.element("#parent").find("option[label='" + $rootScope.drillLevels[$rootScope.drillLevels.length - 1].childViewer.nm_viewer + "']").attr('selected', 'true');
                                    angular.element("#parent").trigger('change');
                                    angular.element("#parentColumn").find("option[label='" + $rootScope.drillLevels[$rootScope.drillLevels.length - 1].childColumn.columnName + "']").attr('selected', 'true');
                                    angular.element("#parentColumn").trigger('change');
                                    angular.element("#parent").attr('disabled', true);
                                    angular.element("#parentColumn").attr('disabled', true);
                                    clearInterval(interval);

                                } else if (isEdit && typeof $scope.formulario.name.$viewValue != 'undefined') {
                                    angular.element("#parent").find("option[label='" + $scope.drillLevel.parentViewer.nm_viewer + "']").attr('selected', 'true');
                                    angular.element("#parent").trigger('change');
                                    angular.element("#child").find("option[label='" + $scope.drillLevel.childViewer.nm_viewer + "']").attr('selected', 'true');
                                    angular.element("#child").trigger('change');
                                    angular.element("#parentColumn").find("option[label='" + $scope.drillLevel.parentColumn.columnName + "']").attr('selected', 'true');
                                    angular.element("#childColumn").find("option[label='" + $scope.drillLevel.childColumn.columnName + "']").attr('selected', 'true');
                                    clearInterval(interval);
                                }
                            }
                        }, 10);
                    }

                    $scope.ok = function (drillLevel) {
                        if (typeof dLevel != 'undefined') {
                            var index = $rootScope.drillLevels.indexOf(dLevel);
                            $rootScope.drillLevels.splice(index, 1);
                        }
                        $rootScope.drillLevels.push(drillLevel);
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };




        $scope.submit = function () {

            for (var dLevel in $rootScope.drillLevels) {
                var index = $rootScope.drillLevels.indexOf($rootScope.drillLevels[dLevel]);
                $rootScope.drillLevels[dLevel].drillLevel = index;
                $rootScope.drillLevels[dLevel].parentViewerColumn = $rootScope.drillLevels[dLevel].parentColumn.columnName;
                $rootScope.drillLevels[dLevel].childViewerColumn = $rootScope.drillLevels[dLevel].childColumn.columnName;
            }

            $scope.drill.analysis = $scope.drill.analysis.id;
            $scope.drill.drillLevels = $rootScope.drillLevels;

            console.info("DRILL OBJECT", $scope.drill);


            DrillService.save($scope.drill).then(function (response) {

                $translate('DRILL.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/drill');
                    $scope.tableParams.reload();
                });

            }, function () {

                $translate('DRILL.ERROR_SAVING').then(function (text) {
                    notify.error(text);
                    $location.path('maps/drill');
                });

            });
        };

    });
});