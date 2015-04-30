define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('CompanyService', function (speaknowResources, $http, $upload) {

        this.list = function (params) {
            var url = speaknowResources.company + "/list";
            return $http.get(url, {params: params});
        };
        
        this.get = function (id) {
            var url = speaknowResources.company + '/get/' + id;
            return $http.get(url);
        };

        this.save = function (company) {
            var url = speaknowResources.company + "/save";
            return $http.post(url, company);
        };
        
        this.delete = function (id){
            var url = speaknowResources.company + "/" + id;
            return $http.delete(url);
        };

        this.getQuestionTypes = function () {
            var url = speaknowResources.interaction + "/poll/question/types";
            return $http.get(url);
        };
    });
});