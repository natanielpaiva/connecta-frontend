define([
    'connecta.portal',
    'portal/login/service/login-service'
], function(portal){
    return portal.lazy.controller('LoginController', function(LoginService, $scope, $cookies, $cookieStore, $http){
        $scope.credentials = {};

        $scope.submit = function(){
            LoginService.doLogin($scope.credentials).success(function(response){
                $http.defaults.headers.common.Authorization = response.token;
                $cookieStore.put('Authorization', response.token);
            });
        };
    });
});