/** 
 	 * @requires OpenLayers/Control.js 
 	 * @requires OpenLayers/Control/Snapping.js 
 	 */ 
 	 
 	/** 
 	 * Class: OpenLayers.Control.Trace 
 	 * Act as tracing agent while drawing LineString or Polygon 
 	 */ 
 		 
 		OpenLayers.Control.Trace = OpenLayers.Class(OpenLayers.Control, { 
 		 
 		    /** 
 		     * Constants: EVENT_TYPES 
 		     * Supported control event types 
 		     * beforetrace - Triggered before a trace occurs.  Listeners receive an 
 		     *     event object with *traceLine* property. traceLine is the lineString  
 		     *     traced along the snapped features.  
 		     * trace - Triggered when a trace occurs.  Listeners receive an 
 		     *     event object with *traceLine* and *feature* property. traceLine is 
 		     *     the lineString traced along the snapped features. feature is the current 
 		     *     sketch after the traceLine has been added. 
 		     * untrace - Triggered when sketchGeometry is untraced. Listeners receive an 
 		     *     event object with *traceLine* and *feature* property.  traceLine is 
 		     *     the lineString untraced or removed from the sketch geometry.  
 		     *     feature is the current sketch after the traceLine has been removed. 
 		     */ 
 		    EVENT_TYPES: ["beforetrace","trace","untrace"],  
 		 
 		    /** 
 		     * Property: firstSnappedGeometry 
 		     * {<OpenLayers.Geometry>} current snapped feature geometry 
 		     */ 
 		    firstSnappedGeometry: null, 
 		 
 		    /** 
 		     * Property: numFeaturePoints 
 		     * Current number of points in the sketch 
 		     */  
 		    numFeaturePoints: 0, 
 		 
 		    /** 
 		     * Property: secondSnappedGeometry 
 		     * {<OpenLayers.Geometry>} second snapped feature geometry 
 		     */ 
 		    secondSnappedGeometry: null, 
 		     
 		    /** 
 		     * Porperty: snapControl 
 		     * {<OpenLayers.Control.Snapping>} 
 		     */ 
 		    snapControl: null, 
 		 
 		    /** 
 		     * Property: snappedGeometry 
 		     * {<OpenLayers.Geometry>} current snaped feature geometry 
 		     */ 
 		    snappedGeometry: null, 
 		 
 		    /** 
 		     * Property: snapPoint 
 		     * {<OpenLayers.Geometry.Point>} snap point 
 		     */ 
 		    snapPoint: null, 
 		 
 		    /** 
 		     * Property: startPoint 
 		     * {<OpenLayers.Geometry.Point>} Trace start point 
 		     */ 
 		    startPoint: null, 
 		     
 		    /**  
 		     * Property: tolerance 
 		     * {float} - defualt tolerance of snap control in map unit 
 		     */ 
 		    tolerance: 0, 
 		     
 		    /** 
 		     * Property: traceLine 
 		     * {<OpenLayers.Geometry.LineString>} -  trace line that has been traced along a feature between  
 		     * the first snap point (startPoint) to the second snap point (current snap point), 
 		     * if the second snap point is on the second feature then nearest intersection of these two geoemetry 
 		     * is taken as the switch point. That means trace conssist of two part, part 1 is trace on  
 		     * first snapped feature between first snap point and the switch point. 
 		     * Part 2 is the trace on second snapped feature between second snap point. 
 		     */ 
 		    traceLine: null, 
 		         
 		    /** 
 		     * Constructor: OpenLayers.Control.Trace 
 		     * Create a new trace control. This control is constructed with snapping option.  
 		     * this control allows tracing while drawing feature (LineString and Polygon) 
 		     * 
 		     * Parameters: 
 		     * snapControl - {<OpenLayers.Control.Snapping>} snap control of the vector layer 
 		     * options - {Object} An object containing all configuration properties for 
 		     *     the control. 
 		     */ 
 		    initialize: function(snapControl,options) { 
 		        // concatenate events specific to trace with those from the base 
 		        Array.prototype.push.apply( 
 		            this.EVENT_TYPES, OpenLayers.Control.prototype.EVENT_TYPES 
 		        ); 
 		        OpenLayers.Control.prototype.initialize.apply(this, [options]); 
 		        this.layer = snapControl.layer;      
 		        this.snapControl = snapControl; 
 		    }, 
 		 
 		    /** 
 		     * APIMethod: activate 
 		     * Activate the control.  Activating the control registers listeners for 
 		     *     snap and unsnap. 
 		     * Returns: {Boolean} 
 		     */ 
 		    activate: function() { 
 		        var activated = OpenLayers.Control.prototype.activate.call(this); 
 		        if(activated) { 
 		            if(this.snapControl && this.snapControl.events) { 
 		                if (this.snapControl.active == false) {  
 		                    activated = this.snapControl.activate(); 
 		                } 
 		                if(activated){ 
 		                    this.snapControl.events.on({ 
 		                        snap : this.onSnap, 
 		                        unsnap : this.onUnSnap, 
 		                        scope: this 
 		                    }); 
 		                    if(this.layer && this.layer.events){ 
 		                        this.snapControl.layer.events.on({ 
 		                            sketchstarted: this.onSketchStarted, 
 		                            sketchmodified: this.onSketchModified, 
 		                            sketchcomplete: this.onSketchComplete, 
 		                            scope: this 
 		                        }); 
 		                    } else { 
 		                        activated = false; 
 		                    } 
 		                } else { 
 		                    activated = false; 
 		                } 
 		            } else { 
 		                activated=false; 
 		            } 
 		        } 
 		        return activated; 
 		    }, 
 		 
 		    /** 
 		     * APIMethod: deactivate 
 		     * Deactivate the control.  Deactivating the control unregisters listeners 
 		     *     so feature editing may proceed without engaging the trace agent. 
 		     * Retruns: {Boolean} 
 		     */ 
 		    deactivate: function() { 
 		        var deactivated = OpenLayers.Control.prototype.deactivate.call(this); 
 		        if(deactivated) { 
 		            if(this.snapControl && this.snapControl.events) { 
 		                this.snapControl.events.un({ 
 		                    snap : this.onSnap, 
 		                    unsnap : this.onUnSnap, 
 		                    scope: this 
 		                }); 
 		                if(this.layer && this.layer.events){ 
 		                    this.snapControl.layer.events.un({ 
 		                        sketchstarted: this.onSketchStarted, 
 		                        sketchmodified: this.onSketchModified, 
 		                        sketchcomplete: this.onSketchComplete, 
 		                    scope: this 
 		                    }); 
 		                } else { 
 		                    deactivated = false; 
 		                } 
 		            } else { 
 		                deactivated=false; 
 		            } 
 		        } 
 		        this.snappedGeometry = null; 
 		        this.startPoint = null; 
 		        this.snapPoint = null; 
 		        this.numFeaturePoints = 0;   
 		        return deactivated; 
 		    }, 
 		         
 		    /** 
 		     * Method: onSnap 
 		     * Handler for snap event. 
 		     */ 
 		    onSnap: function(event){ 
 		        this.snapPoint = event.point; 
 		        if (event.snappedFeature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon")  { 
 		            this.snappedGeometry = event.snappedFeature.geometry.components[0]; 
 		        } else { 
 		            this.snappedGeometry = event.snappedFeature.geometry; 
 		        } 
 		    }, 
 		 
 		    /** 
 		     * Method: onUnSnap 
 		     * Handler for unsnap event. 
 		     */ 
 		    onUnSnap: function(event){ 
 		        this.snapPoint = null; 
 		        this.snappedGeometry = null; 
 		    }, 
 		 
 		    /** 
 		     * Method: onSketchStarted 
 		     * Handler for sketchstarted event. 
 		     */ 
 		    onSketchStarted: function(event){ 
 		        if (event.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") { 
 		            this.numFeaturePoints = 2; 
 		        } else { 
 		            this.numFeaturePoints =1; 
 		        } 
 		    }, 
 		 
 		    /** 
 		     * Method: isVertexAdded 
 		     * Return the vertex added in the sketch, if no vertex added returns false  
 		     * Retruns: 
 		     * {<OpenLayers.Geometry.Point>} - point  
 		     */ 
 		    isVertexAdded: function(event){ 
 		        var numPoints; 
 		        var isAdded=false; 
 		        var sketchGeometry = event.feature.geometry; 
 		        if (sketchGeometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") { 
 		            //TODO components[0] not handelled for multi geometry 
 		            numPoints = sketchGeometry.components[0].components.length; 
 		        } else { 
 		            numPoints = sketchGeometry.components.length; 
 		        } 
 		        if (numPoints > this.numFeaturePoints) {             
 		            isAdded = true; 
 		            this.numFeaturePoints += 1; 
 		        } 
 		        return isAdded; 
 		    }, 
 		 
 		    /** 
 		     * Method: getLastVertex 
 		     * return the last vertex of sketch geometry 
 		     * Parameters: 
 		     * sketchGeometry - {<OpenLayers.Geometry>} 
 		     * Returns: 
 		     * {<OpenLayers.Geometry.Point>} 
 		     */ 
 		    getLastVertex: function(sketchGeometry){ 
 		        var point; 
 		        var count; 
 		        if (sketchGeometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") { 
 		            //TODO components[0] not handelled for multi geometry 
 		            count = sketchGeometry.components[0].components.length; 
 		            point = sketchGeometry.components[0].components[count-3]; 
 		        } else { 
 		            count = sketchGeometry.components.length; 
 		            point = sketchGeometry.components[count-2]; 
 		        }            
 		        return point; 
 		    }, 
 		     
 		    /** 
 		     * Method: onSketchModified  
 		     * Handler for sketchmodified. Here is the logic to trace.  
 		     */ 
 		    onSketchModified: function(event) { 
 		        var isVertexAdded = false; 
 		        isVertexAdded = this.isVertexAdded(event); 
 		        var sketchGeometry = event.feature.geometry; 
 		        if (this.snapPoint) {            
 		            //considering snapPoint and pointAdded are same or at same location 
 		            if (isVertexAdded)  {            
 		                if (this.startPoint) {           
 		                    this.traceLine = null; 
 		                    this.startPoint = this.getLastVertex(sketchGeometry); //last point added 
 		                    this.firstSnappedGeometry = this.snappedGeometry; 
 		                } else { 
 		                    this.startPoint = this.getLastVertex(sketchGeometry); 
 		                    this.firstSnappedGeometry = this.snappedGeometry; 
 		                } 
 		            } else { 
 		                if (this.startPoint) { 
 		                    if(this.firstSnappedGeometry != this.snappedGeometry) { 
 		                        this.secondSnappedGeometry = this.snappedGeometry; 
 		                    }  
 		                    // remove the old trace if exists  
 		                    if (this.traceLine) { 
 		                        this.removeLastTraceLine(sketchGeometry,this.traceLine); 
 		                        this.traceLine = null; 
 		                        this.events.triggerEvent("untrace",{ 
 		                            traceLine:this.traceLine,feature:event.feature}); 
 		                    } 
 		                    //check for snapPoint is not within the tolerance of the startPoint 
 		                    var dist = this.startPoint.distanceTo(this.snapPoint); 
 		                    this.tolerance = this.layer.map.getResolution()*this.snapControl.DEFAULTS.tolerance; 
 		                    if(dist > this.tolerance) {  
 		                        // get trace line of sketch along snapped features  
 		                        this.traceLine = this.createTraceLine(sketchGeometry); 
 		                        if (this.traceLine) { 
 		                            var proceed = this.events.triggerEvent("beforetrace",{ 
 		                                traceLine:this.traceLine}); 
 		                            if (proceed !== false) { 
 		                                this.addTraceLine(sketchGeometry,this.traceLine); 
 		                                this.events.triggerEvent("trace",{ 
 		                                    traceLine:this.traceLine,feature:event.feature}); 
 		                            } 
 		                        } 
 		                    } 
 		                } 
 		            }            
 		        } else { 
 		            //not snapped 
 		            if (this.traceLine) {                
 		                // its unsnap and there was old trace so remove it 
 		                this.removeLastTraceLine(event.feature.geometry,this.traceLine); 
 		                this.traceLine = null; 
 		            } 
 		            this.secondSnappedGeometry = null; 
 		            if (isVertexAdded)  { 
 		                // in sketch geometry vertex is added away from tolerance of snap  
 		                // so all trace properties need to be reset 
 		                if (this.startPoint){ 
 		                    this.resetTrace(); 
 		                } 
 		            }        
 		        } 
 		    }, 
 		     
 		    /** 
 		     * Method: createTraceLine 
 		     * Retrun trace line along snapped features 
 		     * Parameters: 
 		     * sketchGeometry - {<OpenLayers.Geometry>} current sketch geometry with out trace part 
 		     * Returns: {<OpenLayers.Geometry.LineString>} 
 		     */ 
 		    createTraceLine: function(sketchGeometry) { 
 		        var traceLine = false;       
 		        var traceLinePart1,traceLinePart2; 
 		        var start,end;                   
 		        var endPoint = this.snapPoint;                   
 		        if (this.secondSnappedGeometry) { 
 		            //switch position is the intersection of two points 
 		            var switchPoint;  
 		            var intersections = OpenLayers.Control.Trace.intersection( 
 		                this.firstSnappedGeometry, 
 		                this.secondSnappedGeometry, 
 		                {tolerance: this.toleracne}); 
 		            if (intersections.length > 0){ 
 		                //switchPoint = intersections[0]; //TODO select the nearest to snapPoint 
 		                var best = Number.POSITIVE_INFINITY; 
 		                for (var i=0;i <intersections.length;i++){ 
 		                    dist = intersections[i].distanceTo(this.snapPoint); 
 		                    if (dist < best) { 
 		                        best = dist; 
 		                        switchPoint = intersections[i]; 
 		                    } 
 		                } 
 		                if (this.startPoint.equals(switchPoint) != true ) { 
 		                    traceLinePart1 = OpenLayers.Control.Trace.LRSSubstringBetweenPoints( 
 		                        this.firstSnappedGeometry, this.startPoint,switchPoint,this.tolerance); 
 		                } 
 		                if (switchPoint.equals(endPoint) != true ) { 
 		                    traceLinePart2 = OpenLayers.Control.Trace.LRSSubstringBetweenPoints( 
 		                        this.secondSnappedGeometry, switchPoint,endPoint,this.tolerance);                            
 		                } 
 		                if (traceLinePart1 && traceLinePart2 ) { 
 		                    traceLineComponents = traceLinePart1.components.concat( 
 		                        traceLinePart2.components.slice(1)); 
 		                } else if (traceLinePart1) { 
 		                    traceLineComponents = traceLinePart1; 
 		                } else if (traceLinePart2)  { 
 		                    traceLineComponents = traceLinePart2; 
 		                } 
 		                traceLine = new OpenLayers.Geometry.LineString(traceLineComponents); 
 		            }  
 		        } else { 
 		            traceLine = OpenLayers.Control.Trace.LRSSubstringBetweenPoints(this.snappedGeometry,this.startPoint,endPoint,this.tolerance); 
 		        } 
 		        return traceLine; 
 		    }, 
 		 
 		    /** 
 		     * Method: onSketchComplerted 
 		     * Handler for sketchcomplete event. 
 		     */ 
 		 
 		    onSketchComplete: function(event){ 
 		        this.resetTrace(); 
 		    }, 
 		         
 		    /** 
 		     * Method: resetTrace 
 		     * Reset the trace control. 
 		     */ 
 		    resetTrace: function(){ 
 		        this.snappedGeometry = null; 
 		        this.startPoint = null; 
 		        this.snapPoint = null; 
 		        this.firstSnappedGeometry = null; 
 		        this.secondSnappedGeometry = null; 
 		        this.numFeaturePoints = 0; 
 		        this.traceLine = null; 
 		    }, 
 		 
 		    /** 
 		     * Method: addTraceLine 
 		     * Add the trace line to the current sketch geometry 
 		     * Parameters: 
 		     * sketchGeometry - {<OpenLayers.Geometry>}  
 		     * traceLine - {<OpenLayers.Geometry.LineString>} 
 		     */ 
 		    addTraceLine: function(sketchGeometry,traceLine) { 
 		        for (var i=1; i< traceLine.components.length-1; i++ ) {                      
 		            //if (i > 0 && i < traceLine.components.length-1){ 
 		                if (sketchGeometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") { 
 		                    sketchGeometry.components[0].addComponent(traceLine.components[i], 
 		                    sketchGeometry.components[0].components.length -2); 
 		                } else { 
 		                    sketchGeometry.addComponent(traceLine.components[i],sketchGeometry.components.length -1); 
 		                } 
 		                this.numFeaturePoints += 1; 
 		            //} 
 		        }    
 		    }, 
 		     
 		    /** 
 		     * Method: removeLastTraceLine 
 		     * Remove the last trace from sketch geometry 
 		     */ 
 		    removeLastTraceLine: function(sketchGeometry){ 
 		        var count = (this.traceLine.components.length - 2); 
 		        var index; 
 		        if (sketchGeometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") { 
 		            index = (sketchGeometry.components[0].components.length -2) - count; 
 		            sketchGeometry.components[0].components.splice(index,count); 
 		                 
 		        } else { 
 		            index = (sketchGeometry.components.length -1) - count; 
 		            sketchGeometry.components.splice(index,count); 
 		        } 
 		        this.numFeaturePoints -= count; 
 		    }, 
 		     
 		    CLASS_NAME: "OpenLayers.Control.Trace" 
 		 
 		}); 
 		 
 		 
 		/** 
 		 * APIMethod: intersection 
 		 * Returns the intersection of linestring geometry 
 		 * Parameters: 
 		 *  line - OpenLayers.Geometry.LineString  
 		 *  geom - OpenLayers.Geometry with which intersetion is calculated 
 		 *     options - Valid options 
 		 *      tolerance:float 
 		 * Returns: 
 		 *  Array of {<OpenLayers.Geometry.Point>} 
 		 */ 
 		OpenLayers.Control.Trace.intersection = function(line,geom,options) { 
 		    if (options){  
 		        options.point = true; 
 		    } else { 
 		        options = {}; 
 		        options.point = true; 
 		    } 
 		    var intersections=[]; 
 		    //TODO handled only for lineString 
 		    if (geom instanceof OpenLayers.Geometry.LineString) { 
 		        if (line.intersects(geom)) { 
 		            var targetParts,sourceParts; 
 		            var seg1,seg2; 
 		            var point; 
 		            targetParts = line.getVertices(); 
 		            sourceParts = geom.getVertices(); 
 		            for (var i=0;i<targetParts.length-1;i++) { 
 		                seg1= {x1:targetParts[i].x, y1:targetParts[i].y, x2:targetParts[i+1].x, y2:targetParts[i+1].y }; 
 		                for (var j=0;j < sourceParts.length-1;j++) { 
 		                    seg2= {x1:sourceParts[j].x, y1:sourceParts[j].y,x2:sourceParts[j+1].x, y2:sourceParts[j+1].y }; 
 		                    point = OpenLayers.Geometry.segmentsIntersect(seg1,seg2,options); 
 		                    if (point) { 
 		                        if (point == true) { // geometry coincident 
 		                            var p1 = new OpenLayers.Geometry.Point(seg1.x1,seg1.y1); 
 		                            var p2 = new OpenLayers.Geometry.Point(seg1.x2,seg1.y2); 
 		                            intersections.push(p1,p2); 
 		                        } else { 
 		                            intersections.push(point); 
 		                        } 
 		                    } 
 		                }   
 		            } 
 		        } 
 		    } 
 		    return intersections;            
 		}; 
 		 
 		/** 
 		 * APIMethod: LRSInterpolatePoint 
 		 * Returns a point interpolated along a line. 
 		 * Parameters: 
 		 * line - {<OpenLayers.Geometry.LineString>} 
 		 * position - {float} value between 0 to 1  
 		 * Retruns: {<OpenLayers.Geometry.Point>} 
 		 */ 
 		OpenLayers.Control.Trace.LRSInterpolatePoint = function (line,position){ 
 		    var curPos = 0; 
 		    var point =false; 
 		    for (var i=0; i <line.components.length;i++){ 
 		        lastPos = curPos; 
 		        curPos += line.componets[i].distanceto(line.components[i+1]); 
 		        if(curPos > position){ 
 		            point = OpenLayers.Control.Trace.LRSInterpolatePointOnSegment( 
 		                        line.componets[i], 
 		                        line.componets[i+1], 
 		                        position - lastPos 
 		                    ); 
 		        }    
 		    } 
 		    return point; 
 		}; 
 		 
 		/** 
 		 * APIMethod: LRSInterpolatePointOnSegment 
 		 * Returns a point interpolated along a segment. 
 		 * Parameters: 
 		 * line - {<OpenLayers.Geometry.LineString>} 
 		 * position - {float} value between 0 to 1  
 		 * Retruns: {<OpenLayers.Geometry.Point>} 
 		 */ 
 		OpenLayers.Control.Trace.LRSInterpolatePointOnSegment = function (point1,point2,position){ 
 		    var point = false; 
 		    if (position >= 0 && position <=1) { 
 		        x1 = point1.x; 
 		        y1 = point1.y; 
 		        x2 = point2.x; 
 		        y2 = point2.y; 
 		        x = x1 + (x2-x1)*position; 
 		        y = y1 + (y2-y1)*position; 
 		        point = new OpenLayers.Geometry.Point(x,y); 
 		    } 
 		    return point; 
 		}; 
 		 
 		/** 
 		 * APIMethod: LRSMeasure 
 		 *  to measure of point on linestring  
 		 * Parameters: 
 		 *  line - <OpenLayers.Geometry.LineString> 
 		 *  point - <OpenLayers.Geometry.Point> 
 		 * Returns: 
 		 *  {float}, between 0 and 1 
 		 */ 
 		OpenLayers.Control.Trace.LRSMeasure = function(line,point,options) { 
 		    var details = options && options.details; 
 		    var tolerance = options && options.tolerance ? options.tolerance : 0.0; 
 		    var seg = {}; 
 		    var length =0.0; 
 		    var dist =0.0; 
 		    var measureCalculated = false; 
 		    var part1Points =[]; 
 		    var part2Points =[]; 
 		    var totalLength = line.getLength(); 
 		    var result ={}; 
 		    for (var i=0;i<line.components.length-1;i++ ) { 
 		        seg = { x1: line.components[i].x, 
 		                y1: line.components[i].y, 
 		                x2: line.components[i+1].x, 
 		                y2: line.components[i+1].y 
 		             }; 
 		        dist = OpenLayers.Geometry.distanceToSegment(point,seg).distance; 
 		        if ( (dist < tolerance) && !measureCalculated  ) { 
 		            length += line.components[i].distanceTo(point); 
 		            measureCalculated = true; 
 		            //return length/totalLength;                 
 		            part1Points.push(line.components[i],point); 
 		            part2Points.push(point,line.components[i+1]);  
 		        } else if (!measureCalculated) { 
 		            length += line.components[i].distanceTo(line.components[i+1]); 
 		            part1Points.push(line.components[i]); 
 		        } else { 
 		            part2Points.push(line.components[i+1]);              
 		        } 
 		    } 
 		    if (details){ 
 		        result = { 
 		            measure : length/totalLength, 
 		            subString1 : new OpenLayers.Geometry.LineString( part1Points ), 
 		            subString2 : new OpenLayers.Geometry.LineString( part2Points ) 
 		        }; 
 		        return result;               
 		    } else { 
 		        return length/totalLength; 
 		    } 
 		};  
 		/** 
 		 * APIMethod: LRSSubstring 
 		 * Returns the part of line for given start and end measure 
 		 * Parameters: 
 		 * line - {<OpenLayers.Geometry.LineString>}  
 		 * start - start measure between 0-1 
 		 * end - end measure between 0-1 
 		 * Retruns:  
 		 * {<OpenLayers.Geometry.LineString>} 
 		 */ 
 		OpenLayers.Control.Trace.LRSSubstring = function (line,start,end){ 
 		    var length = line.getLength(); 
 		    var startPos = start*length; 
 		    var endPos = end*length;     
 		    var points = []; 
 		    var curPos=0; 
 		    var subString = false; 
 		    reverseFlag = false; 
 		    if (start == 0 && end == 1) { 
 		        subString = line; 
 		    } else if ( start >= 0 && end <= 1 && start != end ) { 
 		        if ( start > end )  { 
 		            var tmp = end; 
 		            end = start; 
 		            start = tmp; 
 		            reverseFlag = true; 
 		        } 
 		        for(var i=0; i <line.components.length;i++){ 
 		            var lastPos = curPos; 
 		            if (i >0){ 
 		                curPos += line.components[i].distanceTo(line.components[i-1]);       
 		            }                
 		            if (curPos > startPos && curPos < endPos){                       
 		                if (points.length == 0){                 
 		                    var segLength = line.components[i].distanceTo(line.components[i-1]); 
 		                    var firstPoint = OpenLayers.Control.Trace.LRSInterpolatePointOnSegment( 
 		                        line.components[i-1], 
 		                        line.components[i], 
 		                        (startPos - lastPos )/segLength 
 		                    ); 
 		                    points.push(firstPoint); 
 		                } 
 		                points.push(line.components[i]); 
 		            } else if (curPos >= endPos )  {             
 		                var segLength = line.components[i].distanceTo(line.components[i-1]); 
 		                if (points.length == 0){                                 
 		                    var firstPoint = OpenLayers.Control.Trace.LRSInterpolatePointOnSegment( 
 		                        line.components[i-1], 
 		                        line.components[i], 
 		                        (startPos - lastPos )/segLength 
 		                    ); 
 		                    points.push(firstPoint); 
 		                } 
 		                var endPoint = OpenLayers.Control.Trace.LRSInterpolatePointOnSegment( 
 		                    line.components[i-1], 
 		                    line.components[i], 
 		                    (endPos - lastPos)/segLength 
 		                ); 
 		                points.push(endPoint); 
 		                break; 
 		            }   
 		        } 
 		        if (reverseFlag){ 
 		            points.reverse(); 
 		        } 
 		        subString = new OpenLayers.Geometry.LineString(points); 
 		    }  
 		    return subString; 
 		};   
 		 
 		/** 
 		 * Method: LRSSubstringBetweenPoints 
 		 * Get the part line between two points 
 		 * Parameters: 
 		 * line - {<OpenLayers.Geometry.LineString>} 
 		 * startPoint - {<OpenLayers.Geometry.Point>} 
 		 * endPoint - {<OpenLayers.Geometry.Point>} 
 		 * tolerance - float 
 		 * Retruns: 
 		 * {<OpenLayers.Geometry.LineString>} 
 		 */ 
 		OpenLayers.Control.Trace.LRSSubstringBetweenPoints = function(line,startPoint,endPoint,tolerance){ 
 		    var start =  OpenLayers.Control.Trace.LRSMeasure(line,startPoint,{tolerance:tolerance}); 
 		    var end =  OpenLayers.Control.Trace.LRSMeasure(line,endPoint,{tolerance:tolerance}); 
 		    var substring; 
 		    if (start < end ) { 
 		        substring = OpenLayers.Control.Trace.LRSSubstring(line,start,end); 
 		    } else { 
 		        substring = OpenLayers.Control.Trace.LRSSubstring(line,end,start); 
 		        substring.components.reverse(); 
 		    } 
 		    return substring; 
 		}; 