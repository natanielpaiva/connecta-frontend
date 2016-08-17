define([
    'connecta.portal'
], function (portal) {

    return portal.directive('bulkAction', function () {
        return {
            restrict: 'E',
            scope:{
                icon:'@',
                title:'@'
            },
            templateUrl: 'app/portal/layout/directive/template/bulk-action.html'
//            link:function(scope, element, attributes){
//                scope.action = {
//                    icon:attributes.icon,
//                    title:attributes.title
//                };
//            }
        };
    });
});
