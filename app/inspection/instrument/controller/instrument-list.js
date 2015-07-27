define([
    'connecta.inspection',
    'inspection/instrument/service/instrument-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('InstrumentListController', function (
            $scope, InstrumentService, ngTableParams, $location, notify, $translate, $modalTranslate) {



        $scope.remove = function (id) {
            console.info("REMOVE", id);
            InstrumentService.delete(id).then(function () {
                $translate('INSTRUMENT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/instrument');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('INSTRUMENT.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/instrument');
                });
            });
        };


        //Parâmetros da Modal
        $scope.modalParams = {
            title: "",
            text: "",
            size: 'sm',
            success: $scope.remove
        };


        //translate das propriedades da modal
        $modalTranslate($scope.modalParams, 'title', 'INSTRUMENT.TITLE_CONFIRM_DELETE');
        $modalTranslate($scope.modalParams, 'text', 'INSTRUMENT.CONFIRM_DELETE');


        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return InstrumentService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    //converte datas para format brasileiro DD/MM/YYYY
                    for (var i in response.data) {
                        response.data[i].calibrationDate = new Date(response.data[i].calibrationDate).toLocaleDateString("pt-BR");
                        response.data[i].dueDate = new Date(response.data[i].dueDate).toLocaleDateString("pt-BR");
                    }
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

//        InstrumentService.list().then(function (response) {
//            //converte datas para format brasileiro DD/MM/YYYY
//            for (var i in response.data) {
//                response.data[i].calibrationDate = new Date(response.data[i].calibrationDate).toLocaleDateString("pt-BR");
//                response.data[i].dueDate = new Date(response.data[i].dueDate).toLocaleDateString("pt-BR");
//            }
//            $scope.instruments = response.data;
//
//
//        }, function (response) {
//        });

    });
});