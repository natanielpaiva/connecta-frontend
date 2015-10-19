define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/datasource/service/datasource-service'

], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function (
            $scope, AnalysisService, DatasourceService, GroupService, $timeout, $routeParams, $location) {

        $scope.edit = false;

        $scope.datasourceCurrent = null;

        function resetComponent() {
            if (!$scope.component) {
                $scope.component = {};
            }
            $scope.component.catalog = [];
            //$scope.component.columns = [];
            $scope.component.domain = [];
            //$scope.component.typeWebservice = [];
            $scope.component.operationWebservice = [];
            //$scope.component.webserviceRestJson = {};
        }
        resetComponent();

        $scope.showForm = false;

        $scope.types = AnalysisService.getTypes();

        $scope.subform = {
            template: '',
            controller: function ($scope) {
            }
        };

//

        function timeReload() {
            $timeout(function () {
                $scope.showForm = true;
            });
        }



        if ($routeParams.id) {

            AnalysisService.getAnalysis($routeParams.id).then(function (response) {
                //preenche o select de tabelas do banco de dados
                $scope.analysis = response.data;
                $scope.edit = true;

                $scope.datasourceCurrent = $scope.analysis.datasource;

                $scope.analysis.type = response.data.type;
                $scope.analysis.datasource.type = response.data.type;
                $scope.subform = $scope.types[response.data.type];

                console.log("datasourceCurrent", $scope.datasourceCurrent);
                //console.log("$scope.subform edit", $scope.subform);

                $timeout(function () {
                    $scope.showForm = true;
                });
                // $scope.listTableDatasource = response.data;
            });
        } else {
            DatasourceService.list({count: 1000, page: 1}).then(function (response) {
                $scope.listDatasource = response.data.content;
            });

            $scope.$watch('analysis.datasource.id', function (idDatasouce) {
                for (var ds  in $scope.listDatasource) {

                    if (idDatasouce === $scope.listDatasource[ds].id.toString()) {

                        $scope.datasourceCurrent = $scope.listDatasource[ds];


                        //console.log("datasourceCurrent: ", datasourceCurrent);
                        //Monta o template de acordo com o datasource

                        //$scope.analysis.typeAnalysis = datasourceCurrent.type;
                        $scope.analysis.type = $scope.datasourceCurrent.type;
                        $scope.analysis.datasource.type = $scope.datasourceCurrent.type;
                        $scope.subform = $scope.types[$scope.datasourceCurrent.type];

                        //console.log("$scope.subform", $scope.subform);

                        timeReload();


                        if ($scope.types[$scope.datasourceCurrent.type].start) {
                            resetComponent();

                            $scope.types[$scope.datasourceCurrent.type].start(
                                    $scope.datasourceCurrent,
                                    $scope.component
                                    );
                        }
                    }
                }
            });

        }

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];


        //###############################################################################################



        $scope.submit = function () {

            //$scope.analysis.analysisColumns = $scope.component.columns;

            //caso o submit seja Sorl
            if ($scope.types.SOLR.name === $scope.datasourceCurrent.type) {
                console.log("$scope.analysis.query ", $scope.analysis.query);
                console.log("$scope.statement ", $scope.statement);
                var queryCopy = angular.copy($scope.analysis.query);


                AnalysisService.saveQueryBuilder(queryCopy).
                        success(function (data, status, headers, config) {
                            console.log("Query salva com sucesso");

                            $scope.analysis.query = {
                                "id": data.id
                            };

                            AnalysisService.save($scope.analysis).then(function () {
                            });

                        }).
                        error(function (data, status, headers, config) {

                        });


            } else {
                console.log("$scope.analysis ", $scope.analysis);
                console.log("$scope.types ", $scope.types.SOLR.name);
                AnalysisService.save($scope.analysis).then(function () {
                    
                     $location.path('presenter/analysis');
                });
            }
            

        };

    });
});
