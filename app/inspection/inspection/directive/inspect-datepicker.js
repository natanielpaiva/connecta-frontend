define([
    'connecta.inspection'
], function (inspection) {

    return inspection.directive('inspectDatepicker', function () {
        return {
            restrict: 'E',
            controller: function ($scope, $modalTranslate) {

                $scope.datePickerMsg = {
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
                    initDate: new Date()
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
            },
            scope: {
                dateModel: "="
            },
            link: function($scope){
                $scope.dateModel = new Date();
            },
            templateUrl: 'app/inspection/inspection/directive/template/inspect-datepicker.html'
        };
    });
});