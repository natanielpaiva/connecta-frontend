define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('InteractionService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.interaction + "/list";
            return $http.get(url, {params: params});
        };
        
        this.get = function(id){
            var url = speaknowResources.interaction +"/"+ id;
            return $http.get(url);
        };

        this.save = function (interaction) {
            var url = speaknowResources.interaction;
            return $http.post(url, interaction);
        };

        this.delete = function (id){
            var url = speaknowResources.interaction + "/" + id;
            return $http.delete(url);
        };

    });
});
