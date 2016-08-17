define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('InteractionService', function (speaknowResources, $http) {

        this.list = function () {
            var url = speaknowResources.interaction;
            return $http.get(url);
        };
        
        this.save = function(interaction){
            var url = speaknowResources.interaction;
            return $http.post(url, interaction);
        };
        
        this.getQuestionTypes = function(){
            var url = speaknowResources.interaction + "/poll/question/types";
            return $http.get(url);
        };
        
    });
});