/* global angular */
define([
    'connecta.portal'
], function (portal) {

    return portal.lazy.service('PublicDashboardService', function ($rootScope, portalResources, $http, applications, $filter, $cookieStore, LoginService) {

        // $cookieStore.put('portal.dashboard.validated', false);
        // $cookieStore.put('portal.dashboard.id', null);
        // $cookieStore.put('portal.dashboard.publickey', null);

        this.getPublic = function (id) {
            var url = portalResources.publicDashboard + '/' + id;
            return $http.get(url).then(function (response) {
                response.data.sections = $filter('orderBy')(response.data.sections, 'order');
                angular.forEach(response.data.sections, function (section) {
                    angular.forEach(section.items, function (item) {
                        var viewerPath = applications[item.module].host +
                                applications[item.module].publicViewerPath + getPublicKey(response.data);
                        item.viewerUrl = viewerPath.replace(/:id/g, item.viewer);
                        delete item.id;
                    });
                });
                $cookieStore.put('portal.dashboard.id', response.data.id);
                $cookieStore.put('portal.dashboard.publickey', response.data.publicDashboard.id);

                return response;
            });
        };

        getPublicKey = function(dashboard){
            if(dashboard !== undefined &&
                dashboard.public === true &&
                dashboard.publicDashboard !== undefined){
                $cookieStore.put('user.domain.name', dashboard.domain);
                return '?key=' + dashboard.publicDashboard.id + '&viewerId=:id';
            }
            return '';
        };

        $rootScope.$on('validatePublicDashboard', function(){
            $cookieStore.put('portal.dashboard.validated', true);
            LoginService.setAuthenticated(true);
        });

        $rootScope.$on('invalidatePublicDashboard', function(){
            $cookieStore.put('portal.dashboard.validated', false);
            LoginService.setAuthenticated(false);
        });

        this.isPublicDashboardValidated = function(){
            return LoginService.isAuthenticated() === false ? $cookieStore.get('portal.dashboard.validated') : undefined;
        };

        this.getDashboardId = function(){
            return LoginService.isAuthenticated() === false ? $cookieStore.get('portal.dashboard.id') : undefined;
        };

        this.getDashboardPublicKey = function(){
            return LoginService.isAuthenticated() === false ? $cookieStore.get('portal.dashboard.publickey') : undefined;
        };

    });

});
