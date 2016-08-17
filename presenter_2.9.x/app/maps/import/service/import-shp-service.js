define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('ImportSHPService', function (mapsResources, $http) {

        this.importSHP = function (formData) {

            var url = mapsResources.geo + "/importSHP";

            $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                //TODO notificação de sucesso
                console.info("IMPORTAÇÂO REALIZADA COM SUCESSO", data);
            }).error(function(data){
                //TODO notificação de sucesso
                console.info("ERRO NA IMPORTAÇÂO", data);
            });

        };


    });
});