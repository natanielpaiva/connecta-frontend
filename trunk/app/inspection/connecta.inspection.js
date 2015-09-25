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
        $translatePartialLoaderProvider.addPart('inspection/client');
        $translatePartialLoaderProvider.addPart('inspection/client-address');
        $translatePartialLoaderProvider.addPart('inspection/document');
        $translatePartialLoaderProvider.addPart('inspection/medias');
        $translatePartialLoaderProvider.addPart('inspection/expense');
        
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
            project: appInspection.host + '/project',
            client: appInspection.host + '/client',
            clientAddress: appInspection.host + '/clientAddress',
            document: appInspection.host + '/document',
            expense: appInspection.host + '/expense'
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
        /*
         * Person
         */
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
        /*
         * Client
         */
        '/inspection/client': {
            controller: 'ClientListController',
            controllerUrl: 'inspection/client/controller/client-list',
            templateUrl: 'app/inspection/client/template/client-list.html'
        },
        '/inspection/client/new': {
            controller: 'ClientFormController',
            controllerUrl: 'inspection/client/controller/client-form',
            templateUrl: 'app/inspection/client/template/client-form.html'
        },
        '/inspection/client/:id': {
            controller: 'ClientViewController',
            controllerUrl: 'inspection/client/controller/client-view',
            templateUrl: 'app/inspection/client/template/client-view.html'
        },
        '/inspection/client/:id/edit': {
            controller: 'ClientFormController',
            controllerUrl: 'inspection/client/controller/client-form',
            templateUrl: 'app/inspection/client/template/client-form.html'
        },
        /*
         * Instrument
         */
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
        /*
         * Supplier
         */
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
        /*
         * Supplier Address
         */
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
            controller: 'ExpenseFormController',
            controllerUrl: 'inspection/expense/controller/expense-form',
            templateUrl: 'app/inspection/expense/template/expense-form.html'
        },
        /**
         * Expense
         */
        '/inspection/expense': {
            controller: 'ExpenseListController',
            controllerUrl: 'inspection/expense/controller/expense-list',
            templateUrl: 'app/inspection/expense/template/expense-list.html'
        },
        '/inspection/expense/new': {
            controller: 'ExpenseFormController',
            controllerUrl: 'inspection/expense/controller/expense-form',
            templateUrl: 'app/inspection/expense/template/expense-form.html'
        },
        '/inspection/expense/:id': {
            controller: 'ExpenseViewController',
            controllerUrl: 'inspection/expense/controller/expense-view',
            templateUrl: 'app/inspection/expense/template/expense-view.html'
        },
        '/inspection/expense/:id/edit': {
            controller: 'ExpenseFormController',
            controllerUrl: 'inspection/expense/controller/expense-form',
            templateUrl: 'app/inspection/expense/template/expense-form.html'
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
        },
        /**
         * DOCUMENT
         */
         '/inspection/document': {
            controller: 'DocumentListController',
            controllerUrl: 'inspection/document/controller/document-list',
            templateUrl: 'app/inspection/document/template/document-list.html'
        },
        '/inspection/document/new': {
            controller: 'DocumentFormController',
            controllerUrl: 'inspection/document/controller/document-form',
            templateUrl: 'app/inspection/document/template/document-form.html'
        },
        '/inspection/document/:id': {
            controller: 'DocumentViewController',
            controllerUrl: 'inspection/document/controller/document-view',
            templateUrl: 'app/inspection/document/template/document-view.html'
        },
        '/inspection/document/:id/edit': {
            controller: 'DocumentFormController',
            controllerUrl: 'inspection/document/controller/document-form',
            templateUrl: 'app/inspection/document/template/document-form.html'
        },
        /**
         * MEDIA
         */
         '/inspection/medias': {
            controller: 'MediaListController',
            controllerUrl: 'inspection/medias/controller/media-list',
            templateUrl: 'app/inspection/medias/template/media-list.html'
        },
        '/inspection/medias/new': {
            controller: 'MediaFormController',
            controllerUrl: 'inspection/medias/controller/media-form',
            templateUrl: 'app/inspection/medias/template/media-form.html'
        },
        '/inspection/medias/:id': {
            controller: 'MediaViewController',
            controllerUrl: 'inspection/medias/controller/media-view',
            templateUrl: 'app/inspection/medias/template/media-view.html'
        },
        '/inspection/medias/:id/edit': {
            controller: 'MediaFormController',
            controllerUrl: 'inspection/medias/controller/media-form',
            templateUrl: 'app/inspection/medias/template/media-form.html'
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
                    href: 'inspection/document',
                    title: 'DOCUMENT.DOCUMENT',
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
                    href: 'inspection/medias',
                    title: 'MEDIA.MEDIA',
                    icon: 'icon-settings',
                    children: []
                },
                {
                    href: 'inspection/supplier',
                    title: 'SUPPLIER.SUPPLIERS',
                    icon: 'icon-settings',
                    children: []
                },
                {
                    href: 'inspection/client',
                    title: 'CLIENT.CLIENTS',
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
                    href: 'inspection/expense',
                    title: 'EXPENSE.EXPENSES',
                    icon: 'icon-settings',
                    children: []
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