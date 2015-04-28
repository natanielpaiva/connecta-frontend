define([
    'connecta.speaknow'
], function (presenter) {
    return presenter.lazy.service('CompanyContactService', function (speaknowResources, $http, $upload) {

        this.get = function (id) {
            var url = speaknowResources.companyContact + '/' + id;
            return $http.get(url);
        };

        this.save = function (company) {
            var url = speaknowResources.companyContact;
            return $http.post(url, company);
        };
    });
});