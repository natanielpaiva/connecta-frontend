define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerViewerGroupService', function (mapsResources, $http) {

        this.createStyle = function (formData) {

            var url = mapsResources.geo + "/createStyle";

            $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data) {

                //TODO notificação de sucesso
                console.info("Estilo criado com sucesso", data);
            }).error(function (data) {

                //TODO notificação de sucesso
                console.info("ERRO NA Criação do estilo", data);
            });

        };

        this.get = function (id) {
            var url = mapsResources.layerViewerGroup + "/" + id;
            return $http.get(url);
        };

        this.list = function () {
            var url = mapsResources.layerViewerGroup;
            return $http.get(url);
        };

        this.save = function (layerGroupSource) {
            return $http.post(mapsResources.layerViewerGroup, layerGroupSource);
        };

        this.delete = function (id) {
            var url = mapsResources.layerViewerGroup + '/' + id;
            return $http.delete(url);
        };

    });
});