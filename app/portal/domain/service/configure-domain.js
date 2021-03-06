/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/notify',
    'portal/layout/service/confirm'
], function (portal) {
    return portal.factory('$configureDomain', function ($modal, $q, $confirm, DomainService, notify) {
        return function (title, domain) {
            var deferred = $q.defer();

            var modal = $modal.open({
                animation: true,
                templateUrl: 'app/portal/domain/directive/template/configure-domain.html',
                controller: function ($scope) {
                    $scope.title = title;
                    $scope.domain = domain;
                    $scope.colors = [
                        "#2980b9",
                        "#9b59b6",
                        "#2ecc71",
                        "#e74c3c",
                        "#e67e22",
                        "#f1c40f",
                        "#95a5a6"
                    ];

                    $scope.save = function () {
                        DomainService.updateDomain($scope.domain).then(function () {
                            notify.success('DOMAIN.UPDATED');
                            deferred.resolve();
                            modal.close();
                        });
                    };

                    $scope.cancel = function () {
                        deferred.reject();
                        modal.close();
                    };

                    $scope.deleteUser = function (idUser, index) {

                        $confirm('USER.CONFIRM_DELETE', 'USER.DELETE_CONFIRM').then(function () {
                            DomainService.removeUser($scope.domain.id, idUser).then(function () {
                                $scope.domain.users.splice(index, 1);
                                notify.success('USER.REMOVED');
                            });
                        });

                    };

                },
                size: 'lg'
            });

            return deferred.promise;
        };
    });
});
