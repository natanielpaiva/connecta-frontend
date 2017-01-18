define([
    'connecta.speaknow',
    'speaknow/whatsapp/service/whatsapp-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('WhatsappForm', function (
            $scope, WhatsappService, $location, $routeParams, notify) {

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
            WhatsappService.save($scope.whatsapp).success(function(response){
                notify.success('WHATSAPP.SAVE_SUCCESS');
                $location.path('speaknow/whatsapp/');
            });
        };

    });
});