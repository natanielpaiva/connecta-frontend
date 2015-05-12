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

        this.getLayersBySource = function (sourceType,scope) {            
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
            }).success(function(data){                               
                scope.layers=JSON.parse(data);
                return data;
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

    });
});
