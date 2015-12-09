define([
    'connecta.speaknow',
    'speaknow/answer/service/answer-service',
    'portal/layout/service/notify',
], function (speaknow) {

    return speaknow.lazy.controller('SearchController', 
        function ($scope, $location, AnswerService, notify) {

        	$scope.searchPoll = function(){
                if($scope.form_search.$valid){
            		AnswerService.search($scope.search)
            				     .success(redirectToAnswer)
            				     .error(notify.error.bind('Error', 'POLL.SEARCH_NOT_FOUND'));
                }
        	};

            var redirectToAnswer = function(data){
                $location.path('speaknow/poll/' + data.link + '/answer');
            };
        }
    );
});