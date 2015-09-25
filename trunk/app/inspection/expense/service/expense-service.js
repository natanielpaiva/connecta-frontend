define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ExpenseService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.expense + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.expense;
            return $http.get(url, {params: params});
        };
        
        this.save = function (expense) {
            var url = inspectionResource.expense;
            return $http.post(url, expense);
        };
        
        this.delete = function(id){
            var url = inspectionResource.expense + '/' + id;
            return $http.delete(url);
        };
        
    });
});