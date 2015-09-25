define([
    'connecta.portal',
    'portal/auth/service/login-service',
    'portal/auth/service/facebook-service',
    'portal/auth/service/google-plus-service',
    'portal/layout/service/notify'
], function (portal) {
    return portal.directive('login', function () {
        return {
            templateUrl: 'app/portal/auth/directive/template/login.html',
            controller: function ($scope, LoginService, FacebookService, UserService, GPlusService, $location, notify) {
                $scope.credentials = {};
                $scope.authResponse = {};
                $scope.logged = false;
                $scope.sections = {
                    "login": "login",
                    "form": "form"
                };
                $scope.currentSection = $scope.sections.login;

                $scope.setSection = function (section) {
                    $scope.user = {};
                    $scope.userImage = undefined;
                    $scope.currentSection = $scope.sections[section];
                };

                LoginService.checkAuthentication();

                $scope.loginWithFacebook = function () {
                    FacebookService.login();
                };

                $scope.submit = function () {
                    LoginService.doLogin($scope.credentials).then(function(response){
                    }, function(){
                            notify.warning("USER.VALIDATION.USER_OR_PASS_INVALID");
                    });
                };

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
                            if ($scope.validateImage(e)) {
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

                $scope.removeUserImg = function () {
                    $scope.userImage = null;
                    $scope.imgName = null;
                    $scope.fileImage = null;
                };

                $scope.validateImage = function (image) {
                    var isValid = true;
                    if (image.total / 614400 > 1) {
                        notify.warning("USER.VALIDATION.IMAGESIZE");
                        isValid = false;
                    } else {
                        var img = angular.element("<img>")[0];
                        img.src = image.target.result;
                        if (img.height != img.width) {
                            notify.warning("USER.VALIDATION.IMAGEFORM");
                            isValid = false;
                        }
                    }
                    return isValid;
                };

                $scope.createUser = function () {
                    //Por enquanto o login do usuário será o email (easy unique...)
                    $scope.user.profile.id = $scope.user.profile.email;

                    UserService.save($scope.user, $scope.fileImage).then(function (response) {
                        LoginService.setAuthenticatedUser(response);
                        $location.path('/');
                    }, function(response){
                        notify.error(response.data);
                    });
                };

                $scope.loginWithGoogle = function(){
                    GPlusService.loginWithGoogle();
                };

                $scope.$on('facebook-without-email', function (event, userFacebook) {
                    console.log("User: ", userFacebook);
                    $scope.user = {
                        profile: {
                            "firstName": userFacebook.first_name,
                            "lastName": userFacebook.last_name,
                            "avatarUrl": "http://graph.facebook.com/" + userFacebook.id + "/picture?type=large"
                        },
                        credentials: {
                        }
                    };
                    $scope.userImage = $scope.user.profile.avatarUrl;
                    $scope.currentSection = $scope.sections.form;
                });

            }
        };
    });
});