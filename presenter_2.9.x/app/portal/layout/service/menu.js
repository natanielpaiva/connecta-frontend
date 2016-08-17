/* global angular */
define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de gerenciamento do menu
     *
     * @param {type} $rootScope
     * @param {type} $route
     * @returns {undefined}
     */
    return portal.service('$menu', function ($rootScope, $route) {
        this.set = function (menu) {
            $rootScope.$broadcast('menu.change', menu);
        };

        this.update = function () {
            this.set(this.getCurrent());
        };

        this.getCurrent = function () {
            if ($route.current && $route.current.$$route && $route.current.$$route.module) {
                return angular.module($route.current.$$route.module)._menu;
            } else {
                console.log('ROTA ATUAL INEXISTENTE');
            }
        };
    });
});

