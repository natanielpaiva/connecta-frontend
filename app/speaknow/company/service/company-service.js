define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('CompanyService', function (speaknowResources, $http, $upload) {

        this.list = function (params) {
            var url = speaknowResources.company + "/list";
            return $http.get(url, {params: params});
        };
        
        this.get = function (id) {
            var url = speaknowResources.company + '/' + id;
            return $http.get(url);
        };

//        this.save = function (fileQuad, fileRect, company) {
//            var url = speaknowResources.company + "/save";
//            var fd = new FormData();
//            fd.append('fileQuad', fileQuad);
//            fd.append('fileRect', fileRect);
//            fd.append('company', JSON.stringify(company));
//            return $http.post(url, fd, {
//                transformRequest: angular.identity,
//                headers: {'Content-Type': undefined}
//            });
//        };
        
        this.save = function (company) {
            var url = speaknowResources.company + "/saveTest";
            return $http.post(url, company);
        };

        this.getQuestionTypes = function () {
            var url = speaknowResources.interaction + "/poll/question/types";
            return $http.get(url);
        };
    });
});