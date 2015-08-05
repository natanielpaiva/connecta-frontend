define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ClientService', function (inspectionResource, $http) {

        this.get = function (id) {
            var url = inspectionResource.client + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.client;
            return $http.get(url, {params: params});
        };

        this.save = function (client) {
            var url = inspectionResource.client;
            return $http.post(url, client);
        };

        this.delete = function (id) {
            var url = inspectionResource.client + '/' + id;
            return $http.delete(url);
        };

        this.getRoading = function () {
            var url = inspectionResource.client + '/types/roading';
            return $http.get(url);
        };
        
        this.getFeeding = function () {
            var url = inspectionResource.client + '/types/feeding';
            return $http.get(url);
        };
        
        this.getLodging = function () {
            var url = inspectionResource.client + '/types/lodging';
            return $http.get(url);
        };
        
        this.getAerialTransport = function () {
            var url = inspectionResource.client + '/types/aerialtransport';
            return $http.get(url);
        };

    });
});
