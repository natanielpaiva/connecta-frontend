define([
    'connecta.maps'
], function (inspection) {
    return inspection.lazy.service('DrillService', function (drillResource, $http) {

        
        this.get = function(id){
            var url = drillResource.drill + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = drillResource.drill;
            return $http.get(url, {params: params});
        };
        
        this.save = function (drill) {            
            var url = drillResource.drill;            
            return $http.post(url, drill);
        };
        
        this.delete = function(id){
            var url = drillResource.drill + '/' + id;
            return $http.delete(url);
        };
        
    });
});
