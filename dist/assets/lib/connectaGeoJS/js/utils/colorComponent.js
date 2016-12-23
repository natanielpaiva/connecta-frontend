define([
], function () {

    var ColorComponent = function () {
        Function.apply(this);
    };

    ColorComponent.prototype = new Function();
    ColorComponent.prototype.construtor = ColorComponent;

    /**
     *
     * @param {type} colorA
     * @param {type} colorB
     * @returns {unresolved}
     */
    ColorComponent.prototype.random = function (colorA, colorB) {
        var min = 0;
        var max = 99;
        var index = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.calculateDegradee('#FF0000', '#0000FF', 100, 1)[index];
    };

    ColorComponent.prototype.calculateDegradee = function (colorA, colorB, steps, alpha) {
        var resp = [];

        var ca = this.__toRGBObject(colorA);
        var cb = this.__toRGBObject(colorB);
        var cobject = {};

        for (i = 0; i < steps; i++) {
            cobject = {
                red: this.__calculateColor(ca.red, cb.red, steps, i),
                green: this.__calculateColor(ca.green, cb.green, steps, i),
                blue: this.__calculateColor(ca.blue, cb.blue, steps, i)
            };

            if (alpha == 1)
                resp.push(this.__toHEX(cobject, alpha));
            else
                resp.push(this.__toRGBAString(cobject, alpha));
        }
        return resp;
    };

    ColorComponent.prototype.__toRGBObject = function (str) {
        var arr = str.split("");
        return {
            red: parseInt(arr[1] + arr[2], 16),
            green: parseInt(arr[3] + arr[4], 16),
            blue: parseInt(arr[5] + arr[6], 16)
        };
    };

    ColorComponent.prototype.__calculateColor = function (colorA, colorB, steeps, steep) {
        var range = Math.abs(colorA - colorB);

        if (colorA < colorB)
            return Math.round(colorA + (steep * (range / steeps)));
        else
            return Math.round(colorA - (steep * (range / steeps)));
    };

    ColorComponent.prototype.__toRGBAString = function (rgb, alpha) {
        return "rgba(" +
                [rgb.red, rgb.green, rgb.blue, alpha].join(",") +
                ")";
    };

    ColorComponent.prototype.__toHEX = function (rgb) {
        var ret = "#";
        for (var prop in rgb) {
            var c = rgb[prop].toString(16);
            if (c.length == 1)
                c = "0" + c;

            ret += c;
        }
        return ret;
    }


    return ColorComponent;
});