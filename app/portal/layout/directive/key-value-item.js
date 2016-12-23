define([
    'connecta.portal'
], function(portal){
    return portal.directive('keyValueItem', function(){
        return {
            restrict:'AE',
            templateUrl: "app/portal/layout/directive/template/key-value-item.html",
            require: "^keyValue",
            transclude: true
        };
    });
});