define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'speaknow/interaction/service/interaction-service',
], function (speaknow) {
    return speaknow.lazy.controller('ActionDataAnalysisController', function ($scope,
            InteractionService, ActionService, $location, $routeParams, $modal, $translate) {
        
        var actionID = $routeParams.id;
        if (actionID) {
            ActionService.get(actionID).success(function (data) {
                $scope.action = data;
            });
            ActionService.getActionAnswers(actionID).success(function (data) {
                $scope.users = data;
            });
            
        } else {
            console.error("Id da interaction não informado na url");
            $location.path('speaknow/interaction');
        }

    });
});