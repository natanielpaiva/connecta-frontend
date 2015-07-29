define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ProjectService', function (inspectionResource, $http) {

        this.get = function (id) {
            var url = inspectionResource.project + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.project;
            return $http.get(url, {params: params});
        };

        this.save = function (project) {
            var url = inspectionResource.project;
            return $http.post(url, project);
        };

        this.delete = function (id) {
            var url = inspectionResource.project + '/' + id;
            return $http.delete(url);
        };

    });
});
