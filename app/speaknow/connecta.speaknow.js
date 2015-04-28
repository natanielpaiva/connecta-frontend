define([
    'angular'
], function (angular) {
    var speaknow = angular.module('connecta.speaknow', []);

    speaknow.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('speaknow/contact');
        $translatePartialLoaderProvider.addPart('speaknow/interaction');
        $translatePartialLoaderProvider.addPart('speaknow/action');
        $translatePartialLoaderProvider.addPart('speaknow/company');
        $translatePartialLoaderProvider.addPart('speaknow/company-contact');
    });

    speaknow.run(function (applications) {
        var appSpeaknow = applications.filter(function (app) {
            return app.name === 'speaknow';
        }).pop();
        
//        appSpeaknow.host = 'http://localhost:7002/speaknow';

        speaknow.lazy.value('speaknowResources', {
            action: appSpeaknow.host + '/action',
            contact: appSpeaknow.host + '/contact',
            interaction: appSpeaknow.host + '/interaction',
            company: appSpeaknow.host + '/company',
            companyContact: appSpeaknow.host + '/contact/group',
            regexBase64: '.*base64,'
        });

    });

    speaknow._routes = {
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
        '/speaknow/action/:id/edit': {
            controller: 'ActionFormController',
            controllerUrl: 'speaknow/action/controller/action-form',
            templateUrl: 'app/speaknow/action/template/action-form.html'
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
        '/speaknow/company/contact/:id' :{
            controller: 'CompanyContactViewController',
            controllerUrl: 'speaknow/company-contact/controller/company-contact-view',
            templateUrl: 'app/speaknow/company-contact/template/company-contact-view.html'
        }
    };

    speaknow._menu = [
        {
            href: 'speaknow/contact',
            title: 'CONTACT.CONTACTS',
            icon: 'icon-user',
            children: []
        },
        {
            title: 'INTERACTION.INTERACTIONS',
            icon: 'icon-target',
            href: 'speaknow/interaction',
            children: []
        },
        {
            href: 'speaknow/company',
            title: 'COMPANY.COMPANY',
            icon: 'icon-user',
            children: []
        }
    ];

    return speaknow;
});
