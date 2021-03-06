define([
    'connecta.portal',
    'portal/user/service/user-service'
], function (portal) {
    return portal.directive('uniqueEmail', function ($q, UserService) {
        return {
            require: 'ngModel',
            scope: {
                initialEmail: '=?'
            },
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$asyncValidators.uniqueEmail = function (modelValue, viewValue) {
                    if (ngModelController.$isEmpty(viewValue) || scope.initialEmail === viewValue) {
                        return $q.when();
                    } else {
                        var deferred = $q.defer();

                        UserService.getByEmail(modelValue).then(function () {
                            deferred.resolve(modelValue);
                        }, function () {
                            deferred.reject();
                        });
                        
                        return deferred.promise;
                    }
                };
            }
        };
    });
});