define([
    'bower_components/amcharts/dist/amcharts/exporting/amexport',
    'bower_components/amcharts/dist/amcharts/exporting/canvg',
    'bower_components/amcharts/dist/amcharts/exporting/rgbcolor',
    'bower_components\html2canvas\build\html2canvas'
], function () {


    var AmExportPanel = function () {
        CoreObject.apply(this);
    };
    AmExportPanel.prototype = new CoreObject();
    AmExportPanel.prototype.constructor = AmExportPanel;
    /**
     * @param {DOM} element
     * @param {string} type {jpeg, png}
     * @returns {@exp;canvas@call;toDataURL}
     */
    AmExportPanel.prototype.getImage = function (element, type, filename, isPdf) {


        var that = this;

        var wrapper = element;
        var svgs = wrapper;
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
        // Nasty workaround until somebody figured out to support images
        function removeImages(svg) {
            var startStr = '<image';
            var stopStr = '</image>';
            var stopStrAlt = '/>';
            var start = svg.indexOf(startStr);
            var match = '';
            // Recursion
            if (start !== -1) {
                var stop = svg.slice(start, start + 1000).indexOf(stopStr);
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
        ;
        // Setup canvas
        canvas.height = wrapper.offsetHeight;
        canvas.width = wrapper.offsetWidth;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
            // Add SVGs
                var container = svgs.parentNode;
                var innerHTML = removeImages(container.innerHTML); // remove images from svg until its supported

                options.offsetY = counter.height;
                counter.height += container.offsetHeight;
                counter.width = container.offsetWidth;
                canvg(canvas, innerHTML, options);

            // Return output data URL
            var image = canvas.toDataURL('image/' + type);

            app.printDash = image;

    };
    /**
     * MÃ©todo para disponibilizar para download
     * @param {type} image
     * @param {type} filename
     * @param {type} isPdf
     */
    AmExportPanel.prototype.outputData = function (image, filename, isPdf) {
        var obj_url;
        if (isPdf) {

            var imgData = image;
            var doc = new jsPDF();
            doc.addImage(imgData, 'JPEG', 0, 0);
            // Output as Data URI
            obj_url = doc.output('dataurlstring');
        } else {

            window.URL = window.webkitURL || window.URL;
            var image_data = atob(image.split(',')[1]);
            // Use typed arrays to convert the binary data to a Blob
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }

            var oBuilder = new Blob([view], {type: 'application/octet-stream'});
            obj_url = window.URL.createObjectURL(oBuilder);
        }

        var a = $("<a/>");
        $("body").append(a);
        a[0].href = obj_url;
        a[0].download = filename;
        a[0].click();
        a.remove();
    };
    /**
     * Recebe um json como parÃ¢metro gera uma URL na div passada como parÃ¢metro com o
     * blob do arquivo para download.
     * @requires jsondata {object}: Objeto JSON .
     * @param filename {String}: nome do arquivo para download.
     * @param divDownload {object}: div para incluir o link.
     */
    AmExportPanel.prototype.exportJsonToCSV = function (jsondata, filename) {
        var transform = new CsvToJson();
        var file = transform.json2csv(jsondata);
        window.URL = window.webkitURL || window.URL;
        var aFileParts = [file];
        var oBuilder = new Blob(aFileParts, {"type": "text/plain"});
        var obj_url = window.URL.createObjectURL(oBuilder);
        var a = $("<a/>");
        $("body").append(a);
        a[0].href = obj_url;
        a[0].download = filename;
        a[0].click();
        a.remove();
    };
    return AmExportPanel;
});
define([
    'components/core/CoreObject',
    'modules/export/CsvToJson',
    'vendors/amcharts/exporting/canvg',
    'vendors/amcharts/StackBlur',
    'vendors/amcharts/exporting/rgbcolor',
    'vendors/html2canvas.min'
], function (CoreObject, CsvToJson) {


    var AmExportPanel = function () {
        CoreObject.apply(this);
    };
    AmExportPanel.prototype = new CoreObject();
    AmExportPanel.prototype.constructor = AmExportPanel;
    /**
     * @param {DOM} element
     * @param {string} type {jpeg, png}
     * @returns {@exp;canvas@call;toDataURL}
     */


    // Converts image to canvas; returns new canvas element
    AmExportPanel.prototype.convertImageToCanvas = function (image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);

        return canvas;
    }


    AmExportPanel.prototype.convertCanvasToImage = function (canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }

    AmExportPanel.prototype.getImage = function (element, type, filename, isPdf) {

        var arrSvgs = [];
        var arrWra = [];
        var wrapper = null;
        var wa = element[0];

        var that = this;

        for (var i = 0; i < element.length; i++) {
            wrapper = element[i];
            arrWra.push(wrapper);
            arrSvgs.push(wrapper.getElementsByTagName('svg'));
            wrapper = null;
        }

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

        // Nasty workaround until somebody figured out to support images
        function removeImages(svg) {


//            console.info('svg ', svg);
            var startStr = '<image';
            var stopStr = '</image>';
            var stopStrAlt = '/>';
            var start = svg.indexOf(startStr);
            var match = '';
            // Recursion
            if (start !== -1) {
                var stop = svg.slice(start, start + 1000).indexOf(stopStr);
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
        };

        // Setup canvas
        canvas.height = wa.offsetHeight;
        canvas.width = wa.offsetWidth;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (arrSvgs.length > 0) {
            // Add SVGs
            for (var i = 0; i < arrSvgs.length; i++) {
                var container = arrWra[i].parentNode;
                var innerHTML = removeImages(container.innerHTML); // remove images from svg until its supported

                options.offsetY = counter.height;
                counter.height += '900px';
                counter.width = '900px';
                canvg(canvas, innerHTML, options);
            }

            // Return output data URL
            var image = canvas.toDataURL('image/' + type);
            app.printDash = image;
        

            arrSvgs = null;
            arrWra = null;
            wrapper = null;
            wa = null;


//            that.outputData(image, filename, isPdf);

        } else {
            html2canvas($(wrapper), {
                proxy: "https://html2canvas.appspot.com/query",
                onrendered: function (htmlCanvas) {
                    var image = htmlCanvas.toDataURL("image/" + type);
                    that.outputData(image, filename, isPdf);
                }
            });
        }
    };
    /**
     * MÃ©todo para disponibilizar para download
     * @param {type} image
     * @param {type} filename
     * @param {type} isPdf
     */
    AmExportPanel.prototype.outputData = function (image, filename, isPdf) {
        var obj_url;
        if (isPdf) {

            var imgData = image;
            var doc = new jsPDF();
            doc.addImage(imgData, 'JPEG', 0, 0);
            // Output as Data URI
            obj_url = doc.output('dataurlstring');
        } else {

            window.URL = window.webkitURL || window.URL;
            var image_data = atob(image.split(',')[1]);
            // Use typed arrays to convert the binary data to a Blob
            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }

            var oBuilder = new Blob([view], {type: 'application/octet-stream'});
            obj_url = window.URL.createObjectURL(oBuilder);

        }

        var a = $("<a/>");
        $("body").append(a);
        a[0].href = obj_url;
        a[0].download = filename;
        a[0].click();
        a.remove();
    };
    /**
     * Recebe um json como parÃ¢metro gera uma URL na div passada como parÃ¢metro com o
     * blob do arquivo para download.
     * @requires jsondata {object}: Objeto JSON .
     * @param filename {String}: nome do arquivo para download.
     * @param divDownload {object}: div para incluir o link.
     */
    AmExportPanel.prototype.exportJsonToCSV = function (jsondata, filename) {
        var transform = new CsvToJson();
        var file = transform.json2csv(jsondata);
        window.URL = window.webkitURL || window.URL;
        var aFileParts = [file];
        var oBuilder = new Blob(aFileParts, {"type": "text/plain"});
        var obj_url = window.URL.createObjectURL(oBuilder);
        var a = $("<a/>");
        $("body").append(a);
        a[0].href = obj_url;
        a[0].download = filename;
        a[0].click();
        a.remove();
    };



    return AmExportPanel;
});