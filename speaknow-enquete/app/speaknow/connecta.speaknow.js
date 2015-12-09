define([
    'angular',
    'json!applications.json'
], function (angular, applications) {
    var speaknow = angular.module('connecta.speaknow', []);

    function registerTranslateParts($translatePartialLoaderProvider) {
      $translatePartialLoaderProvider.addPart('speaknow/poll');
    }

    function initializeSpeaknowResources(applications){

      var appSpeaknow = applications.speaknow;

      speaknow.constant('speaknowResources', {
          base: appSpeaknow.host,
          poll: appSpeaknow.host + '/poll',
          search: appSpeaknow.host + '/poll/search', 
          answers: appSpeaknow.host + '/answers'
      });
      speaknow.constant('regexBase64', '.*base64,');

    }

    initializeSpeaknowResources(applications);

    speaknow.config(function ($translatePartialLoaderProvider) {
      registerTranslateParts($translatePartialLoaderProvider);
    });

    function registerApplicationEvents($rootScope, $heading, $location){
      $rootScope.$on(speaknow.name + '.leave', function($event, $route){
        $heading.clearLogo();
      });
    }

    speaknow.run(function ($rootScope, $heading, $location) {
        registerApplicationEvents($rootScope, $heading, $location);
    });
    
    speaknow.constant('sortBy', function (array, name) {
        return array.sort(function (a, b) {
            var nameA = a[name].toUpperCase();
            var nameB = b[name].toUpperCase();
            if (nameA > nameB) {
                return 1;
            } else if (nameA < nameB) {
                return -1;
            }

            return 0;
        });
    });

    speaknow._routes = {
        '/speaknow': {
            controller: 'PollListController',
            controllerUrl: 'speaknow/poll/controller/poll-list',
            templateUrl: 'app/speaknow/poll/template/poll-list.html'
        },
        /**
         * URL POLLS
         */
        '/speaknow/poll': {
            controller: 'PollListController',
            controllerUrl: 'speaknow/poll/controller/poll-list',
            templateUrl: 'app/speaknow/poll/template/poll-list.html'
        },

        '/speaknow/poll/new': {
            controller: 'PollController',
            controllerUrl: 'speaknow/poll/controller/poll-form',
            templateUrl: 'app/speaknow/poll/template/poll-form.html'
        },

        '/speaknow/poll/:id': {
            controller: 'InteractionViewController',
            controllerUrl: 'speaknow/poll/controller/poll-view',
            templateUrl: 'app/speaknow/poll/template/poll-view.html'
        },

        '/speaknow/poll/:id/edit': {
            controller: 'PollController',
            controllerUrl: 'speaknow/poll/controller/poll-form',
            templateUrl: 'app/speaknow/poll/template/poll-form.html'
        },

        '/speaknow/poll/:link/answer': {
            controller: 'AnswerController',
            controllerUrl: 'speaknow/answer/controller/answer-form',
            templateUrl: 'app/speaknow/answer/template/answer-form.html'
        },

        '/speaknow/search': {
            controller: 'SearchController',
            controllerUrl: 'speaknow/answer/controller/search-form',
            templateUrl: 'app/speaknow/answer/template/search-form.html'
        },

        '/speaknow/poll/:id/results': {
            controller: 'PollResultsController',
            controllerUrl: 'speaknow/poll/controller/poll-results',
            templateUrl: 'app/speaknow/poll/template/poll-results.html'
        }
       
    };

    speaknow._menu = [
        {
            title: 'POLL.POLLS',
            icon: 'icon-archive',
            href: 'speaknow/poll',
            children: []
        },
        {
            title: 'POLL.ANSWER',
            icon: 'icon-archive',
            href: 'speaknow/search'
        }
    ];

    return speaknow;
});
