define([
    'connecta.portal'
], function(portal) {
    /**
     * Componente usado para renderizar e manter o menu
     * @param {type} applicationsService
     */
    return portal.directive('debug', function() {
        return {
            template: '<pre>{{model | json}}</pre>',
            require:'ngModel',
            scope: {
                model:'=ngModel'
            }
        };
    });
});
