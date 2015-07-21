define([
    'angular'
], function (angular) {
    var inspection = angular.module('connecta.inspection', []);

    inspection.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('inspection/inspection');
        $translatePartialLoaderProvider.addPart('inspection/person');
    });

    inspection.run(function (applications) {
        var appInspection = applications.inspection;

        inspection.lazy.value('inspectionResource', {
            base: appInspection.host,
            inspection: appInspection.host + '/inspection',
            person: appInspection.host + '/person'
        });

    });

    inspection._routes = {
        '/inspection': {
            controller: 'InspectionListController',
            controllerUrl: 'inspection/inspection/controller/inspection-list',
            templateUrl: 'app/inspection/inspection/template/inspection-list.html'
        },
        '/inspection/person': {
            controller: 'PersonListController',
            controllerUrl: 'inspection/person/controller/person-list',
            templateUrl: 'app/inspection/person/template/person-list.html'
        }
    };

    inspection._menu = [
        {
            href: 'inspection',
            title: 'INSPECTION.INSPECTIONS3',
            icon: 'icon-settings',
            children: []
        },
        {
            href: 'inspection/person',
            title: 'PERSON.PEOPLE',
            icon: 'icon-settings',
            children: []
        }
    ];

    return inspection;
});
