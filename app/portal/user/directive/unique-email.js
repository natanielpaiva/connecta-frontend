define([
    'connecta.portal',
    'portal/user/service/user-service'
], function (portal) {
    return portal.lazy.directive('uniqueEmail', function ($q, UserService) {
        return {
            require: 'ngModel',
            scope: {
                initialEmail: '='
            },
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$asyncValidators.uniqueEmail = function (modelValue, viewValue) {
                    if (ngModelController.$isEmpty(modelValue)) {
                        return $q.when();
                    }

                    var deferred = $q.defer();

                    if (scope.initialEmail !== modelValue) {
                        UserService.validateEmail(modelValue).success(function () {
                            deferred.reject();
                        }, function () {
                            deferred.resolve();
                        });
                    }

                    return deferred.promise;
                };
            }
        };
    });
});