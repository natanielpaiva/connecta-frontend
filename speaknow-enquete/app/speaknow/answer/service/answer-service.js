define([
    'connecta.speaknow',
    'portal/layout/service/notify',
], function (speaknow) {

    var InternalAnswerService = function(speaknowResources, $http){
        this.speaknowResources = speaknowResources;
        this.http = $http;
    };

    InternalAnswerService.prototype.search = function(poll){
        var url = this.speaknowResources.search;
        var config = {
            params: { "link": poll}
        };
        return this.http.get(url, config);
    };

    InternalAnswerService.prototype.save = function(answers){
        var url = this.speaknowResources.answers;
        return this.http.post(url, answers);
    };

    return speaknow.lazy.service('AnswerService', function (speaknowResources, $http) {
        var internalService = new InternalAnswerService(speaknowResources, $http);
        return internalService;
    });
});