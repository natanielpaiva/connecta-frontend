define([
    'angular'
], function (angular) {
    var graph = angular.module('connecta.graph', []);

    graph._configKey = 'graph';

    graph.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('graph/datasource');
        $translatePartialLoaderProvider.addPart('graph/analysis');
        $translatePartialLoaderProvider.addPart('graph/viewer');
        $translatePartialLoaderProvider.addPart('graph/configuration');
    });

    graph.value('fileExtensions', {
        JPG: {fileType: 'IMAGE', mimeTypes: ['image/jpeg', 'image/pjpeg']},
        PNG: {fileType: 'IMAGE', mimeTypes: ['image/png']},
        MP4: {fileType: 'VIDEO', mimeTypes: ['video/mp4']},
        XLS: {fileType: 'BINARY', mimeTypes: ['application/excel']},
        DOC: {fileType: 'BINARY', mimeTypes: ['application/msword']},
        DOCX: {fileType: 'BINARY', mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']},
        PPT: {fileType: 'BINARY'},
        PPTX: {fileType: 'BINARY'}
    });

    graph.run(function (applications) {
        var appGraph = applications.graph;

        graph.lazy.value('graphConfig', appGraph);

        // Configurando os resources do backend
        graph.lazy.value('graphResources', {
            datasource: appGraph.host + '/datasource',
            analysis: appGraph.host + '/analysis',
            viewer: appGraph.host + '/datasource',
            publicViewer: appGraph.host + 'viewer/public',
            configuration: appGraph.host + '/configuration'
        });
    });

    graph._routes = {
        '/graph': {
            controller: 'DatasourceListController',
            controllerUrl: 'graph/datasource/controller/datasource-list',
            templateUrl: 'app/graph/datasource/template/datasource-list.html'
        },
        '/graph/datasource': {
            controller: 'DatasourceListController',
            controllerUrl: 'graph/datasource/controller/datasource-list',
            templateUrl: 'app/graph/datasource/template/datasource-list.html'
        },
        '/graph/datasource/new': {
            controller: 'DatasourceFormController',
            controllerUrl: 'graph/datasource/controller/datasource-form',
            templateUrl: 'app/graph/datasource/template/datasource-form.html'
        },
        '/graph/datasource/:id': {
            controller: 'DatasourceViewController',
            controllerUrl: 'graph/datasource/controller/datasource-view',
            templateUrl: 'app/graph/datasource/template/datasource-view.html'
        },
        '/graph/datasource/:id/edit': {
            controller: 'DatasourceFormController',
            controllerUrl: 'graph/datasource/controller/datasource-form',
            templateUrl: 'app/graph/datasource/template/datasource-form.html'
        },
        '/graph/analysis': {
            controller: 'AnalysisListController',
            controllerUrl: 'graph/analysis/controller/analysis-list',
            templateUrl: 'app/graph/analysis/template/analysis-list.html'
        },
        '/graph/analysis/new': {
            controller: 'AnalysisFormController',
            controllerUrl: 'graph/analysis/controller/analysis-form',
            templateUrl: 'app/graph/analysis/template/analysis-form.html'
        },
        '/graph/analysis/new/datasource/:datasource': {
            controller: 'AnalysisFormController',
            controllerUrl: 'graph/analysis/controller/analysis-form',
            templateUrl: 'app/graph/analysis/template/analysis-form.html'
        },
        '/graph/analysis/:id': {
            controller: 'AnalysisViewController',
            controllerUrl: 'graph/analysis/controller/analysis-view',
            templateUrl: 'app/graph/analysis/template/analysis-view.html'
        },
        '/graph/analysis/:id/edit': {
            controller: 'AnalysisFormController',
            controllerUrl: 'graph/analysis/controller/analysis-form',
            templateUrl: 'app/graph/analysis/template/analysis-form.html'
        },
        '/graph/viewer/new/:type/:template': {
            controller: 'ViewerFormController',
            controllerUrl: 'graph/viewer/controller/viewer-form',
            templateUrl: 'app/graph/viewer/template/viewer-form.html'
        },
        '/graph/viewer/new/:type/:template/analysis/:analysis': {
            controller: 'ViewerFormController',
            controllerUrl: 'graph/viewer/controller/viewer-form',
            templateUrl: 'app/graph/viewer/template/viewer-form.html'
        },
        '/graph/viewer/new': {
            controller: 'ViewerFormController',
            controllerUrl: 'graph/viewer/controller/viewer-form',
            templateUrl: 'app/graph/viewer/template/viewer-form.html'
        },
        '/graph/viewer/template': {
            controller: 'TemplateController',
            controllerUrl: 'graph/viewer/controller/template',
            templateUrl: 'app/graph/viewer/template/template.html'
        },
        '/graph/viewer': {
            controller: 'ViewerListController',
            controllerUrl: 'graph/viewer/controller/viewer-list',
            templateUrl: 'app/graph/viewer/template/viewer-list.html'
        },
        '/graph/viewer/:id/edit/dashboard/:dashborad': {
            controller: 'ViewerFormController',
            controllerUrl: 'graph/viewer/controller/viewer-form',
            templateUrl: 'app/graph/viewer/template/viewer-form.html'
        },
        '/graph/viewer/:id/edit': {
            controller: 'ViewerFormController',
            controllerUrl: 'graph/viewer/controller/viewer-form',
            templateUrl: 'app/graph/viewer/template/viewer-form.html'
        },
        '/graph/viewer/:id': {
            controller: 'ViewerViewController',
            controllerUrl: 'graph/viewer/controller/viewer-view',
            templateUrl: 'app/graph/viewer/template/viewer-view.html'
        },
        '/graph/viewer/analysis/:analysis': {
            controller: 'ViewerListController',
            controllerUrl: 'graph/viewer/controller/viewer-list',
            templateUrl: 'app/graph/viewer/template/viewer-list.html'
        },
        '/graph/configuration': {
            controller: 'ConfigurationFormController',
            controllerUrl: 'graph/configuration/controller/configuration-form',
            templateUrl: 'app/graph/configuration/template/configuration-form.html'
        }
    };

    graph._menu = [
        {
            title: 'DATASOURCE.ANALYSIS_SOURCE',
            icon: 'icon-database2',
            href: 'graph/datasource'
        },
        {
            href: 'graph/analysis',
            title: 'ANALYSIS.ANALYSIS',
            icon: 'icon-analysis',
            children: []
        },
        {
            href: 'graph/viewer',
            title: 'VIEWER.VIEWERS',
            icon: 'icon-viewer',
            children: []
        },
        {
            href: 'graph/configuration',
            title: 'CONFIGURATION.CONFIG',
            icon: 'icon-settings',
            children: []
        }
    ];

    return graph;
});
