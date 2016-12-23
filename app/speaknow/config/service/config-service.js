define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('ConfigService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.config + "/list";
            return $http.get(url);
        };
        
        this.save = function(configs){
            var url = speaknowResources.config + "/save/all";
            return $http.post(url, configs);
        };
        
        this.get = function (id) {
            var url = speaknowResources.config + "/" + id;
            return $http.get(url);
        };
        
    });
});