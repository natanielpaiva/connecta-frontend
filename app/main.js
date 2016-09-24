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
//        'angular-facebook': '../bower_components/angular-facebook/lib/angular-facebook',
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
        'leaflet': '../node_modules/leaflet/dist/leaflet',
        'esri-leaflet': '../node_modules/esri-leaflet/dist/esri-leaflet',
        'angular-tree-control' : '../bower_components/angular-tree-control/angular-tree-control',
        'angularjs-slider': '../bower_components/angularjs-slider/dist/rzslider.min'
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
        'bower_components/ng-file-upload/angular-file-upload.min': {
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
        'bower_components/angular-redactor/angular-redactor': {
            deps: [
                'angular',
                'bower_components/imperavi-redactor/redactor/redactor.min'
            ]
        },
        'bower_components/amcharts/dist/amcharts/amcharts': {
            exports: 'AmCharts'
        },
        'bower_components/html2canvas/build': {
            exports: 'Html2canvas'
        },
        'bower_components/amcharts/dist/amcharts/themes/black': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.themes.black'
        },
        'bower_components/amcharts/dist/amcharts/themes/chalk': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.themes.chalk'
        },
        'bower_components/amcharts/dist/amcharts/themes/dark': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.themes.dark'
        },
        'bower_components/amcharts/dist/amcharts/themes/light': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.themes.light'
        },
        'bower_components/amcharts/dist/amcharts/themes/patterns': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.themes.patterns'
        },
        'bower_components/amcharts/dist/amcharts/funnel': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmFunnelChart'
        },
        'bower_components/amcharts/dist/amcharts/gauge': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmAngularGauge'
        },
        'bower_components/amcharts/dist/amcharts/pie': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmPieChart'
        },
        'bower_components/amcharts/dist/amcharts/radar': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmRadarChart'
        },
        'bower_components/amcharts/dist/amcharts/serial': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmSerialChart'
        },
        'bower_components/amcharts/dist/amcharts/xy': {
            deps: ['bower_components/amcharts/dist/amcharts/amcharts'],
            exports: 'AmCharts.AmXYChart'
        },
        'bower_components/angular-amchart-directive/angular-amchart-directive': {
            deps: ['angular',
                'bower_components/amcharts/dist/amcharts/amcharts',
                'bower_components/amcharts/dist/amcharts/pie',
                'bower_components/amcharts/dist/amcharts/serial',
                'bower_components/amcharts/dist/amcharts/xy',
                'bower_components/amcharts/dist/amcharts/radar',
                'bower_components/amcharts/dist/amcharts/gauge',
                'bower_components/amcharts/dist/amcharts/funnel'
            ]
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
        'bower_components/jquery-slimscroll/jquery.slimscroll.min': {
            deps: ['jquery']
        },
        'bower_components/imperavi-redactor/redactor/redactor.min': {
            deps: ['jquery'],
            exports: 'jQuery.fn.redactor'
        },
//        'bower_components/ngAutocomplete/src/ngAutocomplete': {
//            deps: ['angular','bower_components/connectaGeoJS/index/openlayersImplementation/async/async!//maps.googleapis.com/maps/api/js?sensor=false&region=br&libraries=places']
//        },
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
        }
    }
});

require(['connecta']);
