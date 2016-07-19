/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'bower_components/html2canvas/dist/html2canvas.min'
], function (portal) {
    /**
     * Serviço de utilitários
     */
    return portal.service('exportFile', function (util) {
        this.exportImage = function (model,element) {
            var isPdf = false;
            var filename = model.name || util.uuid();
            var type = "png";

            var svgs = element.getElementsByTagName('svg');

            var options = {
                ignoreAnimation: true,
                ignoreMouse: true,
                ignoreClear: true,
                ignoreDimensions: true,
                offsetX: 0,
                offsetY: 0
            };

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var counter = {
                height: 0,
                width: 0
            };

            function removeImages(svg) {
                var startStr = '<image';
                var stopStr = '</image>';
                var stopStrAlt = '/>';
                var start = svg.indexOf(startStr);
                var stop;

                if (start !== -1) {
                    stop = svg.slice(start, start + 1000).indexOf(stopStr);
                    if (stop !== -1) {
                        svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                    } else {
                        stop = svg.slice(start, start + 1000).indexOf(stopStrAlt);
                        if (stop !== -1) {
                            svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                        }
                    }
                }
                return svg;
            }

            canvas.height = element.offsetHeight;
            canvas.width = element.offsetWidth;
            context.fillStyle = 'transparent';
            context.fillRect(0, 0, canvas.width, canvas.height);

            if (svgs.length > 0) {
                // Add SVGs
                for (var i = 0; i < svgs.length; i++) {
                    var container = svgs[i].parentNode;
                    var innerHTML = removeImages(container.innerHTML); // remove images from svg until its supported

                    options.offsetY = counter.height;
                    counter.height += container.offsetHeight;
                    counter.width = container.offsetWidth;
                    canvg(canvas, innerHTML, options);
                }

                var image = canvas.toDataURL('image/' + type);
                _outputData(image, filename, isPdf);
                // Adiciona Legenda ao Container inicial da mesma
            } else {
                html2canvas([element], {
                    useCORS: true
                }).then(function (canvas) {

                    var image = canvas.toDataURL("image/" + type);
                    image = image.replace('data:image/' + type + ';base64,', '');
                    finalImageSrc = 'data:image/' + type + ';base64,' + image;
                    _outputData(finalImageSrc, filename, isPdf);
                });
            }

        };

        var _outputData = function (image, filename, isPdf) {
            var obj_url;
            var type = 'png';
            if (isPdf) {

                var imgData = image;
                var doc = new jsPDF();
                doc.addImage(imgData, type, 0, 0);
                // Saída como URI de Dados
                obj_url = doc.output('dataurlstring');
            } else {

                window.URL = window.webkitURL || window.URL;
                var image_data = atob(image.split(',')[1]);
                // Converter os dados binários em um Blob
                var arraybuffer = new ArrayBuffer(image_data.length);
                var view = new Uint8Array(arraybuffer);
                for (var i = 0; i < image_data.length; i++) {
                    view[i] = image_data.charCodeAt(i) & 0xff;
                }

                var oBuilder = new Blob([view], {type: 'application/octet-stream'});
                obj_url = window.URL.createObjectURL(oBuilder);
            }

            _download(obj_url,filename+ '.' + type);
        };
        
        function _download(url,filename){
            var download = document.createElement("a");
            download.href = url;
            download.download = filename;
            document.body.appendChild(download);
            download.click();
            document.body.removeChild(download);
        }
        
    });
});



