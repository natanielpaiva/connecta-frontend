/* global require */
require.config({
    paths: {
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
        'datamodel': 'datamodel',
        'connecta.portal': 'portal/connecta.portal',
        'connecta.collector': 'collector/connecta.collector',
        'connecta.speaknow': 'speaknow/connecta.speaknow',
        'connecta.presenter': 'presenter/connecta.presenter',
        'connecta.maps': 'maps/connecta.maps',
        'connecta.datamodel': 'datamodel/connecta.datamodel'
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
        'bower_components/amcharts-angular/dist/amChartsDirective': {
            deps: [
                'angular',
                'bower_components/amcharts/dist/amcharts/amcharts'
            ]
        },
        'angular-ng-table': {
            deps: ['angular']
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
        'connecta': {
            deps: [
                'angular',
                'jquery',
                'bower_components/jquery-ui-custom/index',
                'bower_components/bootstrap/dist/js/bootstrap.min',
                'search-expression'
            ]
        }
    }
});

require(['connecta']);
