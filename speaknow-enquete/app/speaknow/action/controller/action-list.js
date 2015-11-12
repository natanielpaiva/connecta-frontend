define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionListController', function ($scope, InteractionService) {

        $scope.interactions = null;

        InteractionService.list().then(function (response) {
            $scope.interactions = response.data;
        }, function (response) {});
        
    });
});