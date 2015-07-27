define([
    'connecta.inspection',
    'inspection/inspection/service/inspection-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('InspectionFormController', function (
            $scope, InspectionService, notify) {

        $scope.list = [
            {
                id: 0,
                name: "Nome",
                desc: "descrição da ação",
                status: "Aberto"
            },
            {
                id: 1,
                name: "Nome",
                desc: "descrição da ação",
                status: "Pendente"
            },
            {
                id: 2,
                name: "Nome",
                desc: "descrição da ação",
                status: "Fechado"
            }
        ];

        $scope.status = [
            {
                name: "Aberto",
                icon: "icon-heatmap"
            },
            {
                name: "Pendente",
                icon: "icon-analysis"
            },
            {
                name: "Fechado",
                icon: "icon-cluster"
            }
        ];
        
        $scope.callbackStatus = function(obj){
            console.log(obj);
        };

    });
});