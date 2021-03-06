define([
    'angular',
    'bower_components/angular-chart.js/dist/angular-chart'
], function (angular) {
    var presenter = angular.module('connecta.presenter', ['chart.js']);

    presenter._configKey = 'presenter';

    presenter.config(function ($translatePartialLoaderProvider, ChartJsProvider) {
        $translatePartialLoaderProvider.addPart('presenter/datasource');
        $translatePartialLoaderProvider.addPart('presenter/singlesource');
        $translatePartialLoaderProvider.addPart('presenter/analysis');
        $translatePartialLoaderProvider.addPart('presenter/viewer');

        //default config chartjs
        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero:true,
                        callback: function(label, index, labels) {
                            if(!isNaN(label)){
                                if(label > 999){
                                    return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                }else if(label > 0 && label < 1){
                                    return label.toFixed(1);
                                }
                            }
                            return label;
                        }
                    }
                }],
                xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
         });
    });

    presenter.value('fileExtensions', {
        JPG: {fileType: 'IMAGE', mimeTypes: ['image/jpeg', 'image/pjpeg']},
        PNG: {fileType: 'IMAGE', mimeTypes: ['image/png']},
        MP4: {fileType: 'VIDEO', mimeTypes: ['video/mp4']},
        XLS: {fileType: 'BINARY', mimeTypes: ['application/excel']},
        DOC: {fileType: 'BINARY', mimeTypes: ['application/msword']},
        DOCX: {fileType: 'BINARY', mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']},
        PPT: {fileType: 'BINARY'},
        PPTX: {fileType: 'BINARY'}
    });

    presenter.run(function (applications) {
        var appPresenter = applications.presenter;

        presenter.lazy.value('presenterConfig', appPresenter);

        // Configurando os resources do backend
        presenter.lazy.value('presenterResources', {
            datasource: appPresenter.host + '/datasource',
            analysis: appPresenter.host + '/analysis',
            singlesource: appPresenter.host + '/media',
            attribute: appPresenter.host + '/attribute',
            hierarchy: appPresenter.host + '/hierarchy',
            hierarchyItem: appPresenter.host + '/hierarchy/hierarchy-item',
            group: appPresenter.host + '/group',
            viewer: appPresenter.host + '/viewer',
            publicViewer: appPresenter.host + 'viewer/public',
            webSocket: appPresenter.host + '/analysisSocket',
            publicWebSocket: appPresenter.host + '/publicAnalysisSocket'
        });
    });

    presenter._routes = {
        '/presenter': {
            controller: 'DatasourceListController',
            controllerUrl: 'presenter/datasource/controller/datasource-list',
            templateUrl: 'app/presenter/datasource/template/datasource-list.html'
        },
        '/presenter/datasource': {
            controller: 'DatasourceListController',
            controllerUrl: 'presenter/datasource/controller/datasource-list',
            templateUrl: 'app/presenter/datasource/template/datasource-list.html'
        },
        '/presenter/datasource/new': {
            controller: 'DatasourceFormController',
            controllerUrl: 'presenter/datasource/controller/datasource-form',
            templateUrl: 'app/presenter/datasource/template/datasource-form.html'
        },
        '/presenter/datasource/:id': {
            controller: 'DatasourceViewController',
            controllerUrl: 'presenter/datasource/controller/datasource-view',
            templateUrl: 'app/presenter/datasource/template/datasource-view.html'
        },
        '/presenter/datasource/:id/edit': {
            controller: 'DatasourceFormController',
            controllerUrl: 'presenter/datasource/controller/datasource-form',
            templateUrl: 'app/presenter/datasource/template/datasource-form.html'
        },
        '/presenter/singlesource': {
            controller: 'SingleSourceListController',
            controllerUrl: 'presenter/singlesource/controller/single-source-list',
            templateUrl: 'app/presenter/singlesource/template/single-source-list.html'
        },
        '/presenter/singlesource/new': {
            controller: 'SingleSourceFormController',
            controllerUrl: 'presenter/singlesource/controller/single-source-form',
            templateUrl: 'app/presenter/singlesource/template/single-source-form.html'
        },
        '/presenter/singlesource/:id': {
            controller: 'SingleSourceViewController',
            controllerUrl: 'presenter/singlesource/controller/single-source-view',
            templateUrl: 'app/presenter/singlesource/template/single-source-view.html'
        },
        '/presenter/singlesource/:id/edit': {
            controller: 'SingleSourceFormController',
            controllerUrl: 'presenter/singlesource/controller/single-source-form',
            templateUrl: 'app/presenter/singlesource/template/single-source-form.html'
        },
        '/presenter/analysis': {
            controller: 'AnalysisListController',
            controllerUrl: 'presenter/analysis/controller/analysis-list',
            templateUrl: 'app/presenter/analysis/template/analysis-list.html'
        },
        '/presenter/analysis/new': {
            controller: 'AnalysisFormController',
            controllerUrl: 'presenter/analysis/controller/analysis-form',
            templateUrl: 'app/presenter/analysis/template/analysis-form.html'
        },
        '/presenter/analysis/new/datasource/:datasource': {
            controller: 'AnalysisFormController',
            controllerUrl: 'presenter/analysis/controller/analysis-form',
            templateUrl: 'app/presenter/analysis/template/analysis-form.html'
        },
        '/presenter/analysis/:id': {
            controller: 'AnalysisViewController',
            controllerUrl: 'presenter/analysis/controller/analysis-view',
            templateUrl: 'app/presenter/analysis/template/analysis-view.html'
        },
        '/presenter/analysis/:id/edit': {
            controller: 'AnalysisFormController',
            controllerUrl: 'presenter/analysis/controller/analysis-form',
            templateUrl: 'app/presenter/analysis/template/analysis-form.html'
        },
        '/presenter/viewer/new/:type/:template': {
            controller: 'ViewerFormController',
            controllerUrl: 'presenter/viewer/controller/viewer-form',
            templateUrl: 'app/presenter/viewer/template/viewer-form.html'
        },
        '/presenter/viewer/new/:type/:template/analysis/:analysis': {
            controller: 'ViewerFormController',
            controllerUrl: 'presenter/viewer/controller/viewer-form',
            templateUrl: 'app/presenter/viewer/template/viewer-form.html'
        },
        '/presenter/viewer/new': {
            controller: 'ViewerFormController',
            controllerUrl: 'presenter/viewer/controller/viewer-form',
            templateUrl: 'app/presenter/viewer/template/viewer-form.html'
        },
        '/presenter/viewer/template': {
            controller: 'TemplateController',
            controllerUrl: 'presenter/viewer/controller/template',
            templateUrl: 'app/presenter/viewer/template/template.html'
        },
        '/presenter/viewer': {
            controller: 'ViewerListController',
            controllerUrl: 'presenter/viewer/controller/viewer-list',
            templateUrl: 'app/presenter/viewer/template/viewer-list.html'
        },
        '/presenter/viewer/:id/edit/dashboard/:dashborad': {
            controller: 'ViewerFormController',
            controllerUrl: 'presenter/viewer/controller/viewer-form',
            templateUrl: 'app/presenter/viewer/template/viewer-form.html'
        },
        '/presenter/viewer/:id/edit': {
            controller: 'ViewerFormController',
            controllerUrl: 'presenter/viewer/controller/viewer-form',
            templateUrl: 'app/presenter/viewer/template/viewer-form.html'
        },
        '/presenter/viewer/:id': {
            controller: 'ViewerViewController',
            controllerUrl: 'presenter/viewer/controller/viewer-view',
            templateUrl: 'app/presenter/viewer/template/viewer-view.html'
        },
        '/presenter/viewer/analysis/:analysis': {
            controller: 'ViewerListController',
            controllerUrl: 'presenter/viewer/controller/viewer-list',
            templateUrl: 'app/presenter/viewer/template/viewer-list.html'
        },
    };

    presenter._menu = [
        {
            title: 'DATASOURCE.ANALYSIS_SOURCE',
            icon: 'icon-database2',
            href: 'presenter/datasource'
        },
        {
            href: 'presenter/analysis',
            title: 'ANALYSIS.ANALYSIS',
            icon: 'icon-analysis',
            children: []
        },
        {
            href: 'presenter/viewer',
            title: 'VIEWER.VIEWERS',
            icon: 'icon-viewer',
            children: []
        },
        {
            title: 'SINGLESOURCE.MEDIA',
            icon: 'icon-perm-media',
            href: 'presenter/singlesource',
            children: []
        }
    ];

    return presenter;
});
