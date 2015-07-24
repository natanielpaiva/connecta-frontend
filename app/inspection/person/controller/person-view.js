define([
    'connecta.inspection',
    'inspection/person/service/person-service',
    'portal/layout/service/notify'
], function (person) {
    return person.lazy.controller('PersonViewController', function ($scope, PersonService, notify, $routeParams, $location, $translate) {

        PersonService.get($routeParams.id).then(function (response) {
            
            

        });

    });
});