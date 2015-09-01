define([
  'connecta.portal',
  'portal/layout/service/notify',
  'portal/user/service/user-service'
], function(portal){

  return portal.lazy.controller('UserProfileController', function($rootScope, $scope, $window, $translate,
    notify, UserService, LoginService){

    LoginService.getCurrentUser().then(function(data){
      $scope.user = data;
      console.log(data);
    });

    $scope.credentials = {};
    $scope.rejFiles = {};

    $scope.onFileSelected = function (files, ev, rejFiles) {
      if (rejFiles && rejFiles.length) {
        $translate('USER.VALIDATION.INVALID_DOCUMENT').then(function (text) {
          notify.warning(text);
        });
        return;
      }

      var file = files[0];
      $scope.fileImage = file;
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if($scope.validateImage(e)){
              $scope.userImage = e.target.result;
              $scope.imgName = file.name;
              $scope.$apply();
          } else {
              $scope.removeUserImg();
          }
        };
        reader.readAsDataURL(files[0]);
      }

    };

    $scope.removeUserImg = function(){
      $scope.userImage = null;
      $scope.imgName = null;
      $scope.user.avatarUrl = null;
      $scope.fileImage = null;
    };

    $scope.validateImage = function(image){
      var isValid = true;
      if(image.total / 614400 > 1){
        notify.warning("USER.VALIDATION.IMAGESIZE");
        isValid = false;
      } else {
        var img = angular.element("<img>")[0];
        img.src = image.target.result;
        if(img.height != img.width){
          notify.warning("USER.VALIDATION.IMAGEFORM");
          isValid = false;
        }
      }
      return isValid;
    };

    $scope.submitUserProfile = function () {
      var userDTO = {
        "profile": {
          "id": $scope.user.userId,
          "firstName": $scope.user.firstName,
          "lastName": $scope.user.lastName,
          "email": $scope.user.email,
          "avatarUrl": $scope.user.avatarUrl
        }
      };

      UserService.updateUser(userDTO, $scope.fileImage).then(function(response){
        $translate('USER.UPDATE_SUCCESS').then(function (text) {
          notify.success(text);
          $rootScope.$broadcast('user.refresh-current', $scope.user.avatarUrl);
        });
      });
    };

    $scope.submitCredentials = function(){
      UserService.changePassword($scope.credentials).then(function(){
        $translate('USER.CHANGE_PASSWORD_SUCCESS').then(function (text) {
          notify.success(text);
        });
      });
    };
  });

});
