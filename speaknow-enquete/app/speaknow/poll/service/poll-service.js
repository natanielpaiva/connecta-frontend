define([
    'connecta.speaknow'
], function (speaknow) {

    var InternalPollService = function(speaknowResources, $http){
        this.speaknowResources = speaknowResources;
        this.http = $http;
    };

    InternalPollService.prototype.list = function(){
        var url = this.speaknowResources.poll;
        return this.http.get(url);
    };

    InternalPollService.prototype.save = function (poll, fileImage, removeImage) {
        var url = this.speaknowResources.poll + "/save";
        var formData = new FormData();
        formData.append('image', fileImage);
        formData.append('poll', new Blob([JSON.stringify(poll)], {
            type: 'application/json'
        }));
        return this.http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    InternalPollService.prototype.get = function(pollId){
        var url = this.speaknowResources.poll + '/' + pollId;
        return this.http.get(url);
    };

    InternalPollService.prototype.getByLink = function(link){
        var url = this.speaknowResources.poll + '/byLink';
        var config = {
            params: { "link": link }
        };
        return this.http.get(url, config);
    };

    InternalPollService.prototype.activate = function(pollId){
        var url = this.speaknowResources.poll + '/' + pollId + '/activate';
        return this.http.post(url);
    };

    InternalPollService.prototype.deactivate = function(pollId){
        var url = this.speaknowResources.poll + '/' + pollId + '/deactivate';
        return this.http.post(url);
    };

    InternalPollService.prototype.answers = function(pollId){
        var url = this.speaknowResources.poll + '/' + pollId + '/answers';
        return this.http.get(url);
    };

    return speaknow.lazy.service('PollService', function (speaknowResources, $http) {
        return new InternalPollService(speaknowResources, $http);
    });
});