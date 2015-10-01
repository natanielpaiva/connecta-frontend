define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('InstrumentService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.instrument + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = inspectionResource.instrument;
            return $http.get(url, {params: params});
        };
        
        this.save = function (instrument) {            
            var url = inspectionResource.instrument;            
            return $http.post(url, instrument);
        };
        
        this.delete = function(id){
            var url = inspectionResource.instrument + '/' + id;
            return $http.delete(url);
        };
        
    });
});