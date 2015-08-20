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

        this.save = function (interaction, fileImage) {
            var url = speaknowResources.interaction + "/save";
            var fd = new FormData();
            fd.append('image', fileImage);
            fd.append('interaction', JSON.stringify(interaction));
            return $http.post(url, fd, {
                headers: {'Content-Type': undefined}
            });
        };

        this.delete = function (id){
            var url = speaknowResources.interaction + "/" + id;
            return $http.delete(url);
        };

    });
});
