/* global require */
require.config({
    paths: {
        'package':'../package.json',
        'bower_components': '../bower_components',
        'text': '../bower_components/requirejs-text/text',
        'json': '../bower_components/requirejs-json/json',
        'domReady': '../bower_components/requirejs-domready/domReady',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'angular': '../bower_components/angular/angular.min',
        'angular-route': '../bower_components/angular-route/angular-route.min',
        'angular-resource': '../bower_components/angular-resource/angular-resource.min',
        'angular-ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-ng-table': '../bower_components/ng-table/ng-table.min',
        'portal': 'portal',
        'collector': 'collector',
        'speaknow': 'speaknow',
        'presenter': 'presenter',
        'maps': 'maps',
        'connecta.portal': 'portal/connecta.portal',
        'connecta.collector': 'collector/connecta.collector',
        'connecta.speaknow': 'speaknow/connecta.speaknow',
        'connecta.presenter': 'presenter/connecta.presenter',
        'connecta.maps': 'maps/connecta.maps',
        'connecta.inspection': 'inspection/connecta.inspection',
        'leaflet': '../bower_components/leaflet/dist/leaflet',
        'esri-leaflet': '../bower_components/esri-leaflet/dist/esri-leaflet',
        'angular-tree-control' : '../bower_components/angular-tree-control/angular-tree-control',
        'angularjs-slider': '../bower_components/angularjs-slider/dist/rzslider.min',
        'chart' : '../bower_components/chart.js/dist/Chart.min'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-ui-bootstrap': {
            deps: ['angular']
        },
        'bower_components/angular-ui-utils/ui-utils': {
            deps: ['angular']
        },
        'bower_components/angular-animate/angular-animate.min': {
            deps: ['angular']
        },
        'bower_components/angular-cookies/angular-cookies.min': {
            deps: ['angular']
        },
        'bower_components/angular-touch/angular-touch.min': {
            deps: ['angular']
        },
        'bower_components/angular-i18n/angular-locale_pt-br': {
            deps: ['angular']
        },
        'bower_components/angular-translate/angular-translate.min': {
            deps: ['angular']
        },
//        'bower_components/angular-facebook/lib/angular-facebook': {
//            deps: ['angular']
//        },
        'bower_components/angular-scroll/angular-scroll.min': {
            deps: ['angular']
        },
        'bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min': {
            deps: [
                'angular',
                'bower_components/angular-translate/angular-translate.min'
            ]
        },
        'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min': {
            deps: [
                'angular',
                'bower_components/angular-translate/angular-translate.min'
            ]
        },
        'bower_components/angular-messages/angular-messages.min': {
            deps: ['angular']
        },
        'bower_components/ng-file-upload/ng-file-upload-shim.min': {
            deps: ['angular']
        },
        'bower_components/angular-ui-tree/dist/angular-ui-tree.min': {
            deps: ['angular']
        },
        'bower_components/javascript-detect-element-resize/detect-element-resize': {
            deps: []
        },
        'bower_components/angular-gridster/src/angular-gridster': {
            deps: [
                'angular',
                'bower_components/javascript-detect-element-resize/detect-element-resize'
            ]
        },
        'bower_components/html2canvas/build': {
            exports: 'Html2canvas'
        },
         'angular-ng-table': {
            deps: ['angular']
        },
        'angular-tree-control' : {
            deps : ['angular']
        },
        'bower_components/ngDraggable/ngDraggable': {
            deps: ['angular']
        },
        'bower_components/ng-tags-input/ng-tags-input': {
            deps: ['angular']
        },
        'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min': {
            deps: ['angular']
        },
        'bower_components/angular-show-on-konami-code/angular-show-on-konami-code': {
            deps: ['angular']
        },
        'bower_components/jquery-ui-custom/index': {
            deps: ['jquery']
        },
        'bower_components/bootstrap/dist/js/bootstrap.min': {
            deps: ['jquery']
        },
        'esri-leaflet' : {
            deps : ['leaflet']
        },
        'connecta': {
            deps: [
                'angular',
                'jquery',
                'bower_components/jquery-ui-custom/index',
                'bower_components/bootstrap/dist/js/bootstrap.min'
            ]
        },
        'bower_components/sockjs/sockjs.min': {
            deps: [
                'angular'
            ]
        },
        'bower_components/stomp-websocket/lib/stomp.min': {
            deps: [
                'angular',
                'bower_components/sockjs/sockjs.min'
            ]
        },
        'bower_components/angular-chart.js/dist/angular-chart': {
            deps: [
                'angular',
                'chart'
            ]
        }
    }
});

require(['connecta']);
