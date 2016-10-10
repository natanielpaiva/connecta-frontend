/* global angular */
define([
    'connecta.portal'
], function (portal) {

    return portal.service('PublicDashboardService', function ($rootScope, portalResources, $http, applications, $filter, $cookieStore, LoginService) {

        var dashboardValidated;
        var dashboardId;
        var dashboardPublicKey;

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
                dashboardId = response.data.id;
                dashboardPublicKey = response.data.publicDashboard.id;

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
            dashboardValidated = true;
            LoginService.setAuthenticated(true);
        });

        $rootScope.$on('invalidatePublicDashboard', function(){
            dashboardValidated = false;
            LoginService.setAuthenticated(false);
        });

        this.isPublicDashboardValidated = function(){
            return LoginService.isAuthenticated() === false ? dashboardValidated : undefined;
        };

        this.getDashboardId = function(){
            return LoginService.isAuthenticated() === false ? dashboardId : undefined;
        };

        this.getDashboardPublicKey = function(){
            return LoginService.isAuthenticated() === false ? dashboardPublicKey : undefined;
        };

    });

});
