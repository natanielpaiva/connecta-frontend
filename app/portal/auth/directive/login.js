define([
    'connecta.portal',
    'portal/auth/service/login-service',
    'portal/auth/service/facebook-service',
], function (portal) {
    return portal.directive('login', function () {
        return {
            templateUrl: 'app/portal/auth/directive/template/login.html',
            controller: function ($scope, LoginService, FacebookService) {
                $scope.credentials = {};
                $scope.authResponse = {};
                $scope.logged = false;

                LoginService.checkAuthentication();

                $scope.loginWithFacebook = function () {
                    FacebookService.login();
                };

                $scope.submit = function () {
                    LoginService.doLogin($scope.credentials);
                };

//                $scope.logout = function () {
//                    Facebook.logout(function () {
//                        $scope.$apply(function () {
//                            $scope.user = {};
//                            $scope.logged = false;
//                        });
//                    });
//                };


            }
        };
    });
});
