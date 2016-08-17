define([
    'connecta.inspection',
    'inspection/person/service/person-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('PersonListController', function (
            $scope, PersonService, ngTableParams, notify, $translate, $location) {
        
        
        $scope.persons=null;
            
            
        $scope.remove = function (id) {
            console.info("REMOVE", id);
            PersonService.delete(id).then(function () {
                $translate('PERSON.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/person');
                });
            }, function (response) {
                $translate('PERSON.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/person');
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

        
        $scope.search = {
            name: ''
        };
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return PersonService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
        
        
          PersonService.list().then(function (response) {
            $scope.persons = response.data;
        }, function (response) {
        });
        
    });
});