define(['esri-leaflet'], function (esri) {
  L.esri = esri;
  return {

    map: undefined,
    featureGroup: undefined,

    buildMap: function (mapDiv, center, zoom, basemap) {
      var self = this;
      return new Promise(function (resolve, reject) {
        try {
          if (self.map) {
            delete self.featureGroup;
            self.map.remove();
          }
          self.map = L.map(mapDiv);
          self.map.on('load', function () {
            self.featureGroup = L.featureGroup([]);
            self.featureGroup.addTo(self.map);
            resolve(self.map);
          });
          L.esri.basemapLayer(basemap || 'Streets').addTo(self.map);
          self.map.setView(center || [-15.623036831528252, -49.6142578125], zoom || 4);
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

    getCenter: function () {
      return this.map.getCenter();
    },

    setZoom: function (zoom) {
      this.map.setZoom(zoom);
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
