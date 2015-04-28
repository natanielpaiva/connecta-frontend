/**
 * Controller de busca e gerenciamento de itens (crud)
 */
define([
    'connecta.portal',
    'portal/layout/directive/search-result'
], function(portal) {
    return portal.controller('AppSearchController', function($scope, $timeout) {
        $scope.page.title = 'Search';
        $scope.page.subTitle = 'dd';

        $scope.results = [];
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.searchTxt = '';
        $scope.advancedParams = [];

        $scope.addSearchParam = function(param, title, operator, value) {
            var newParam = {
                param: param,
                title: title,
                operator: operator,
                operatorName: 'entre',
                value: value
            };
            $scope.advancedParams.push(newParam);
        };

        var searchTextParameters = [];

        function doSearch() {

            //Gera a expressao da busca
            var expression = new SearchExpression();
            expression.addGroup('or');
            if (searchTextParameters.length > 0) {
                if ($scope.searchTxt !== '') {
                    for (var a in searchTextParameters) {
                        expression.addValue(searchTextParameters[a], 'lk:%' + $scope.searchTxt + '%');
                    }
                }
            }

            var searchPromise = $scope.search.doSearch({
                exp: expression.getExpression()
            });

            searchPromise.then(function(results) {
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.totalItems = results.count;
                        $scope.results = results.data;
                    });
                }, 0);
            });
        }

        // input de busca por texto, se houver
        $scope.doSearch = function() {
            doSearch();
            return false;
        };

        doSearch();
    });
});