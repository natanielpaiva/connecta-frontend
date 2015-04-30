define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service'
], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function ($scope, AnalysisService, $log) {

        var datasourceCurrent = null;

        //preenche o combo de datasource
        AnalysisService.getListDatasource().then(function (response) {
            $scope.listDatasource = response.data;
        });

        function resetComponent() {
            if (!$scope.component) {
                $scope.component = {};
            }
            $scope.component.catalog = [];
            $scope.component.columns = [];
            $scope.component.domain = [];
        }
        resetComponent();

        // $scope.$watch('component.catalog', $log.debug);
        // $scope.$watch('component.column', $log.debug);

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        $scope.attributes = [{params: null, value: "", type: ''}];



        $scope.addMethodAttribute = function () {
            var attr = angular.copy($scope.attribute);

            $scope.attributes.push(attr);
        };

        $scope.removeMethodAttribute = function (attribute) {
            $scope.attributes.splice($scope.attribute.indexOf(attribute), 1);
        };


        //################gerando o tipo de template#####################
        $scope.types = AnalysisService.getTypes();

        $scope.$watch('analysis.datasource.id', function (idDatasouce) {
            for (var ds  in $scope.listDatasource) {

                if (idDatasouce === $scope.listDatasource[ds].id.toString()) {

                    datasourceCurrent = $scope.listDatasource[ds];

                    //Monta o template de acordo com o datasource
                    $scope.analysis.type = $scope.types[datasourceCurrent.type];

                    if ($scope.types[datasourceCurrent.type].hasOwnProperty("start")) {
                        resetComponent();
                        $scope.types[datasourceCurrent.type].start(
                                datasourceCurrent.id,
                                $scope.component
                                );
                    }
                }
            }
        });

        //################Banco de Dados#####################
        $scope.databaseForm = {
            selectSourceOfdata: null,
            selectedTable: null,
            test: null
        };

        $scope.listTableDatasource = [
            {name: "table", label: 'Table'},
            {name: "sql", label: 'SQL'}
        ];

        $scope.sourceOfdata = [
            {value: "table", name: 'Table'},
            {value: "sql", name: 'SQL'}
        ];

        //assistindo a mudança do select "Origem dos Dados"
        $scope.$watch('databaseForm.selectSourceOfdata', function (newValue) {
            if (newValue === "table") {
                var idDataSource = $scope.analysis.datasource.id;
                AnalysisService.getListTableDatasource(idDataSource).then(function (response) {
                    //preenche o select de tabelas do banco de dados
                    $scope.listTableDatasource = response.data;
                });
            }
        });

        $scope.$watch('databaseForm.selectedTable', function (tabela) {
            if (tabela !== null) {
                //tipo todas as colunas
                $scope.component.columns = [];
                for (var tb in tabela.columns) {
                    $scope.component.columns.push({
                        name: tabela.columns[tb].name,
                        label: tabela.columns[tb].name,
                        formula: tabela.tableName + "." + tabela.columns[tb].name
                    });
                }
            }
        });

        //################CSV#####################
        $scope.separator = [
            {value: ".", name: '.'},
            {value: ";", name: ';'}
        ];

        $scope.csvType = [
            {value: "fileCsv", name: 'Arquivo CSV'},
            {value: "text", name: 'Texto'}
        ];

        //################Endeca###################
        $scope.$watch('analysis.domain', function (domain) {
            if ($scope.component.domain !== null && domain !== undefined) {
                return AnalysisService.getListColumnsEndeca(datasourceCurrent.id, domain).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        });

       //################HDFS#####################
        $scope.typeQuery = [
            {value: "hiveQL", name: "HiveQL"},
            {value: "pigQuery", name: "PigQuery"}
        ];

        //################Obiee#####################
        $scope.getCatalog = function (scope, item) {
            scope.toggle();
            var IdDatosource = $scope.analysis.datasource.id;

            //muda o icon para uma pasta aberta
            scope.$modelValue.icon = "glyphicon glyphicon-folder-open";

            //caso seja uma pasta
            if (item.type === "folder") {
                return AnalysisService.getListCatologBiee(IdDatosource, item.path).then(function (response) {
                    item.items = response.data;

                    for (var it in item.items) {

                        if (item.items[it].type === "folder") {
                            item.items[it].icon = "glyphicon glyphicon-folder-close";
                        }
                        if (item.items[it].type === "object") {
                            item.items[it].icon = "glyphicon glyphicon-signal";
                        }
                    }
                });
            } else if (item.type === "object") {
                return AnalysisService.getListColumnsObiee(IdDatosource, item.path).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        };

        $scope.submit = function () {

            $scope.analysis.analysisColumns = $scope.component.columns;
            //console.log(analysisColumns);
            AnalysisService.save($scope.analysis).then(function () {
            });
        };
    });
});
