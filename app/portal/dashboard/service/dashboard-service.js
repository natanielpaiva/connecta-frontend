/* global angular */
define([
    'connecta.portal'
], function (portal) {

    return portal.lazy.service('DashboardService', function (portalResources, $http, Upload, 
                                                                DomainService, applications, $filter, $cookieStore) {

        this.save = function (dashboard) {
            var url = portalResources.dashboard;
            var method = 'post';

            if (angular.isString(dashboard.backgroundImage)) {
                dashboard.backgroundImage = {
                    base64: dashboard.backgroundImage
                };
            }

            angular.forEach(dashboard.sections, function (section) {
                angular.forEach(section.items, function (item) {
                    if (angular.isString(item.backgroundImage)) {
                        item.backgroundImage = {
                            base64: item.backgroundImage
                        };
                    }
                });
            });

            if (dashboard.id) {
                url += '/' + dashboard.id;
                method = 'put';
            }

            var dashboardCopy = angular.copy(dashboard);
            dashboardCopy.domain = DomainService.getDomainName();

            return $http[method](url, dashboardCopy);
        };

        this.list = function (params) {
            var url = portalResources.dashboard;
            return $http.get(url, {
                params: params
            });
        };

        this.remove = function (id) {
            var url = portalResources.dashboard + '/' + id;
            return $http.delete(url);
        };

        this.get = function (id) {
            var url = portalResources.dashboard + '/' + id;
            return $http.get(url).then(function (response) {
                response.data.sections = $filter('orderBy')(response.data.sections, 'order');
                angular.forEach(response.data.sections, function (section) {
                    angular.forEach(section.items, function (item) {
                        var viewerPath = applications[item.module].host +
                                applications[item.module].viewerPath;
                        item.viewerUrl = viewerPath.replace(':id', item.viewer);
                        delete item.id;
                    });
                });
                return response;
            });
        };

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
                return response;
            });
        };

        this.searchViewers = function (term) {
            var url = portalResources.dashboardViewers;
            return $http.get(url, {
                params: {
                    text: term
                }
            });
        };

        this.bulkRemove = function (dashboard) {
            return $http.delete(portalResources.dashboard, {
                data: dashboard.map(function (e) {
                    return e.id;
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        getPublicKey = function(dashboard){
            if(dashboard !== undefined &&
                dashboard.public === true &&
                dashboard.publicKey !== undefined){
                $cookieStore.put('portal.domain.name', dashboard.domain);
                return '?key=' + dashboard.publicKey + '&viewerId=:id';
            }
            return '';
        };

    });

});
