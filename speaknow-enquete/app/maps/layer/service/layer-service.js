define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerService', function (mapsResources, $http) {
        this.get = function (id) {
            var url = mapsResources.layer + "/" + id;
            return $http.get(url);
        };

        this.getByType = function (type) {
            var url = mapsResources.layer + "/listByType?type=" + type;
            return $http.get(url);
        };

        this.getLayersBySource = function (sourceType, scope) {
            var url = mapsResources.geo + "/getLayers";

            $http({
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {data: JSON.stringify({idLayerSource: sourceType})}
            }).success(function (data) {
                scope.layers = JSON.parse(data);
                return data;
            });
        };

        this.getLayerColumns = function (serverUrl, layerName,scope) {
            var request = $http.get(mapsResources.openlayersProxy.replace("?","") + "?" + serverUrl + "/wfs?version=1.1.0&request=DescribeFeatureType&typeName=" + layerName + "&outputFormat=application/json");
            scope.layerCOLUMNS = '';


            request.then(function (response) {
                if (typeof response.data.featureTypes == 'undefined') {
                    return false;
                }

                for (var property in response.data.featureTypes[0].properties) {
                    scope.layerCOLUMNS += response.data.featureTypes[0].properties[property].name;
                    if (property < response.data.featureTypes[0].properties.length - 1) {
                        scope.layerCOLUMNS += '#';
                    }
                }

            });

        };

        this.getLayerGeometryType = function (serverUrl, layerName,scope) {
            //http://192.168.2.10:9704/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=estados_mira&maxFeatures=1&outputFormat=application/json
            var request = $http.get(mapsResources.openlayersProxy.replace("?","") + "?" + serverUrl + "/wfs?version=1.1.0&request=GetFeature&typeName=" + layerName + "&outputFormat=application/json&maxFeatures=1");
            scope.layerGeometryType = "";

            request.then(function (response) {
                if (typeof response.data.features == 'undefined') {
                    return false;
                }

                if (response.data.features[0].geometry.type == 'Polygon' || response.data.features[0].geometry.type == 'MultiPolygon') {
                    scope.layerGeometryType = 3;
                } else if (response.data.features[0].geometry.type == 'LineString' || response.data.features[0].geometry.type == 'MultiLineString') {
                    scope.layerGeometryType = 2;
                } else {
                    scope.layerGeometryType = 1;
                }

            });

        };

        this.list = function () {
            var url = mapsResources.layer;
            return $http.get(url);
        };

        this.save = function (layer) {                        
            return $http.post(mapsResources.layer, layer);
        };

        this.delete = function (id) {
            var url = mapsResources.layer + '/' + id;
            return $http.delete(url);
        };

        this.retirarAcentos = function (string) {

            string = string.replace(new RegExp('[ÁÀÂÃáàãâ]', 'gi'), 'a');
            string = string.replace(new RegExp('[ÉÈÊéèê]', 'gi'), 'e');
            string = string.replace(new RegExp('[ÍÌÎíìî]', 'gi'), 'i');
            string = string.replace(new RegExp('[ÓÒÔÕóòôõ]', 'gi'), 'o');
            string = string.replace(new RegExp('[ÚÙÛúùû]', 'gi'), 'u');
            string = string.replace(new RegExp('[Çç]', 'gi'), 'c');

            return string;
        };

    });
});
