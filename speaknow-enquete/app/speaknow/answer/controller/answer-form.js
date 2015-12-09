define([
    'connecta.speaknow',
    'speaknow/poll/service/poll-service',
    'speaknow/answer/service/answer-service',
    'portal/layout/service/notify',
], function (speaknow) {

    return speaknow.lazy.controller('AnswerController', 
        function ($scope, $routeParams, $location, PollService, AnswerService, notify) {
        	var link = $routeParams.link;
            $scope.answers = {};
            $scope.answers_multiples = {};

        	PollService.getByLink(link)
        			   .success(function(data){
        			   		$scope.poll = data;
        			   })
        			   .error(notify.error.bind('Pam pan pamn pna'));


            $scope.submit = function(){
                var answers = [];

                for(var questionId in $scope.answers){
                    answers.push($scope.answers[questionId]);
                }

                answers = answers.concat(buildMultipleAnswers());
                
                //TODO: validate answers ...
                AnswerService.save(answers)
                             .success(function(){
                                 notify.success('POLL.SUCCESS');
                                 $location.path('/speaknow/poll/'+ $scope.poll.id +'/results');
                             })
                             .error(notify.error.bind('Error', 'NOT POSSIBLE ANSWER'));
            };

            /**
             * build multiple answers because these are checkbox and result is {id: true or false},
             * and server needs answer like this {question: {id: value}, questionItem:{id: value}}
             */
            var buildMultipleAnswers = function(){
                var answers = [];

                for(var questionId in $scope.answers_multiples){
                    var question_answers = $scope.answers_multiples[questionId];
                    for (var itemId in question_answers){
                        if(question_answers[itemId]){
                            answers.push({
                                "question": {
                                    "id": questionId
                                },
                                "questionItem": {
                                    "id": itemId
                                }
                            });
                        }
                    }
                }

                return answers;
            };
        }
    );
});