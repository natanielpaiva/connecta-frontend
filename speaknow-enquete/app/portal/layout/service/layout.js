define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de gerenciamento do layout
     *
     * Aqui ficam as funcionalidades compartilhadas do layout
     *
     * @param {type} $rootScope
     * @param {type} $cookieStore
     * @returns {undefined}
     */
    return portal.service('LayoutService', function ($rootScope, $cookieStore) {
        var SIDEBAR = 'connecta.portal.layout.menu';

        var broadcastEvent = function (show) {
            var eventName = show ? 'menu.show' : 'menu.hide';
            $rootScope.$broadcast(eventName);
        };

        /**
         * Oculta e exibe a barra lateral (menu esquerdo)
         *
         * @returns {undefined}
         */
        this.toggleSidebar = function () {
            $cookieStore.put(SIDEBAR, !$cookieStore.get(SIDEBAR));
            broadcastEvent($cookieStore.get(SIDEBAR));
            return this;
        };

        /**
         * Informa se a barra lateral está aberta
         */
        this.isSidebarVisible = function () {
            return $cookieStore.get(SIDEBAR);
        };

        this.showAsFlat = function (flat) {
            $rootScope.$broadcast('page.flat', flat);
            return this;
        };

        this.showSidebarRight = function (val) {
            $rootScope.$broadcast('sidebarRight.show', val);
            return this;
        };

        this.setFullscreen = function (fullscreen) {
            $rootScope.$broadcast('page.fullscreen', fullscreen);
            return this;
        };

    });
});
