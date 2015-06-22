define([
    'connecta.speaknow',
    'speaknow/whatsapp/service/whatsapp-service'
], function (speaknow) {
    return speaknow.lazy.controller('WhatsappForm', function (
            $scope, WhatsappService, $location, $routeParams ) {

        $scope.whatsapp = {
            active: false
        };


        if ($routeParams.id) {
            $scope.isEditing = true;
            WhatsappService.get($routeParams.id).success(function (data) {
                $scope.whatsapp = data;
            });
        }

        $scope.submit = function(){
            console.log($scope.whatsapp);
            WhatsappService.save($scope.whatsapp).success(function(response){
                $location.path('speaknow/whatsapp');
            });
        };

    });
});