define([
  'connecta.portal'
], function(portal) {

  return portal.lazy.service('DashboardService', function(portalResources, $http) {

    this.save = function(dashboard) {
      var dashboardCopy = angular.copy(dashboard);

      var url = portalResources.dashboard;

      if (dashboardCopy.id) {
        url += '/' + dashboardCopy.id;
        return $http.put(url, dashboardCopy);
      } else {
        return $http.post(url, dashboardCopy);
      }
    };

    this.list = function(params) {
      var url = portalResources.dashboard;
      return $http.get(url, {
        params: params
      });
    };

    this.remove = function(id) {
      var url = portalResources.dashboard + '/' + id;
      return $http.delete(url);
    };

    this.get = function(id) {
      var url = portalResources.dashboard + '/' + id;
      return $http.get(url);
    };
    
    this.searchViewers = function(term){
      var url = portalResources.dashboardViewers;
      return $http.get(url, {
        params: {
          text: term
        }
      });
    };

  });

});
