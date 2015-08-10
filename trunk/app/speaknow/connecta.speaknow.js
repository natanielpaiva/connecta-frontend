define([
    'angular'
], function (angular) {
    var speaknow = angular.module('connecta.speaknow', []);

    speaknow.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('speaknow/whatsapp');
        $translatePartialLoaderProvider.addPart('speaknow/contact');
        $translatePartialLoaderProvider.addPart('speaknow/interaction');
        $translatePartialLoaderProvider.addPart('speaknow/action');
        $translatePartialLoaderProvider.addPart('speaknow/company');
        $translatePartialLoaderProvider.addPart('speaknow/product');
        $translatePartialLoaderProvider.addPart('speaknow/company-message');
        $translatePartialLoaderProvider.addPart('speaknow/company-contact');
        $translatePartialLoaderProvider.addPart('speaknow/company-contact-group');
        $translatePartialLoaderProvider.addPart('speaknow/config');
    });

    speaknow.run(function (applications) {
        var appSpeaknow = applications.speaknow;
        var appSpeaknowBatch = applications.speaknowBatch;

        speaknow.lazy.value('speaknowResources', {
            base: appSpeaknow.host,
            action: appSpeaknow.host + '/action',
            config: appSpeaknow.host + '/config',
            contact: appSpeaknow.host + '/contact',
            interaction: appSpeaknow.host + '/interaction',
            company: appSpeaknow.host + '/company',
            companyMessage: appSpeaknow.host + '/company/message',
            product: appSpeaknow.host + '/product',
            contactGroup: appSpeaknow.host + '/contact/group',
            companyContact: appSpeaknow.host + '/company/contact',
            whatsapp: appSpeaknowBatch.host + '/whatsapp',
            whatsappAccount: appSpeaknow.host + '/whatsapp/account'
        });

    });

    speaknow.constant('regexBase64', '.*base64,');

    speaknow._routes = {
        '/speaknow': {
            controller: 'InteractionListController',
            controllerUrl: 'speaknow/interaction/controller/interaction-list',
            templateUrl: 'app/speaknow/interaction/template/interaction-list.html'
        },
        /**
         * URL CONTACTS
         */
        '/speaknow/contact': {
            controller: 'ContactListController',
            controllerUrl: 'speaknow/contact/controller/contact-list',
            templateUrl: 'app/speaknow/contact/template/contact-list.html'
        },
        '/speaknow/contact/new': {
            controller: 'ContactFormController',
            controllerUrl: 'speaknow/contact/controller/contact-form',
            templateUrl: 'app/speaknow/contact/template/contact-form.html'
        },
        '/speaknow/contact/:id': {
            controller: 'ContactViewController',
            controllerUrl: 'speaknow/contact/controller/contact-view',
            templateUrl: 'app/speaknow/contact/template/contact-view.html'
        },
        '/speaknow/contact/:id/edit': {
            controller: 'ContactFormController',
            controllerUrl: 'speaknow/contact/controller/contact-form',
            templateUrl: 'app/speaknow/contact/template/contact-form.html'
        },
        /**
         * URL CONFIG
         */
        '/speaknow/config': {
            controller: 'ConfigViewController',
            controllerUrl: 'speaknow/config/controller/config-view',
            templateUrl: 'app/speaknow/config/template/config-view.html'
        },
        /**
         * URL INTERACTIONS
         */
        '/speaknow/interaction': {
            controller: 'InteractionListController',
            controllerUrl: 'speaknow/interaction/controller/interaction-list',
            templateUrl: 'app/speaknow/interaction/template/interaction-list.html'
        },
        '/speaknow/interaction/new': {
            controller: 'InteractionFormController',
            controllerUrl: 'speaknow/interaction/controller/interaction-form',
            templateUrl: 'app/speaknow/interaction/template/interaction-form.html'
        },
        '/speaknow/interaction/:id': {
            controller: 'InteractionViewController',
            controllerUrl: 'speaknow/interaction/controller/interaction-view',
            templateUrl: 'app/speaknow/interaction/template/interaction-view.html'
        },
        '/speaknow/interaction/:id/edit': {
            controller: 'InteractionFormController',
            controllerUrl: 'speaknow/interaction/controller/interaction-form',
            templateUrl: 'app/speaknow/interaction/template/interaction-form.html'
        },
        /**
         * URL ACTIONS
         */
        '/speaknow/action/new': {
            controller: 'ActionFormController',
            controllerUrl: 'speaknow/action/controller/action-form',
            templateUrl: 'app/speaknow/action/template/action-form.html'
        },
        '/speaknow/action/test': {
            controller: 'ActionTestController',
            controllerUrl: 'speaknow/action/controller/action-lab',
            templateUrl: 'app/speaknow/action/template/action-lab.html'
        },
        '/speaknow/action/:id': {
            controller: 'ActionViewController',
            controllerUrl: 'speaknow/action/controller/action-view',
            templateUrl: 'app/speaknow/action/template/action-view.html'
        },
        '/speaknow/action/:id/data': {
            controller: 'ActionDataAnalysisController',
            controllerUrl: 'speaknow/action/controller/action-data',
            templateUrl: 'app/speaknow/action/template/action-data.html'
        },
        '/speaknow/action/:id/edit': {
            controller: 'ActionFormController',
            controllerUrl: 'speaknow/action/controller/action-form',
            templateUrl: 'app/speaknow/action/template/action-form.html'
        },
        /**
         * URL COMPANY MESSAGE
         */
        '/speaknow/company/message': {
            controller: 'CompanyMessageListController',
            controllerUrl: 'speaknow/company-message/controller/company-message-list',
            templateUrl: 'app/speaknow/company-message/template/company-message-list.html'
        },
        '/speaknow/company/message/:id': {
            controller: 'CompanyMessageViewController',
            controllerUrl: 'speaknow/company-message/controller/company-message-view',
            templateUrl: 'app/speaknow/company-message/template/company-message-view.html'
        },
        /**
         * URL COMPANY
         */
        '/speaknow/company': {
            controller: 'CompanyListController',
            controllerUrl: 'speaknow/company/controller/company-list',
            templateUrl: 'app/speaknow/company/template/company-list.html'
        },
        '/speaknow/company/new': {
            controller: 'CompanyFormController',
            controllerUrl: 'speaknow/company/controller/company-form',
            templateUrl: 'app/speaknow/company/template/company-form.html'
        },
        '/speaknow/company/:id': {
            controller: 'CompanyViewController',
            controllerUrl: 'speaknow/company/controller/company-view',
            templateUrl: 'app/speaknow/company/template/company-view.html'
        },
        '/speaknow/company/:id/edit': {
            controller: 'CompanyFormController',
            controllerUrl: 'speaknow/company/controller/company-form',
            templateUrl: 'app/speaknow/company/template/company-form.html'
        },
        /**
         * URL COMPANY CONTACT GROUP
         */
        '/speaknow/company/contact/group/new': {
            controller: 'ContactGroupFormController',
            controllerUrl: 'speaknow/company-contact-group/controller/contact-group-form',
            templateUrl: 'app/speaknow/company-contact-group/template/contact-group-form.html'
        },
        '/speaknow/company/contact/group/:id': {
            controller: 'ContactGroupViewController',
            controllerUrl: 'speaknow/company-contact-group/controller/contact-group-view',
            templateUrl: 'app/speaknow/company-contact-group/template/contact-group-view.html'
        },
        '/speaknow/company/contact/group/:id/edit': {
            controller: 'ContactGroupFormController',
            controllerUrl: 'speaknow/company-contact-group/controller/contact-group-form',
            templateUrl: 'app/speaknow/company-contact-group/template/contact-group-form.html'
        },
        /**
         * URL COMPANY CONTACT 
         */
        '/speaknow/company/contact/new': {
            controller: 'CompanyContactFormController',
            controllerUrl: 'speaknow/company-contact/controller/company-contact-form',
            templateUrl: 'app/speaknow/company-contact/template/company-contact-form.html'
        },
        '/speaknow/company/contact/:id': {
            controller: 'CompanyContactViewController',
            controllerUrl: 'speaknow/company-contact/controller/company-contact-view',
            templateUrl: 'app/speaknow/company-contact/template/company-contact-view.html'
        },
        '/speaknow/company/contact/:id/edit': {
            controller: 'CompanyContactFormController',
            controllerUrl: 'speaknow/company-contact/controller/company-contact-form',
            templateUrl: 'app/speaknow/company-contact/template/company-contact-form.html'
        },
        /**
         * URL PRODUCT
         */
        '/speaknow/product/': {
            controller: 'ProductList',
            controllerUrl: 'speaknow/product/controller/product-list',
            templateUrl: 'app/speaknow/product/template/product-list.html'
        },
        '/speaknow/product/new': {
            controller: 'ProductForm',
            controllerUrl: 'speaknow/product/controller/product-form',
            templateUrl: 'app/speaknow/product/template/product-form.html'
        },
        '/speaknow/product/:id': {
            controller: 'ProductViewController',
            controllerUrl: 'speaknow/product/controller/product-view',
            templateUrl: 'app/speaknow/product/template/product-view.html'
        },
        '/speaknow/product/:id/edit': {
            controller: 'ProductForm',
            controllerUrl: 'speaknow/product/controller/product-form',
            templateUrl: 'app/speaknow/product/template/product-form.html'
        },
        /**
         * URL WHATSAPP ACCOUNTS
         */
        '/speaknow/whatsapp/default': {
            controller: 'AccountDefaultList',
            controllerUrl: 'speaknow/whatsapp/controller/account-default-list',
            templateUrl: 'app/speaknow/whatsapp/template/account-default-list.html'
        },
        '/speaknow/whatsapp/': {
            controller: 'WhatsappAccountList',
            controllerUrl: 'speaknow/whatsapp/controller/whatsapp-list',
            templateUrl: 'app/speaknow/whatsapp/template/whatsapp-list.html'
        },
        '/speaknow/whatsapp/new': {
            controller: 'WhatsappForm',
            controllerUrl: 'speaknow/whatsapp/controller/whatsapp-form',
            templateUrl: 'app/speaknow/whatsapp/template/whatsapp-form.html'
        },
        '/speaknow/whatsapp/:id': {
            controller: 'WhatsappForm',
            controllerUrl: 'speaknow/whatsapp/controller/whatsapp-form',
            templateUrl: 'app/speaknow/whatsapp/template/whatsapp-form.html'
        }
    };

    speaknow._menu = [
//        {
//            href: 'speaknow/config',
//            title: 'CONFIG.CONFIG',
//            icon: 'icon-settings',
//            children: []
//        },
        {
            href: 'speaknow/contact',
            title: 'CONTACT.CONTACTS',
            icon: 'icon-contacts',
            children: []
        },
        {
            title: 'INTERACTION.INTERACTIONS',
            icon: 'icon-archive',
            href: 'speaknow/interaction',
            children: []
        },
        {
            href: 'speaknow/company',
            title: 'COMPANY.COMPANY',
            icon: 'icon-suitcase',
            children: []
        },
        {
            href: 'speaknow/product',
            title: 'PRODUCT.PRODUCT_SERVICE',
            icon: 'icon-box2',
            children: []
        },
        {
            title: 'WHATSAPP.WHATSAPP',
            icon: 'icon-comments',
            children: [
                {
                    href: 'speaknow/whatsapp',
                    title: 'WHATSAPP.ACCOUNTS'
                },
                {
                    href: 'speaknow/whatsapp/default',
                    title: 'WHATSAPP.ACCOUNTS_DEFAULT'
                }
            ]
        },
        {
            href: 'speaknow/company/message',
            title: 'COMPANY_MESSAGE.COMPANY_MESSAGE',
            icon: 'icon-message',
            children: []
        }
    ];

    return speaknow;
});
