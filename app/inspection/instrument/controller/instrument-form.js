define([
    'connecta.inspection',
    'inspection/instrument/service/instrument-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('InstrumentFormController', function (
            $scope, $routeParams, InstrumentService, notify, $location, $translate,$filter,$modalTranslate) {

        $scope.instrument = null;
        $scope.isEditing = false;
        
        $scope.datePickerMsg={
            msgToday: '',
            msgClear: '',
            msgClose: ''            
        };                   
        $modalTranslate($scope.datePickerMsg, 'msgToday', 'INSTRUMENT.DATEPICKER_TODAY');
        $modalTranslate($scope.datePickerMsg, 'msgClear', 'INSTRUMENT.DATEPICKER_CLEAR');
        $modalTranslate($scope.datePickerMsg, 'msgClose', 'INSTRUMENT.DATEPICKER_CLOSE');
               
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            initDate: new Date('07-01-2015')            
        };

        $scope.open = function ($event, btn) {
            $event.preventDefault();
            $event.stopPropagation();
            //Verifica qual janela de data foi selecionada
            if ($event.currentTarget.id === 'btn_validation_date') {
                $scope.validationPopupOpened = true;
            } else {
                $scope.duePopupOpened = true;
            }

        };

        if ($routeParams.id) {
            $scope.isEditing = true;
            InstrumentService.get($routeParams.id).success(function (data) {
                $scope.instrument = data;
                $scope.instrument.calibrationDate = new Date($scope.instrument.calibrationDate);
                $scope.instrument.dueDate = new Date($scope.instrument.dueDate);
            });
        }

        $scope.submit = function () {
            InstrumentService.save($scope.instrument).then(function () {
                 $translate('INSTRUMENT.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/instrument');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                 $translate('INSTRUMENT.ERROR_SAVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/instrument');
                });
            });
        };

    });
});