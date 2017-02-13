define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('CompanyContactService', function (speaknowResources, $http, Upload) {

        var _contactGroup = null;
        
        this.setContactGroup = function (contactGroup){
            _contactGroup = contactGroup;
        };
        
        this.getContactGroup = function (){return _contactGroup;};
        
        this.clearContactGroup = function (){
            _contactGroup = null;
        };

        this.get = function (id) {
            var url = speaknowResources.companyContact + '/' + id;
            return $http.get(url);
        };

        this.save = function (company) {
            var url = speaknowResources.companyContact;
            return $http.post(url, company);
        };
        
        this.delete = function (id) {
            var url = speaknowResources.companyContact + '/' + id;
            return $http.delete(url);
        };
    });
});