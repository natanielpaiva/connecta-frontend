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
    return portal.service('layoutService', function ($rootScope, $cookieStore) {
        var SIDEBAR = 'connecta.portal.layout.menu';
        
        var isShowPageTabs = false;
        
        var broadcastEvent = function(show){
            var eventName = show ? 'menu.show' : 'menu.hide';
            
            $rootScope.$broadcast(eventName);
        };
        
        /**
         * Oculta e exibe a barra lateral (menu esquerdo)
         *
         * @returns {undefined}
         */
        this.toggleSidebar = function () {
            $cookieStore.put( SIDEBAR, !$cookieStore.get(SIDEBAR) );
            broadcastEvent($cookieStore.get(SIDEBAR));
        };
        /**
         * Oculta e exibe a lista de páginas abertas
         *
         * @returns {undefined}
         */
        this.togglePageTabs = function () {
            isShowPageTabs = !isShowPageTabs;
            if (isShowPageTabs) {
                $rootScope.$broadcast('page.showTabs');
            } else {
                $rootScope.$broadcast('page.hideTabs');
            }
        };
        
        /**
         * Informa se a barra lateral está aberta
         */
        this.isSidebarVisible = function(){
            return $cookieStore.get(SIDEBAR);
        };
    });
});

