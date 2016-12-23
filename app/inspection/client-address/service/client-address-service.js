define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ClientAddressService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.clientAddress + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = inspectionResource.clientAddress;
            return $http.get(url, {params: params});
        };
        
        this.save = function (clientAddress) {            
            var url = inspectionResource.clientAddress;            
            return $http.post(url, clientAddress);
        };
        
        this.delete = function(id){
            var url = inspectionResource.clientAddress + '/' + id;
            return $http.delete(url);
        };
        
    });
});
