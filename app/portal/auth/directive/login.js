define([
  'connecta.portal',
  'portal/auth/service/login-service'
], function(portal) {
  return portal.directive('login', function() {
    return {
      templateUrl:'app/portal/auth/directive/template/login.html',
      controller:function(LoginService, $scope, $cookies, $cookieStore, $http) {
        $scope.credentials = {};

        LoginService.checkAuthentication();

        $scope.submit = function() {
          LoginService.doLogin($scope.credentials).success(function(response) {
            $http.defaults.headers.common.Authorization = response.token;
            $cookieStore.put('Authorization', response.token);
          });
        };
      }
    };
  });
});
