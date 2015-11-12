define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('ContactService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.contact + "/list";
            return $http.get(url, {params: params});
        };
        
        this.save = function(contact){
            var url = speaknowResources.contact;
            return $http.post(url, contact);
        };
        
        this.delete = function (id){
            var url = speaknowResources.contact + "/" + id;
            return $http.delete(url);
        };
        
        this.get = function (id) {
            var url = speaknowResources.contact + "/" + id;
            return $http.get(url);
        };
        
        this.readOnly = function(id){
            var url = speaknowResources.contact + "/readOnly/" + id;
            return $http.get(url);
        };
        
    });
});