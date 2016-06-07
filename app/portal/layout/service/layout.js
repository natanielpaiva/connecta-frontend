/* global angular */
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
     * @param {type} $menu
     * @param {type} applications
     * @returns {undefined}
     */
    return portal.service('LayoutService', function ($rootScope, $cookieStore, $menu, applications) {
        var layout = this;
        var MENU = 'connecta.portal.layout.menu';

        /**
         * Oculta e exibe a barra lateral (menu esquerdo)
         *
         * @returns {undefined}
         */
        this.toggleSidebar = function () {
            $cookieStore.put(MENU, !$cookieStore.get(MENU));
            $rootScope.$broadcast('menu.mini', $cookieStore.get(MENU));
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

        this.launchBrowserFullscreen = function (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        };
        
        this.exitFullscreen = function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        };

        this.toggleBrowserFullscreen = function () {
            var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

            if (fullscreenEnabled) { // Browser tem suporte para Fullscreen
                var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

                if (fullscreenElement) { // Fullscreen ativado, sair
                    layout.exitFullscreen();
                } else {    // Fullscreen desativado, ativar
                    layout.launchBrowserFullscreen(document.documentElement); // a página toda
                }
            }
        };

        this.moduleChanged = function (originModule, $originRoute, destModule, $destRoute) {
            $menu.update();

            var configObject = null;
            if (angular.module(destModule) &&
                    angular.module(destModule)._configKey &&
                    applications[angular.module(destModule)._configKey]) {

                configObject = applications[angular.module(destModule)._configKey];
            }

            $rootScope.$broadcast('layout.modulechange', {
                angularModule: destModule,
                route: $destRoute,
                config: configObject
            });

            $rootScope.$broadcast(destModule + '.enter', $destRoute);

            if (originModule) {
                $rootScope.$broadcast(originModule + '.leave', $originRoute);
            }
        };
    });
});
