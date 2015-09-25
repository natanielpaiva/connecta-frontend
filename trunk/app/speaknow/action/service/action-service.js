define([
    'connecta.speaknow',
    'portal/layout/service/autocomplete'
], function (speaknow) {
    return speaknow.lazy.service('ActionService', function (speaknowResources, $http, $autocomplete) {

        var _interaction = null;

        this.setInteraction = function (interaction) {
            _interaction = interaction;
        };

        this.getInteraction = function () {
            return _interaction;
        };

        this.clearInteraction = function () {
            _interaction = null;
        };

        this.get = function (id) {
            var url = speaknowResources.action + "/" + id;
            return $http.get(url);
        };

        this.listDefaultAccounts = function (params) {
            var url = speaknowResources.action + "/list-default";
            return $http.get(url, {params: params});
        };

        this.setDefault = function (actionID) {
            var url = speaknowResources.action + "/" + actionID + "/set-default";
            return $http.post(url);
        };

        this.getActionTypes = function () {
            var url = speaknowResources.action + "/type";
            return $http.get(url);
        };

        this.getActionAnswers = function (actionId) {
            var url = speaknowResources.action + "/" + actionId + '/answers';
            return $http.get(url);
        };

        this.getParamTypes = function () {
            var url = speaknowResources.action + "/paramType";
            return $http.get(url);
        };

        this.getParamTypes = function () {
            var url = speaknowResources.action + "/paramType";
            return $http.get(url);
        };

        this.getIcons = function () {
            var url = "assets/fonts/speaknow/selection.json";
            return $http.get(url);
        };

        this.save = function (action) {
            return $http.post(speaknowResources.action, action);
        };

        this.delete = function (id) {
            var url = speaknowResources.action + '/' + id;
            return $http.delete(url);
        };

        this.getContacts = function (val) {
            return $autocomplete(speaknowResources.contact + "/find", {
                name: val
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        this.delete = function (id) {
            var url = speaknowResources.action + "/" + id;
            return $http.delete(url);
        };

        this.sendMessage = function (id) {
            return $http.post(speaknowResources.whatsapp + "/sendMessage", id);
        };

        this.containsAnswer = function (actionId) {
            var url = speaknowResources.action + "/" + actionId + "/answers";
            return $http.get(url);
        };
        
        this.readOnly = function(id){
            var url = speaknowResources.action + "/readOnly/" + id;
            return $http.get(url);
        };
    });
});