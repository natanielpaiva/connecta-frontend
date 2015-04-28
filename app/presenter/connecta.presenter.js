define([
    'angular'
], function (angular) {
    var presenter = angular.module('connecta.presenter', [
        
    ]);

    presenter.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('presenter/datasource');
        $translatePartialLoaderProvider.addPart('presenter/singlesource');
        $translatePartialLoaderProvider.addPart('presenter/analysis');
        $translatePartialLoaderProvider.addPart('presenter/group');
//        $translatePartialLoaderProvider.addPart('presenter/hierarchy');
        $translatePartialLoaderProvider.addPart('presenter/network');
        $translatePartialLoaderProvider.addPart('presenter/viewer');
    });

    presenter.value("fileExtensions", {
        JPG: {fileType: 'IMAGE', mimeTypes: ["image/jpeg", "image/pjpeg"]},
        PNG: {fileType: 'IMAGE', mimeTypes: ["image/png"]},
        MP4: {fileType: 'VIDEO', mimeTypes: ["video/mp4"]},
        XLS: {fileType: 'BINARY', mimeTypes: ["application/excel"]},
        DOC: {fileType: 'BINARY', mimeTypes: ["application/msword"]},
        DOCX: {fileType: 'BINARY', mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]},
        PPT: {fileType: 'BINARY'},
        PPTX: {fileType: 'BINARY'}
    });

    presenter.run(function (applications) {
        var appPresenter = applications.filter(function (app) {
            return app.name === 'presenter';
        }).pop();

        presenter.lazy.value('presenterConfig', appPresenter);

        // Configurando os resources do backend
        presenter.lazy.value('presenterResources', {
            datasource: appPresenter.host + '/datasource',
            analysis: appPresenter.host + '/analysis',
            singlesource: appPresenter.host + '/media',
            attribute: appPresenter.host + '/attribute',
            hierarchy: appPresenter.host + '/hierarchy',
            hierarchyItem: appPresenter.host + '/hierarchy/hierarchy-item',
            group: appPresenter.host + '/group'
        });
    });

    presenter._routes = {
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
        '/presenter/analysis/new': {
            controller: 'AnalysisFormController',
            controllerUrl: 'presenter/analysis/controller/analysis-form',
            templateUrl: 'app/presenter/analysis/template/analysis-form.html'
        },
        '/presenter/group': {
            controller: 'GroupListController',
            controllerUrl: 'presenter/group/controller/group-list',
            templateUrl: 'app/presenter/group/template/group-list.html'
        },
        '/presenter/group/new': {
            controller: 'GroupFormController',
            controllerUrl: 'presenter/group/controller/group-form',
            templateUrl: 'app/presenter/group/template/group-form.html'
        },
        '/presenter/group/:id': {
            controller: 'GroupViewController',
            controllerUrl: 'presenter/group/controller/group-view',
            templateUrl: 'app/presenter/group/template/group-view.html'
        },
        '/presenter/group/:id/edit': {
            controller: 'GroupFormController',
            controllerUrl: 'presenter/group/controller/group-form',
            templateUrl: 'app/presenter/group/template/group-form.html'
        },
        '/presenter/hierarchy': {
            controller: 'HierarchyListController',
            controllerUrl: 'presenter/hierarchy/controller/hierarchy-list',
            templateUrl: 'app/presenter/hierarchy/template/hierarchy-list.html'
        },
        '/presenter/hierarchy/new': {
            controller: 'HierarchyFormController',
            controllerUrl: 'presenter/hierarchy/controller/hierarchy-form',
            templateUrl: 'app/presenter/hierarchy/template/hierarchy-form.html'
        },
        '/presenter/hierarchy/:id/edit': {
            controller: 'HierarchyFormController',
            controllerUrl: 'presenter/hierarchy/controller/hierarchy-form',
            templateUrl: 'app/presenter/hierarchy/template/hierarchy-form.html'
        }
    };
    
    presenter._menu = [
        {
            href: 'presenter/analysis',
            title: 'ANALYSIS.ANALYSIS',
            icon: 'icon-analysis',
            children: []
        },
        {
            title: 'DATASOURCE.DATASOURCE',
            icon: 'icon-database2',
            children: [
                {
                    href: 'presenter/datasource',
                    title: 'DATASOURCE.ANALYSIS_SOURCE'
                },
                {
                    href: 'presenter/group',
                    title: 'GROUP.GROUPS'
                },
                {
                    href: 'presenter/hierarchy',
                    title: 'HIERARCHY.HIERARCHY_LIST'
                },
                {
                    href: 'presenter/singlesource',
                    title: 'SINGLESOURCE.MEDIA'
                }
            ]
        },
        {
            href: 'presenter/viewer',
            title: 'VIEWER.VIEWERS',
            icon: 'icon-viewer',
            children: []
        },
        {
            href: 'presenter/network',
            title: 'NETWORK.NETWORKS',
            icon: 'icon-networks',
            children: []
        }
    ];

    return presenter;
});