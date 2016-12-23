define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('SupplierAddressService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.supplierAddress + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = inspectionResource.supplierAddress;
            return $http.get(url, {params: params});
        };
        
        this.save = function (supplierAddress) {            
            var url = inspectionResource.supplierAddress;            
            return $http.post(url, supplierAddress);
        };
        
        this.delete = function(id){
            var url = inspectionResource.supplierAddress + '/' + id;
            return $http.delete(url);
        };
        
    });
});
