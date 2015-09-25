define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('ContactGroupService', function (speaknowResources, $http, $upload) {
        
        var _company = null;
        
        this.setCompany = function (company){
            _company = company;
        };
        
        this.getCompany = function (){return _company;};
        
        this.clearCompany = function (){
            _company = null;
        };

        this.get = function (id) {
            var url = speaknowResources.contactGroup + '/' + id;
            return $http.get(url);
        };

        this.save = function (company) {
            var url = speaknowResources.contactGroup;
            return $http.post(url, company);
        };
        
        this.delete = function (id) {
            var url = speaknowResources.contactGroup + '/' + id;
            return $http.delete(url);
        };
        
        this.readOnly = function(id){
            var url = speaknowResources.contactGroup + "/readOnly/" + id;
            return $http.get(url);
        };
        
    });
});