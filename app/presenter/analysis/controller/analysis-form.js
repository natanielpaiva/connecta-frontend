define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/datasource/service/datasource-service',
    'presenter/singlesource/service/singlesource-service'

], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function (
            $scope, AnalysisService, DatasourceService, SingleSourceService,GroupService, $timeout, $routeParams, $location) {

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

                timeReload();
                // $scope.listTableDatasource = response.data;
            });
        } else {
            $scope.analysis = {};
            DatasourceService.list({count: 1000, page: 1}).then(function (response) {
                $scope.listDatasource = response.data.content;
            });

            $scope.$watch('analysis.datasource.id', function (idDatasouce) {
                $scope.showForm = false;
                for (var ds  in $scope.listDatasource) {
                    if (idDatasouce === $scope.listDatasource[ds].id.toString()  ) {

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
                
                if(idDatasouce === $scope.types.CSV.id){
                    var csv = $scope.types.CSV;

                    $scope.subform = csv;
                    $scope.analysis.type = csv.name;

                    $scope.analysis.datasource = null;

                    $scope.datasourceCurrent = {
                        type: 'csv'
                    };
                }

                $scope.analysis.analysisAttributes = [];

                timeReload();
            });
        }

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        //###############################################################################################

        $scope.submit = function () {
            //caso o submit seja Solr
            if ($scope.types.SOLR.name === $scope.datasourceCurrent.type) {

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
