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
        
        this.save = function (project, image) {
            var url = inspectionResource.project + "/save";
            var fd = new FormData();
            for(var index in image){
                fd.append("files", image[index]);
            }
            fd.append('project', JSON.stringify(project));
            return $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        this.delete = function (id) {
            var url = inspectionResource.project + '/' + id;
            return $http.delete(url);
        };

    });
});
