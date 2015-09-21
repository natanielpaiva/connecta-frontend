define([
    'connecta.speaknow',
    'speaknow/whatsapp/service/whatsapp-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('WhatsappAccountList', function (
            $scope, WhatsappService, notify, ngTableParams, CompanyService, $location
            ) {

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }
            notify.warning('PRODUCT.WITHOUT_COMPANY');
            $location.path('speaknow/company/new');
        });

        $scope.search = {
            name:''
        };
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return WhatsappService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });

        $scope.delete = function (accountID) {
            WhatsappService.delete(accountID).success(function(resp){
                notify.success("Conta removida com sucesso");
                $scope.tableParams.reload();
            });
        };

        $scope.modalRemoveAccount = {
            title: 'Excluir Conta',
            text: 'Deseja realmente remover a conta?',
            size: 'sm',
            success: $scope.delete
        };

        $scope.activate = function (accountID, active) {
            var verb = active ? "desativada" : "ativada";
            WhatsappService.activate(accountID, active).success(function(resp){
                notify.success("Conta " + verb + " com sucesso");
                $scope.tableParams.reload();
            });
        };

        $scope.modalActivateAccount = {
            title: 'Status da  Conta',
            text: 'Deseja ativar/desativar a conta?',
            size: 'sm',
            success: $scope.activate
        };

        $scope.activeBtnClass = function(active){
            return {
                'btn-primary': active,
                'btn-default': !active
            };
        };

        $scope.statusClasses = function(active){
            return {
                'icon-checkmark3 status-active': active,
                'icon-close status-inactive': !active
            };
        };


    });
});
