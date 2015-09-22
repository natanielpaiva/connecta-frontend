define([
    'connecta.speaknow',
    'speaknow/config/service/config-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ConfigViewController', function ($scope, ConfigService, notify) {

        $scope.configs = [];
        
        ConfigService.list().then(function(result){
            $scope.configs = result.data;
        });
        
        
        $scope.submit = function(){
            ConfigService.save($scope.configs).then(function(data){
                notify.success("Configurações salva com sucesso");
            });
        };

    });
});
