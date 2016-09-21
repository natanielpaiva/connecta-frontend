define(['esri-leaflet'], function (esri) {
  L.esri = esri;
  return {

    map: undefined,

    buildMap: function (mapDiv, center, zoom, basemap) {
      var self = this;
      return new Promise(function (resolve, reject) {
        try {
          self.map = L.map(mapDiv);
          self.map.on('load', function () {
            resolve(self.map);
          });
          L.esri.basemapLayer(basemap || 'Streets').addTo(self.map);
          self.map.setView(center || [45.528, -122.680], zoom || 13);
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
