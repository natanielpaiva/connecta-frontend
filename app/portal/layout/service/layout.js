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
        var MENU = 'connecta.portal.layout.menu';

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
            $cookieStore.put(MENU, !$cookieStore.get(MENU));
            broadcastEvent($cookieStore.get(MENU));
            return this;
        };

        /**
         * Informa se a barra lateral está aberta
         */
        this.isMenuVisible = function () {
            return $cookieStore.get(MENU);
        };

        this.showAsFlat = function (flat) {
            $rootScope.$broadcast('page.flat', flat);
            return this;
        };

        this.showSidebar = function (val) {
            $rootScope.$broadcast('sidebar.show', val);
            return this;
        };

        this.setFullscreen = function (fullscreen) {
            $rootScope.$broadcast('page.fullscreen', fullscreen);
            return this;
        };

    });
});
