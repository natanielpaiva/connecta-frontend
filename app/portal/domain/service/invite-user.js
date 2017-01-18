/* global angular */
define([
    'connecta.portal',
    'portal/user/service/user-service',
    'portal/domain/service/invite-service'
], function (portal) {
    return portal.factory('$inviteUser', function ($modal, $q, UserService, InviteService) {
        return function (users, idDomain) {
            var deferred = $q.defer();

            var modal = $modal.open({
                animation: true,
                templateUrl: 'app/portal/domain/directive/template/invite-user.html',
                controller: function ($scope) {

                    $scope.regex = "";
                    $scope.emails = [];
                    $scope.users = users;
                    $scope.idDomain = idDomain;

                    $scope.pushEmail = function (user) {
                        if ($scope.emails.indexOf(user.email) === -1) {
                            $scope.emails.push(user.email);
                        }
                        if(users.indexOf(user) === -1){
                            users.unshift(user);
                        }
                    };

                    $scope.removeEmail = function (user) {
                        $scope.emails.splice($scope.emails.indexOf(user.email), 1);
                    };

                    $scope.getByRegex = function () {
                        if ($scope.regex === "") {
                            $scope.users = users;
                        } else {
                            UserService.getByRegex($scope.regex,idDomain).then(function (response) {
                                $scope.users = response.data;
                                $scope.getImage();
                            });
                        }
                    };

                    $scope.getImage = function () {
                        $scope.users.forEach(function (current) {
                            current.image = UserService.makeBackgroundImage(current.id);
                        });
                    };

                    $scope.getImage();

                    $scope.save = function () {
                        InviteService.invite($scope.idDomain, $scope.emails).then(function () {
                            deferred.resolve();
                        });
                        modal.close();
                    };

                    $scope.cancel = function () {

                        deferred.reject();
                        modal.close();
                    };

                },
                size: 'sm'
            });

            return deferred.promise;
        };
    });
});