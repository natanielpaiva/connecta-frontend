/* global angular */
define([
    'connecta.portal'
], function (portal) {

    return portal.lazy.service('DashboardService', function (portalResources, $http, $upload, DomainService) {

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
            return $http.get(url);
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

    });

});
