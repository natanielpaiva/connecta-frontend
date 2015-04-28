define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('ContactService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.contact;
            return $http.get(url, {params: params});
        };
        
        this.save = function(contact){
            var url = speaknowResources.contact;
            return $http.post(url, contact);
        };
        
    });
});