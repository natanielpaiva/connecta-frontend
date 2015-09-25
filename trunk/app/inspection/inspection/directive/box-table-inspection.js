define([
    'connecta.inspection'
], function (inspection) {
    return inspection.directive('boxTableInspection', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: { 
                title:'@'
            },
            controller: function ($scope, $translate) {
                $translate($scope.title).then(function (text) {
                    $scope.title = text;
                });
            },
            templateUrl: 'app/inspection/inspection/directive/template/box-table-inspection.html'
        };
    });
});