define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('InspectionService', function (inspectionResource, $http) {

        this.list = function (params) {
            var url = inspectionResource.inspection + "/list";
            return $http.get(url, {params: params});
        };
        
    });
});
