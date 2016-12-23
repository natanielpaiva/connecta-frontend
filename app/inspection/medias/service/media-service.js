define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('MediaService', function (inspectionResource, $http) {


        this.get = function (id) {
            var url = inspectionResource.document + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.document + "/medias";
            return $http.get(url, {params: params});
        };

        this.save = function (media, file) {
            var url = inspectionResource.document + "/save";
            var fd = new FormData();
            fd.append("file", file);
            fd.append('document', JSON.stringify(media));
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
