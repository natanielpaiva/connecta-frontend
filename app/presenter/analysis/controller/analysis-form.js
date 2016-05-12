/* global angular */

define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/datasource/service/datasource-service',
    'presenter/singlesource/service/singlesource-service'
], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function (
            $scope, AnalysisService, DatasourceService, SingleSourceService, $timeout, $routeParams, $location) {

        //modelo de um 'DataSource' de CSV para ajustar os problemas nas tabelas
        //este conceito será refatorado, visto que um CSV não é um dataSource.
        var csvDS = {id:'csv',name:'CSV',type:'CSV'};

        $scope.edit = false;

        $scope.getAttributes = function (val) {
            return SingleSourceService.getAttribute(val);
        };

        $scope.optionsAttributeTypes = SingleSourceService.getAttributeTypes();

        $scope.datasourceCurrent = null;

        function resetComponent() {
            if (!$scope.component) {
                $scope.component = {};
            }
            $scope.component.catalog = [];
            $scope.component.domain = [];
            $scope.component.operationWebservice = [];
        }
        
        resetComponent();

        $scope.showForm = false;

        $scope.types = AnalysisService.getTypes();

        $scope.subform = {
            template: '',
            controller: function ($scope) {
            }
        };

        function timeReload() {
            $timeout(function () {
                $scope.showForm = true;
            });
        }

        if ($routeParams.id) {
            $scope.edit = true;
            AnalysisService.getAnalysis($routeParams.id).then(function (response) {
                //preenche o select de tabelas do banco de dados
                $scope.analysis = response.data;
                $scope.datasourceCurrent = $scope.analysis.datasource;
                if($scope.datasourceCurrent === undefined){
                    $scope.analysis.datasource = csvDS;
                    $scope.datasourceCurrent = csvDS;
                }else{
                    $scope.analysis.datasource.type = response.data.type;
                }
                $scope.subform = $scope.types[response.data.type];

                timeReload();
            });
        } else {
            $scope.analysis = {};
            
            DatasourceService.list({count: 1000, page: 1}).then(function (response) {
                $scope.listDatasource = response.data.content;
                //adiciona CSV na primeira posicao da lista
                $scope.listDatasource.splice(0, 0, csvDS);
            });

            $scope.$watch('analysis.datasource.id', function (idDatasouce) {
                $scope.showForm = false;
                for (var ds  in $scope.listDatasource) {
                    if (idDatasouce === $scope.listDatasource[ds].id.toString()) {

                        $scope.datasourceCurrent = $scope.listDatasource[ds];
                        //Monta o template de acordo com o datasource

                        $scope.analysis.type = $scope.datasourceCurrent.type;
                        $scope.analysis.datasource.type = $scope.datasourceCurrent.type;
                        $scope.subform = $scope.types[$scope.datasourceCurrent.type];

                        if ($scope.types[$scope.datasourceCurrent.type].start) {
                            resetComponent();

                            $scope.types[$scope.datasourceCurrent.type].start(
                                    $scope.datasourceCurrent,
                                    $scope.component);
                        }
                    }
                }

                $scope.analysis.analysisAttributes = [];

                timeReload();
            });
        }

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        //###############################################################################################

        $scope.submit = function () {
            if ($scope.types.SOLR.name === $scope.datasourceCurrent.type) {
                var queryCopy = angular.copy($scope.analysis.query);

                AnalysisService.saveQueryBuilder(queryCopy).success(function(data) {
                    $scope.analysis.query = {
                        id: data.id
                    };

                    AnalysisService.save($scope.analysis).then(function(response) {
                        $location.path('presenter/analysis/'+response.data.id);
                    });
                });
            } else {
                var analysisCopy = angular.copy($scope.analysis);
                if($scope.types.CSV.name === $scope.datasourceCurrent.type)
                    delete analysisCopy.datasource;

                AnalysisService.save(analysisCopy).then(function(response) {
                    $location.path('presenter/analysis/'+response.data.id);
                });
            }
        };

    });
});
