define([
    'angular'
], function (angular) {
    var inspection = angular.module('connecta.inspection', ['ui.bootstrap']);

    inspection.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('inspection/inspection');
        $translatePartialLoaderProvider.addPart('inspection/person');
        $translatePartialLoaderProvider.addPart('inspection/instrument');
        $translatePartialLoaderProvider.addPart('inspection/supplier');
        $translatePartialLoaderProvider.addPart('inspection/supplier-address');
        $translatePartialLoaderProvider.addPart('inspection/product-item');
        $translatePartialLoaderProvider.addPart('inspection/project');
    });

    inspection.run(function (applications) {
        var appInspection = applications.inspection;

        inspection.lazy.value('inspectionResource', {
            base: appInspection.host,
            inspection: appInspection.host + '/inspection',
            productItem: appInspection.host + '/product-item',
            person: appInspection.host + '/person',
            instrument: appInspection.host + '/instrument',
            supplier: appInspection.host + '/supplier',
            supplierAddress: appInspection.host + '/supplierAddress',
            project: appInspection.host + '/project'
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
        },
        '/inspection/supplier': {
            controller: 'SupplierListController',
            controllerUrl: 'inspection/supplier/controller/supplier-list',
            templateUrl: 'app/inspection/supplier/template/supplier-list.html'
        },
        '/inspection/supplier/new': {
            controller: 'SupplierFormController',
            controllerUrl: 'inspection/supplier/controller/supplier-form',
            templateUrl: 'app/inspection/supplier/template/supplier-form.html'
        },
        '/inspection/supplier/:id': {
            controller: 'SupplierViewController',
            controllerUrl: 'inspection/supplier/controller/supplier-view',
            templateUrl: 'app/inspection/supplier/template/supplier-view.html'
        },
        '/inspection/supplier/:id/edit': {
            controller: 'SupplierFormController',
            controllerUrl: 'inspection/supplier/controller/supplier-form',
            templateUrl: 'app/inspection/supplier/template/supplier-form.html'
        },
        '/inspection/supplier-address': {
            controller: 'SupplierAddressListController',
            controllerUrl: 'inspection/supplier-address/controller/supplier-address-list',
            templateUrl: 'app/inspection/supplier-address/template/supplier-address-list.html'
        },
        '/inspection/supplier-address/new': {
            controller: 'SupplierAddressFormController',
            controllerUrl: 'inspection/supplier-address/controller/supplier-address-form',
            templateUrl: 'app/inspection/supplier-address/template/supplier-address-form.html'
        },
        '/inspection/supplier-address/:id': {
            controller: 'SupplierAddressViewController',
            controllerUrl: 'inspection/supplier-address/controller/supplier-address-view',
            templateUrl: 'app/inspection/supplier-address/template/supplier-address-view.html'
        },
        '/inspection/supplier-address/:id/edit': {
            controller: 'SupplierAddressFormController',
            controllerUrl: 'inspection/supplier-address/controller/supplier-address-form',
            templateUrl: 'app/inspection/supplier-address/template/supplier-address-form.html'
        },
        /**
         * Product Item
         */
        '/inspection/product/item': {
            controller: 'ProductItemListController',
            controllerUrl: 'inspection/product-item/controller/product-item-list',
            templateUrl: 'app/inspection/product-item/template/product-item-list.html'
        },
        '/inspection/product/item/new': {
            controller: 'ProductItemFormController',
            controllerUrl: 'inspection/product-item/controller/product-item-form',
            templateUrl: 'app/inspection/product-item/template/product-item-form.html'
        },
        '/inspection/product/item/:id': {
            controller: 'ProductItemViewController',
            controllerUrl: 'inspection/product-item/controller/product-item-view',
            templateUrl: 'app/inspection/product-item/template/product-item-view.html'
        },
        '/inspection/product/item/:id/edit': {
            controller: 'ProductItemFormController',
            controllerUrl: 'inspection/product-item/controller/product-item-form',
            templateUrl: 'app/inspection/product-item/template/product-item-form.html'
        },
        /**
         * Project
         */
        '/inspection/project': {
            controller: 'ProjectListController',
            controllerUrl: 'inspection/project/controller/project-list',
            templateUrl: 'app/inspection/project/template/project-list.html'
        },
        '/inspection/project/new': {
            controller: 'ProjectFormController',
            controllerUrl: 'inspection/project/controller/project-form',
            templateUrl: 'app/inspection/project/template/project-form.html'
        },
        '/inspection/project/:id': {
            controller: 'ProjectViewController',
            controllerUrl: 'inspection/product-item/controller/project-view',
            templateUrl: 'app/inspection/product-item/template/project-view.html'
        },
        '/inspection/project/:id/edit': {
            controller: 'ProjectFormController',
            controllerUrl: 'inspection/product-item/controller/project-form',
            templateUrl: 'app/inspection/product-item/template/project-form.html'
        }

    };

    inspection._menu = [
        {
            title: 'INSPECTION.FORM',
            icon: 'icon-settings',
            children: [
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
                },
                {
                    href: 'inspection/project',
                    title: 'PROJECT.PROJECT',
                    icon: 'icon-settings',
                    children: []
                },
                {
                    href: 'inspection/product/item',
                    title: 'PRODUCT_ITEM.PRODUCT_ITEM',
                    icon: 'icon-settings',
                    children: []
                },
                {
                    href: 'inspection/supplier',
                    title: 'SUPPLIER.SUPPLIERS',
                    icon: 'icon-settings',
                    children: []
                }
            ]
        },
        {
            title: 'INSPECTION.INSPECTION',
            icon: 'icon-settings',
            children: [
                {
                    href:'inspection/',
                    title:'INSPECTION.SCHEDULING'
                },
                {
                    href:'inspection/',
                    title:'INSPECTION.COSTS'
                },
                {
                    href:'inspection/',
                    title:'INSPECTION.REQUISITION'
                },
                {
                    href:'inspection',
                    icon: 'icon-settings',
                    title:'INSPECTION.INSPECTIONS'
                }
            ]
        },
        {
            title: 'INSPECTION.DILIGENCE',
            icon: 'icon-settings',
            children: [
                {
                    href:'inspection/',
                    title:'INSPECTION.SCHEDULING'
                },
                {
                    href:'inspection/',
                    title:'INSPECTION.COSTS'
                },
                {
                    href:'inspection/',
                    title:'INSPECTION.REQUISITION'
                },
                {
                    href:'inspection',
                    icon: 'icon-settings',
                    title:'INSPECTION.DILIGENCES'
                }
            ]
        }
    ];

    return inspection;
});
