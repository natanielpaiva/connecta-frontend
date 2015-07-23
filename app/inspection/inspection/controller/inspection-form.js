define([
    'connecta.inspection',
    'inspection/inspection/service/inspection-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('InspectionFormController', function (
            $scope, InspectionService, notify) {
            
            $scope.buttons = [
                {
                    title:"Adicionar",
                    href:"#/inspection/person/new"
                }
            ];
            $scope.list = [
                {
                    name:"Nome",
                    desc:"descrição da ação",
                    status:"Aberto"
                },
                {
                    name:"Nome",
                    desc:"descrição da ação",
                    status:"Pendente"
                },
                {
                    name:"Nome",
                    desc:"descrição da ação",
                    status:"Fechado"
                },
            ];
        
    });
});