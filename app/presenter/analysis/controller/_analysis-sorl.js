define([
    'presenter/group/service/group-service',
    'presenter/analysis/service/analysis-service'
], function () {
    return function SolrAnalysisFormController($scope, GroupService, AnalysisService, $timeout) {

        
        $scope.analysis.facet = 10;

        //$scope.types = GroupService.getTypes();
        $scope.queryBuilderTypes = GroupService.getTypes();
        //$scope.typeFilter = GroupService.getTypeFilter();
        $scope.queryBuilderTypeFilter = GroupService.getTypeFilter();
        $scope.group = {};

        
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

        $scope.getTabularFormartResultSolr = function () {
            return AnalysisService.getSolrResultApplyingQuery(
                    $scope.analysis.datasource.id,
                    $scope.statement,
                    $scope.analysis.facet).then(function (response) {

                $scope.responseSolr = response.data;
                $scope.analysis.query = $scope.statement;
            });
        };

        if ($scope.edit) {
            GroupService.getQueryById($scope.analysis.query.id).
                    success(function (data, status, headers, config) {

                        var query = AnalysisService.formatQueryBuiderEdit(data);
                        $scope.statement = query.statement;

                        $scope.analysis.query = query.statement;

                        console.log("$scope.statement", $scope.statement);
                        $scope.predicateMap = GroupService.getPredicate();
                        $scope.operatorMap = GroupService.getOperator();
                        //$scope.getResultQueryBuider($scope.query);

                        return AnalysisService.getSolrResultApplyingQuery(
                                $scope.analysis.datasource.id,
                                $scope.statement,
                                $scope.analysis.facet).then(function (response) {

                            $scope.responseSolr = response.data;
                            //$scope.responseSolr = response.data;

                            $scope.analysis.query = $scope.statement;
                            console.log($scope.analysis);
                        });

                    }).
                    error(function (data, status, headers, config) {

                    });

        } else {
            //new

            $scope.queryInit();

            return AnalysisService.getColumnsSorl($scope.analysis.datasource.id).then(function (response) {
                $scope.analysis.analysisColumns = response.data;
            });
        }

    };
});
