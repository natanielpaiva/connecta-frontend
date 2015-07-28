define([
    'connecta.portal',
    'portal/login/service/login-service'
], function(portal){
    return portal.lazy.controller('LoginController', function(LoginService, $scope, $cookies){
        $scope.credentials = {};

        $scope.submit = function(){
            LoginService.doLogin($scope.credentials).success(function(){
                console.log(arguments);
                console.log($cookies.session);
            });
        };

        $scope.testGet = function(){
            LoginService.doGet().success(function(){
                console.log(arguments);
            });
        };
    });
});