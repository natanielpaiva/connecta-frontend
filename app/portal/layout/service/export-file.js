/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'bower_components/html2canvas/dist/html2canvas.min'
    // 'bower_components/jspdf/dist/jspdf.min'
], function (portal) {
    return portal.service('ExportFile', function ($q) {
        var ExportFile = this;

        function _exportImage(deferred, filename, element) {
            var type = 'png';

            var myCanvas = element.getElementsByTagName('canvas');

            if (myCanvas) {
                var image = myCanvas[0].toDataURL('image/' + type);
                _outputData(image, filename);
                deferred.resolve();
            } else {
                html2canvas([element], {
                    useCORS: true
                }).then(function (canvas) {

                    var image = canvas.toDataURL("image/" + type);
                    image = image.replace('data:image/' + type + ';base64,', '');
                    var finalImageSrc = 'data:image/' + type + ';base64,' + image;
                    _outputData(deferred, finalImageSrc, filename);
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });
            }
        }

        function _outputData(image, filename) {
            var obj_url;
            var type = 'png';

            window.URL = window.URL || window.webkitURL;
            var image_data = atob(image.split(',')[1]);
            // Converter os dados binários em um Blob
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }

            var oBuilder = new Blob([view], {type: 'image/png'});
            obj_url = window.URL.createObjectURL(oBuilder);

            _download(obj_url, filename + '.' + type);
        }

        function _exportCsv(deferred, data, filename) {
            console.log(data);
            var csv = '';
            var line = '';
            var i = 0;

            if(data.series && data.series.length > 0){
                if(data.descriptionLabel){
                    csv += data.descriptionLabel + ';';
                }else{
                    csv += ';';
                }

                for(i = 0; i < data.series.length; i++){
                    csv += data.series[i] + ';';
                }
                csv += '\r\n';

                if(data.subtype == 'pie' || data.subtype == 'doughnut'){
                    for (i = 0; i < data.labels.length; i++) {
                        line = '';
                        line += data.labels[i] + ';' + data.data[i];
                        csv += line + '\r\n';
                    }
                }else{
                    for (i = 0; i < data.labels.length; i++) {
                        line = '';
                        line += data.labels[i];
                        for(var j = 0; j < data.series.length; j++){
                            line += ';' + data.data[j][i];
                        }
                        csv += line + '\r\n';
                    }
                }
            }else{
                for (i = 0; i < data.labels.length; i++) {
                    line = '';
                    line += data.labels[i] + ';' + data.data[i];
                    csv += line + '\r\n';
                }
            }

            var uri = "data:text/csv;charset=UTF-8," + escape(csv);
            var name = filename + ".csv";

            _download(uri, name);
            deferred.resolve();
        }

        function _download(url, filename) {
            var download = document.createElement("a");
            download.href = url;
            download.download = filename;
            document.body.appendChild(download);
            download.click();
            document.body.removeChild(download);
        }

        this.TYPE = {
            CSV: _exportCsv,
            IMAGE: _exportImage
        };

        /**
         *
         * @param {Function} strategy
         * @returns {undefined}
         */
        ExportFile.export = function (strategy) {
            var deferred = $q.defer();

            var argArray = Array.prototype.slice.call(arguments)
                    .slice(1, arguments.length);

            argArray.unshift(deferred);

            strategy.apply(ExportFile, argArray);

            return deferred.promise;
        };

    });
});



