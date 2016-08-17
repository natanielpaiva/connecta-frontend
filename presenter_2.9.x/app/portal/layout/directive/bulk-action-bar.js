define([
    'connecta.portal',
    'portal/layout/directive/bulk-action'
], function (portal) {

    return portal.directive('bulkActionBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/bulk-action-bar.html',
            transclude:true,
            link:function(){}
        };
    });
});
