define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('CompanyMessageService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.companyMessage + "/list";
            return $http.get(url, {params: params});
        };

        this.get = function(id){
            var url = speaknowResources.companyMessage + "/" + id;
            return $http.get(url);
        };

        this.save = function (companyMessage) {
            var url = speaknowResources.companyMessage;
            return $http.post(url, companyMessage);
        };
    });
});