/* global angular */
define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/datasource/service/datasource-service',
    'presenter/viewer/service/viewer-service',
    'presenter/singlesource/service/singlesource-service'
], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function ($scope,
            AnalysisService, DatasourceService, SingleSourceService, ViewerService,
            $timeout, $routeParams, $location) {

        //modelo de um 'DataSource' de CSV para ajustar os problemas nas tabelas
        //este conceito será refatorado, visto que um CSV não é um dataSource.
        var csvDS = {id: 'csv', name: 'CSV', type: 'CSV'};

        $scope.analysis = {
            analysisRelations: [],
            datasource: {id: null}
        };

        $scope.edit = false;
        $scope.optionsAttributeTypes = SingleSourceService.getAttributeTypes();
        $scope.datasourceCurrent = null;
        $scope.analysisColumnsDrill = [];
        $scope.analysisRelationSuggestions = [];

        function updateAnalysisType() {
            $scope.showForm = false;

            if ($scope.listDatasource && $scope.analysis.datasource.id) {
                var datasource = $scope.listDatasource.filter(function (object) {
                    return $scope.analysis.datasource.id === object.id;
                }).pop();

                $scope.datasourceCurrent = datasource;
                $scope.analysis.datasource = datasource;
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

                $scope.analysis.analysisAttributes = [];

                timeReload();
            }
        }

        if ($routeParams.id) {
            $scope.edit = true;
            AnalysisService.getAnalysis($routeParams.id).then(function (response) {
                
                //preenche o select de tabelas do banco de dados
                angular.extend($scope.analysis, response.data);
                prepareOrderDrill($scope.analysis.analysisColumns);
                $scope.datasourceCurrent = $scope.analysis.datasource;
                if ($scope.datasourceCurrent === undefined) {
                    $scope.analysis.datasource = csvDS;
                    $scope.datasourceCurrent = csvDS;
                } else {
                    $scope.analysis.datasource.type = response.data.type;
                }
               
                
                $scope.subform = $scope.types[response.data.type];

                if ($scope.analysis.analysisRelations &&
                        $scope.analysis.analysisRelations.length) {
                    $scope.analysis.analysisRelations.forEach(function (relation) {
                        $scope.getRightAnalysisColumns(relation);
                    });
                }

                timeReload();
            });
        } else {
            DatasourceService.list({count: 1000, page: 1}).then(function (response) {
                $scope.listDatasource = response.data.content;
                //adiciona CSV na primeira posicao da lista
                $scope.listDatasource.splice(0, 0, csvDS);
            });

            $scope.$watch('analysis.datasource.id', updateAnalysisType);
            $scope.$watch('listDatasource', updateAnalysisType);
        }

        if ($routeParams.datasource) {
            timeReload();
            $scope.analysis.datasource.id = parseInt($routeParams.datasource);
            $scope.cameFromAnalysis = true;
        }


        $scope.getAttributes = function (val) {
            return SingleSourceService.getAttribute(val);
        };

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

        //Função para que o array de analysisColumnDrill seja populado corretamente
        function prepareOrderDrill(analysisColumns) {
            var array = {};
            for (var a in analysisColumns) {
                if (analysisColumns[a].orderDrill !== undefined && analysisColumns[a].orderDrill !== '') {
                    array[analysisColumns[a].orderDrill] = analysisColumns[a];
                }
            }
            for (var key in array) {
                $scope.analysisColumnsDrill.push(array[key]);
            }
        }

        // Analysis relations
        $scope.autosuggest = function () {

        };

        $scope.acceptSuggestion = function (index, suggestion) {
            $scope.analysis.analysisRelations.push(suggestion);
            $scope.analysisRelationSuggestions.splice(index, 1);
        };

        $scope.otherAnalysis = [];
        ViewerService.analysisList().then(function (response) {
            $scope.otherAnalysis = response.data.filter(function (other) {
                return other.id !== $scope.analysis.id;
            });
        });

        $scope.addRelation = function () {
            var leftAnalysisColumn = $scope.analysis.analysisColumns && $scope.analysis.analysisColumns.length ?
                    $scope.analysis.analysisColumns[0] : null;

            var relation = {
                leftAnalysisColumn: leftAnalysisColumn,
                rightAnalysis: null,
                rightAnalysisColumn: null
            };

            $scope.analysis.analysisRelations.push(relation);
            $scope.getRightAnalysisColumns(relation);
        };

        $scope.getRightAnalysisColumns = function (relation) {
            if (!relation.rightAnalysis ||
                    !relation.rightAnalysis.analysisColumns ||
                    !relation.rightAnalysis.analysisColumns.length) {

                AnalysisService.getAnalysis(relation.rightAnalysis.id).then(function (response) {
                    relation.rightAnalysis.analysisColumns = response.data.analysisColumns;
                });
            }
        };

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        //###############################################################################################


        function addOrderDrill(analysis, analysisColumnDrill) {

            delete analysis.hasDrill;

            for (var column in analysis.analysisColumns) {
                delete analysis.analysisColumns[column].orderDrill;

                for (var c in analysisColumnDrill) {
                    if (analysisColumnDrill[c].name === analysis.analysisColumns[column].name) {
                        analysis.hasDrill = true;
                        analysis.analysisColumns[column].orderDrill = c;
                    }
                }
            }
        }


        $scope.submit = function () {

            addOrderDrill($scope.analysis, $scope.analysisColumnsDrill);

            if ($scope.types.SOLR.type === $scope.datasourceCurrent.type) {
                var queryCopy = angular.copy($scope.analysis.query);

                if ($scope.analysis.requestType === "QUERY_BUILDER") {
                    $scope.analysis.textQuery = null;
                    AnalysisService.saveQueryBuilder(queryCopy).success(function (data) {
                        $scope.analysis.query = {
                            id: data.id
                        };
                    });

                } else if ($scope.analysis.requestType === "TEXT_QUERY") {
                    $scope.analysis.query = null;
                }
                //console.log("submit", $scope.analysis);
                AnalysisService.save($scope.analysis).then(function (response) {
                    $location.path('presenter/analysis/' + response.data.id);
                });
            } else {
                var analysisCopy = angular.copy($scope.analysis);
                if ($scope.types.CSV.type === $scope.datasourceCurrent.type)
                    delete analysisCopy.datasource;

                AnalysisService.save(analysisCopy).then(function (response) {
                    $location.path('presenter/analysis/' + response.data.id);
                    //console.log("Save response", response)
                });
            }
        };
    });
});
