define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('DrillLevelService', function (drillResource, $http) {

        
        this.get = function(id){
            var url = drillResource.drillLevel + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = drillResource.drillLevel;
            return $http.get(url, {params: params});
        };
        
        this.save = function (drillLevel) {            
            var url = drillResource.drillLevel;            
            return $http.post(url, drillLevel);
        };
        
        this.delete = function(id){
            var url = drillResource.drillLevel + '/' + id;
            return $http.delete(url);
        };
        
    });
});
