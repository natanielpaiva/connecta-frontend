define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('SupplierService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.supplier + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = inspectionResource.supplier;
            return $http.get(url, {params: params});
        };
        
        this.save = function (supplier) {            
            var url = inspectionResource.supplier;            
            return $http.post(url, supplier);
        };
        
        this.delete = function(id){
            var url = inspectionResource.supplier + '/' + id;
            return $http.delete(url);
        };
        
    });
});
