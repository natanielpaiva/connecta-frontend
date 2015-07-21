define([
    'angular'
], function (angular) {
    var inspection = angular.module('connecta.inspection', []);

    inspection.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('inspection/inspection');
    });

    inspection.run(function (applications) {
        var appInspection = applications.inspection;

        inspection.lazy.value('InspectionResourceURI', {
            base: appInspection.host
        });

    });

    inspection._routes = {
        '/inspection': {
            controller: 'InspectionListController',
            controllerUrl: 'inspection/inspection/controller/inspection-list',
            templateUrl: 'app/inspection/inspection/template/inspection-list.html'
        }
    };

    inspection._menu = [
        {
            href: 'inspection',
            title: 'INSPECTION.INSPECTION',
            icon: 'icon-settings',
            children: []
        }
    ];

    return inspection;
});
