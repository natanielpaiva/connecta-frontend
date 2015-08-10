define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de gerenciamento do menu
     * 
     * @param {type} $rootScope
     * @param {type} $timeout
     * @returns {undefined}
     */
    return portal.service('$menu', function ($rootScope, $timeout) {
        this.set = function (menu) {
            $rootScope.$broadcast('menu.change', menu);
        };
    });
});

