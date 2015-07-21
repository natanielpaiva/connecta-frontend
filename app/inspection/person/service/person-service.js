define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('PersonService', function (inspectionResource, $http) {

        this.list = function (params) {
            var url = inspectionResource.person + "/list";
            return $http.get(url, {params: params});
        };
        
        this.save = function (person) {
            var url = inspectionResource.person;
            return $http.post(url, person);
        };
        
    });
});
