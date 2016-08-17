define([
    'connecta.maps'
], function (maps) {
    return maps.directive('boxTableMaps', function () {
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
            templateUrl: 'app/maps/drill/directive/template/box-table-maps.html'
        };
    });
});