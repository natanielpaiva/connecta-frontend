define([
    'graph/analysis/service/analysis-service'
], function () {
    return function SolrAnalysisFormController($scope, GroupService, AnalysisService, $timeout) {


        $scope.analysis.facet = 10;

        //$scope.types = GroupService.getTypes();
        $scope.queryBuilderTypes = GroupService.getTypes();
        //$scope.typeFilter = GroupService.getTypeFilter();
        $scope.queryBuilderTypeFilter = GroupService.getTypeFilter();

        AnalysisService.getConditionsSorl($scope.analysis.datasource.id).then(function (response) {
            $scope.analysis.conditionSorl = response.data;
        });

        $scope.requestTypes = AnalysisService.getSolrRequestTypes();

        $scope.predicateMap = GroupService.getPredicate();
        $scope.operatorMap = GroupService.getOperator();

        $scope.queryInit = function () {
            $scope.statement = {
                "type": "GROUP",
                "operator": "OR",
                "statements": []
            };
        };

        $scope.getAttributes = function (val) {
            return GroupService.getAttribute(val);
        };

        $scope.addGroup = function (stmt) {
            console.log("addGroup stmt: ", stmt);
            stmt.statements.push({
                type: 'GROUP',
                statements: []
            });
        };
        $scope.addCondition = function (stmt) {
            console.log("addCondition stmt: ", stmt);
            stmt.statements.push({
                type: 'CONDITION_SOLR'
            });
        };
        $scope.remove = function (parent, stmt) {
            parent.statements.splice(
                    parent.statements.indexOf(stmt),
                    1
                    );
        };

        $scope.getResultSolr = function () {
            $scope.analysis.requestType = "TEXT_QUERY";
            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.analysis.analysisColumns = [];
                console.log("response.data ", response.data);
                for (var formula in response.data[0]) {
                    $scope.analysis.analysisColumns.push({
                        name: formula,
                        label: formula,
                        formula: formula
                    });
                }
                $scope.responseSolr = response.data;
            });
        };

        $scope.getTabularFormartResultSolr = function () {
            $scope.analysis.requestType = "QUERY_BUILDER";
            $scope.analysis.analysisColumns = [];

            console.log("$scope.analysis", $scope.analysis);

            return AnalysisService.getSolrResultApplyingQuery(
                    $scope.analysis.datasource.id,
                    $scope.statement,
                    $scope.analysis.facet).then(function (response) {

                $scope.analysis.analysisColumns = [];
                console.log("response.data[0]", response.data[0]);

                for (var formula in response.data[0]) {
                    $scope.analysis.analysisColumns.push({
                        name: formula,
                        label: formula,
                        formula: formula
                    });
                }
                $scope.responseSolr = response.data;
                $scope.analysis.query = $scope.statement;
            });

            //Código funcionando
//            AnalysisService.execute({
//                analysis: $scope.analysis
//            }).then(function (response) {
//                $scope.responseSolr = response.data;
//                $scope.analysis.query = $scope.statement;
//
//                $scope.analysis.analysisColumns = [];
//                console.log("response.data[0]", response.data[0]);
//
//                for (var formula in response.data[0]) {
//                    $scope.analysis.analysisColumns.push({
//                        name: formula,
//                        label: formula,
//                        formula: formula
//                    });
//                }
//            });
        };

        if ($scope.edit) {
            console.log("anal", $scope.analysis);

            if ($scope.analysis.requestType === "QUERY_BUILDER") {
                GroupService.getQueryById($scope.analysis.query.id).
                        success(function (data, status, headers, config) {

                            var query = AnalysisService.formatQueryBuiderEdit(data);
                            $scope.statement = query.statement;

                            $scope.analysis.query = query.statement;

                            console.log("$scope.statement", $scope.statement);
                            $scope.predicateMap = GroupService.getPredicate();
                            $scope.operatorMap = GroupService.getOperator();

                            AnalysisService.execute({
                                analysis: $scope.analysis
                            }).then(function (response) {
                                $scope.responseSolr = response.data;
                                $scope.analysis.query = $scope.statement;
                            });
//                        return AnalysisService.getSolrResultApplyingQuery(
//                                $scope.analysis.datasource.id,
//                                $scope.statement,
//                                $scope.analysis.facet).then(function (response) {
//
//                            $scope.responseSolr = response.data;
//                            //$scope.responseSolr = response.data;
//
//                            $scope.analysis.query = $scope.statement;
//                            console.log($scope.analysis);
//                        });
                        }).
                        error(function (data, status, headers, config) {
                        });
            } else if ($scope.analysis.requestType === "TEXT_QUERY") {

                AnalysisService.execute({
                    analysis: $scope.analysis
                }).then(function (response) {
                    $scope.analysis.analysisColumns = [];
                    console.log("response.data ", response.data);
                    for (var formula in response.data[0]) {
                        $scope.analysis.analysisColumns.push({
                            name: formula,
                            label: formula,
                            formula: formula
                        });
                    }
                    $scope.responseSolr = response.data;
                });
            }


        } else {
            //new
            $scope.queryInit();

        }

    };
});
