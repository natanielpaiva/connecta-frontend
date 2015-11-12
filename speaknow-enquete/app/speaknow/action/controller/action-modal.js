define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.controller('ActionFormModalController', function ($scope, $modalInstance, items, selected) {
        $scope.items = items;

        $scope.modal = {
            selected: selected
        };

        $scope.ok = function () {
            $modalInstance.close($scope.modal.selected);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

//        $scope.selectIcon = function (iconName){
//            $scope.selected = iconName;
//        }
//        console.log('FormModalController Executada');
    });
});