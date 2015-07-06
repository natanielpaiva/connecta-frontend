define([
    'angular',
    'angular-ui-bootstrap'
], function (angular) {
    var datamodel = angular.module('connecta.datamodel', [
        'ui.bootstrap.tooltip',
        'ui.bootstrap.popover'
    ]);

    datamodel.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('datamodel/datasource');
        $translatePartialLoaderProvider.addPart('datamodel/interaction');
    });

    datamodel.run(function (applications) {
        var appDatamodel = applications.datamodel;

        datamodel.lazy.value('datamodelConfig', appDatamodel);

        // Configurando os resources do backend
        datamodel.lazy.value('datamodelResources', {
            datasource: appDatamodel.host + '/datasource'
        });
    });

    datamodel._routes = {
        '/datamodel': {
            controller: 'DatasourceListController',
            controllerUrl: 'datamodel/datasource/controller/datasource-list',
            templateUrl: 'app/datamodel/datasource/template/datasource-list.html'
        },
        '/datamodel/datasource': {
            controller: 'DatasourceListController',
            controllerUrl: 'datamodel/datasource/controller/datasource-list',
            templateUrl: 'app/datamodel/datasource/template/datasource-list.html'
        },
        '/datamodel/datasource/new': {
            controller: 'DatasourceFormController',
            controllerUrl: 'datamodel/datasource/controller/datasource-form',
            templateUrl: 'app/datamodel/datasource/template/datasource-form.html'
        },
        '/datamodel/datasource/:id': {
            controller: 'DatasourceViewController',
            controllerUrl: 'datamodel/datasource/controller/datasource-view',
            templateUrl: 'app/datamodel/datasource/template/datasource-view.html'
        },
        '/datamodel/datasource/:id/edit': {
            controller: 'DatasourceFormController',
            controllerUrl: 'datamodel/datasource/controller/datasource-form',
            templateUrl: 'app/datamodel/datasource/template/datasource-form.html'
        },
        /**
         * Interaction
         */
        '/datamodel/interaction/new': {
            controller: 'InteractionFormController',
            controllerUrl: 'datamodel/interaction/controller/interaction-form',
            templateUrl: 'app/datamodel/interaction/template/interaction-form.html'
        },
    };

    datamodel._menu = [
        {
            href: 'datamodel/domain',
            title: 'ANALYSIS.ANALYSIS',
            icon: 'icon-analysis',
            children: []
        },
        {
            title: 'DATASOURCE.DATASOURCE',
            icon: 'icon-database2',
            children: [
                {
                    href: 'datamodel/datasource',
                    title: 'DATASOURCE.ANALYSIS_SOURCE'
                },
                {
                    href: 'datamodel/hierarchy',
                    title: 'HIERARCHY.HIERARCHY_LIST'
                }
            ]
        },
        {
            href: 'datamodel/interaction/new',
            title: 'INTERACTION.INTERACTION',
            icon: 'icon-format-align-center',
            children: []
        }
    ];

    return datamodel;
});
