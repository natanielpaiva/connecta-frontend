define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ClientService', function (inspectionResource, $http) {

        this.get = function(id){
            var url = inspectionResource.client + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = inspectionResource.client;
            return $http.get(url, {params: params});
        };
        
        this.save = function (client) {            
            var url = inspectionResource.client;            
            return $http.post(url, client);
        };
        
        this.delete = function(id){
            var url = inspectionResource.client + '/' + id;
            return $http.delete(url);
        };
        
    });
});
