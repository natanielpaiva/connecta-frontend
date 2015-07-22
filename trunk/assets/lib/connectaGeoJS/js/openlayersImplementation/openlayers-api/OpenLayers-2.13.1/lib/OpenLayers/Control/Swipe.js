/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Swipe
 * The Swipe control will reveal/hide a target layer right/left side of mouse mouse position on the map.
 *
 * Inherits from: - <OpenLayers.Control>
 */
OpenLayers.Control.Swipe = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: layer
     * {<OpenLayers.Layer>} The target layer to be swiped
     */
    layer: null,

    /**
     * Property: layerContainerDiv
     * {DOMElement} Layer container div used to read panning offset
     */
    layerContainerDiv: null,

    /**
     * Property: div
     * {DOMElement} Layer div for CSS clip manipulation
     */
    div: null,

    /**
     * Constructor: OpenLayers.Control.Swipe
     *
     * Parameters:
     * layer - {OpenLayers.Layer} Target layer for the swipe effect.
     * options - {Object} An optional object whose properties will be used to extend the control.
     */
    initialize: function(layer, layer2, options) {
        // setup properties to be used for swipe logic
        //Primeira Layer
        this.map = layer.map;
        this.layer = layer;
        this.div = this.layer.div;
        this.layerContainerDiv = this.layer.map.layerContainerDiv;


        //Segunda Layer

        this.layer2 = layer2;
        this.div2 = this.layer2.div;
        this.layerContainerDiv2 = this.layer2.map.layerContainerDiv;

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: activate
     * Activate the control.
     */
    activate: function() {
        var activated = OpenLayers.Control.prototype.activate.call(this);

        if (activated) {
            this.map.events.on({
                mousemove: this.onMousemove,
                scope: this
            });
        }
    },

    /**
     * APIMethod: deactivate
     * Deactivate the control.
     */
    deactivate: function() {
        var deactivated = OpenLayers.Control.prototype.deactivate.call(this);

        if (deactivated) {
            this.div.style.clip = '';

            this.map.events.un({
                mousemove: this.onMousemove,
                scope: this
            });
        }
    },

    /**
     * Method: onMousemove
     * Registered as a listener for mousemove events on the map. Calculates clip region
     * that will create the swipe effect.
     *
     * Parameters:
     * e - {Object} The mousemove event.
     */
    onMousemove: function(e) {

                

        document.getElementById("divisionSwipe").style.left=(e.clientX-4) + 'px';



        //Primeira Layer
        var offsetXLayer1 = (e.clientX - this.map.div.offsetLeft) - this.layerContainerDiv.offsetLeft;
        var offsetYLayer1 = -this.layerContainerDiv.offsetTop;

        var top = offsetYLayer1;
        var right = this.map.getSize().w + offsetXLayer1;
        var bottom = this.map.getSize().h + offsetYLayer1;
        var left = offsetXLayer1;

        this.div.style.clip = 'rect(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px)';

        //Segunda Layer
        var offsetXLayer2 = (e.clientX + this.map.div.offsetLeft) - this.layerContainerDiv2.offsetLeft;
        var offsetYLayer2 = -this.layerContainerDiv2.offsetTop;

        var top = offsetYLayer2;
        var left = -(this.map.getSize().w - offsetXLayer2);
        var bottom = this.map.getSize().h + offsetYLayer2;
        var right = offsetXLayer2;


        this.div2.style.clip = 'rect(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px)';
    },

    CLASS_NAME: "OpenLayers.Control.Swipe"
});