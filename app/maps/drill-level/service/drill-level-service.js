define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('DrillLevelService', function (mapsResources, $http) {

        
        this.get = function(id){
            var url = mapsResources.drillLevel + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = mapsResources.drillLevel;
            return $http.get(url, {params: params});
        };
        
        this.save = function (drillLevel) {            
            var url = mapsResources.drillLevel;            
            return $http.post(url, drillLevel);
        };
        
        this.delete = function(id){
            var url = mapsResources.drillLevel + '/' + id;
            return $http.delete(url);
        };
        
    });
});
