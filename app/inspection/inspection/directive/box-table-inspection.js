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
            templateUrl: 'app/inspection/inspection/directive/template/box-table-inspection.html'
        };
    });
});