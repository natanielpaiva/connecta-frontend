define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('DocumentService', function (inspectionResource, $http) {


        this.get = function (id) {
            var url = inspectionResource.document + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.document + "/list";
            return $http.get(url, {params: params});
        };

        this.save = function (document, file) {
            var url = inspectionResource.document + "/save";
            var fd = new FormData();
            fd.append("file", file);
            fd.append('document', JSON.stringify(document));
            return $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        this.delete = function (id) {
            var url = inspectionResource.document + '/' + id;
            return $http.delete(url);
        };

    });
});
