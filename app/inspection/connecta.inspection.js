define([
    'angular'
], function (angular) {
    var inspection = angular.module('connecta.inspection', ['ui.bootstrap']);

    inspection.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('inspection/inspection');
        $translatePartialLoaderProvider.addPart('inspection/person');
        $translatePartialLoaderProvider.addPart('inspection/instrument');
    });

    inspection.run(function (applications) {
        var appInspection = applications.inspection;

        inspection.lazy.value('inspectionResource', {
            base: appInspection.host,
            inspection: appInspection.host + '/inspection',
            person: appInspection.host + '/person',
            instrument: appInspection.host + '/instrument'
        });

    });

    inspection._routes = {
        '/inspection': {
            controller: 'InspectionListController',
            controllerUrl: 'inspection/inspection/controller/inspection-list',
            templateUrl: 'app/inspection/inspection/template/inspection-list.html'
        },
        '/inspection/new': {
            controller: 'InspectionFormController',
            controllerUrl: 'inspection/inspection/controller/inspection-form',
            templateUrl: 'app/inspection/inspection/template/inspection-form.html'
        },
        '/inspection/person': {
            controller: 'PersonListController',
            controllerUrl: 'inspection/person/controller/person-list',
            templateUrl: 'app/inspection/person/template/person-list.html'
        },
        '/inspection/person/new': {
            controller: 'PersonFormController',
            controllerUrl: 'inspection/person/controller/person-form',
            templateUrl: 'app/inspection/person/template/person-form.html'
        },
        '/inspection/person/:id': {
            controller: 'PersonViewController',
            controllerUrl: 'inspection/person/controller/person-view',
            templateUrl: 'app/inspection/person/template/person-view.html'
        },
        '/inspection/person/:id/edit': {
            controller: 'PersonFormController',
            controllerUrl: 'inspection/person/controller/person-form',
            templateUrl: 'app/inspection/person/template/person-form.html'
        },
        '/inspection/instrument': {
            controller: 'InstrumentListController',
            controllerUrl: 'inspection/instrument/controller/instrument-list',
            templateUrl: 'app/inspection/instrument/template/instrument-list.html'
        },
        '/inspection/instrument/new': {
            controller: 'InstrumentFormController',
            controllerUrl: 'inspection/instrument/controller/instrument-form',
            templateUrl: 'app/inspection/instrument/template/instrument-form.html'
        },
        '/inspection/instrument/:id': {
            controller: 'InstrumentViewController',
            controllerUrl: 'inspection/instrument/controller/instrument-view',
            templateUrl: 'app/inspection/instrument/template/instrument-view.html'
        },
        '/inspection/instrument/:id/edit': {
            controller: 'InstrumentFormController',
            controllerUrl: 'inspection/instrument/controller/instrument-form',
            templateUrl: 'app/inspection/instrument/template/instrument-form.html'
        }

    };

    inspection._menu = [
        {
            href: 'inspection',
            title: 'INSPECTION.INSPECTIONS',
            icon: 'icon-settings',
            children: []
        },
        {
            href: 'inspection/person',
            title: 'PERSON.PEOPLE',
            icon: 'icon-settings',
            children: []
        },
        {
            href: 'inspection/instrument',
            title: 'INSTRUMENT.INSTRUMENTS',
            icon: 'icon-settings',
            children: []
        }
    ];

    return inspection;
});
