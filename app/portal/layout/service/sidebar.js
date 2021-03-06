define([
    'connecta.portal',
    'portal/layout/service/layout'
], function (portal) {

    return portal.service('SidebarService', function ($rootScope, $cookieStore, LayoutService) {
        var SIDEBAR = 'connecta.portal.layout.sidebar.mini';
        var SidebarService = this;

        SidebarService.config = function (obj) {
            $rootScope.$broadcast('sidebar.config', obj);
            return SidebarService;
        };

        SidebarService.show = function (obj) {
            $rootScope.$broadcast('sidebar.show', obj);
            LayoutService.showSidebar(true);

            return SidebarService;
        };
        
        SidebarService.hide = function (obj) {
            SidebarService.config({
                controller: function () {
                }
            });

            $rootScope.$broadcast('sidebar.hide', obj);
            LayoutService.showSidebar(false);

            return SidebarService;
        };
        
        SidebarService.toggleMini = function(mini){
            $cookieStore.put(SIDEBAR, !mini);
            $rootScope.$broadcast('sidebar.mini', !mini);
        };
        
        SidebarService.isSidebarMini = function () {
            return $cookieStore.get(SIDEBAR);
        };
    });
});
