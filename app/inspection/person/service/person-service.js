define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('PersonService', function (inspectionResource, $http) {

        
        this.get = function(id){
            var url = inspectionResource.person + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.person;
            return $http.get(url, {params: params});
        };
        
        this.save = function (person) {
            var url = inspectionResource.person;
            return $http.post(url, person);
        };
        
        this.delete = function(id){
            var url = inspectionResource.person + '/' + id;
            return $http.delete(url);
        };
        
    });
});
