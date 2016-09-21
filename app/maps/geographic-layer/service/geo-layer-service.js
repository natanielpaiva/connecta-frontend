define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("GeoLayerService", function ($http, mapsResources) {

        var url = mapsResources.layer;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.query = function (params) {
          var queryString = serialize(params);
          return $http.get(url + '/query?' + queryString);

          function serialize(obj, prefix) {
            var str = [];
            for(var p in obj) {
              if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push(typeof v == "object" ?
                  serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
              }
            }
            return str.join("&");
          }

        };

        this.save = function (geoLayer) {
            return $http.post(url, geoLayer);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

        this.update = function (id, geoLayer) {
            return $http.put(url + '/' + id, geoLayer);
        };

        this.getLayersByDS = function (id) {
            return $http.get(url + '?filter={"spatialDataSourceId":"' + id + '"}');
        };

        this.delete = function (id) {
            return $http.delete(url, id);
        };

    });

});
