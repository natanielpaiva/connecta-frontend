define(['esri-leaflet'], function (esri) {
    L.esri = esri;
    return {

        map: undefined,
        featureGroup: undefined,

        buildMap: function (mapDiv, options) {
            var self = this;
            return new Promise(function (resolve, reject) {
                try {
                    if (self.map) {
                        delete self.featureGroup;
                        self.map.remove();
                        delete self.map;
                    }
                    self.map = L.map(mapDiv, options);
                    self.map.on('load', function () {
                        self.featureGroup = L.featureGroup([]);
                        self.featureGroup.addTo(self.map);
                        resolve(self.map);
                    });

                    var basemap = 'Streets';
                    var center = [-15.623036831528252, -49.6142578125];
                    var zoom = 4;

                    if (options) {
                        basemap = options.basemap || basemap;
                        center = options.center || center;
                        zoom = options.zoom || zoom;
                    }

                    L.esri.basemapLayer(basemap).addTo(self.map);
                    self.map.setView(center, zoom);
                } catch (err) {
                    reject(err);
                }
            });
        },

        buildLayer: function (data) {
            try {
                var geoJSON = L.esri.Util.responseToFeatureCollection(data);
                var geoJSONLayer = L.geoJSON(geoJSON);
                return geoJSONLayer;
            } catch (err) {
                throw new Error(err);
            }
        },

        previewLayer: function (layer) {
            var self = this;
            return new Promise(function (resolve, reject) {
                try {
                    self.featureGroup.clearLayers();
                    self.featureGroup.addLayer(layer);
                    self.map.fitBounds(self.featureGroup.getBounds());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        },

        watchCenterChange: function (callback, startPaused) {
            var self = this;
            function positionChanged(event) {
                callback(self.map.getCenter());
            }
            if (!startPaused) {
                this.map.on('move', positionChanged);
            }
            return {
                remove: function () {
                    self.map.off('move', positionChanged);
                },
                pause : function () {
                    this.remove();
                },
                resume : function () {
                    self.map.on('move', positionChanged);
                }
            };
        },

        watchZoomChange: function (callback, startPaused) {
            var self = this;
            function zoomChanged(event) {
                callback(self.map.getZoom());
            }
            if (!startPaused) {
                this.map.on('zoom', zoomChanged);
            }
            return {
                remove: function () {
                    self.map.off('zoom', zoomChanged);
                },
                pause : function () {
                    this.remove();
                },
                resume : function () {
                    self.map.on('zoom', zoomChanged);
                }
            };
        },

        getBounds: function () {
            return this.map.getBounds();
        },

        fitBounds: function (latLngBounds) {
            this.map.fitBounds(latLngBounds);
        },

        setMaxBounds: function (latLngBounds) {
            this.map.setMaxBounds(latLngBounds);
        },

        freezeBounds: function (center, zoom) {
            this.map.setView(center, zoom);
            setTimeout(function () {
                var currentBounds = this.map.getBounds();
                var staticZoom = this.map.getBoundsZoom(currentBounds);
                this.setMaxZoom(staticZoom);
                this.setMinZoom(staticZoom);
                this.map.setMaxBounds(currentBounds);
            }.bind(this), 1000);
        },

        getCenter: function () {
            return this.map.getCenter();
        },

        setZoom: function (zoom) {
            this.map.setZoom(zoom);
        },

        getZoom: function () {
            return this.map.getZoom();
        },

        setCenter: function (position) {
            this.map.setView(position);
        },

        setMaxZoom: function (maxZoom) {
            this.map.setMaxZoom(maxZoom);
        },

        setMinZoom: function (minZoom) {
            this.map.setMinZoom(minZoom);
        }
    };
});
