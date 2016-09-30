define([
    'connecta.portal',
    'portal/layout/service/notify',
    'portal/user/service/user-service',
    'portal/layout/service/data-uri',
    'portal/user/directive/unique-email'
], function (portal) {

    return portal.lazy.controller('UserFormController', function ($scope, $translate,
            notify, UserService, LoginService, dataURI) {

        function init() {
            $scope.user = {};
            $scope.credentials = {};
            $scope.rejFiles = {};
            $scope.languages = {
                'pt-br': 'Português (Brasil)',
                'en-us': 'English (US)'
            };

            $scope.$watch('user.language', function (lang) {
                $translate.use(lang);
            });

            $scope.$watch('image', function () {
                if ($scope.image) {
                    $scope.imageURL = $scope.image;
                } else {
                    $scope.imageURL = UserService.makeBackgroundImage($scope.user.id);
                }
            });

            LoginService.getCurrentUser().then(function (data) {
                $scope.user = data;
                $scope.email = $scope.user.email;

                if (!$scope.user.language) {
                    $scope.user.language = 'pt-br';
                }

                $scope.imageURL = UserService.makeBackgroundImage($scope.user.id);
            });
        }

        $scope.fileDropped = function ($files) {
            $scope.imageFile = $files[0];
            dataURI($scope.imageFile).then(function (result) {
                $scope.image = result;
            });
        };

        $scope.removePhoto = function () {
            UserService.upload(null, $scope.user).then(function () {
                $scope.image = null;
                $scope.imageFile = null;
            });
        };

        $scope.submitUserProfile = function () {
            UserService.update($scope.user).then(function () {
                if ($scope.imageFile) {
                    UserService.upload($scope.imageFile, $scope.user)
                            .error(function () {
                                notify.warning('USER.VALIDATION.USER_UNAUTHORIZED');
                            });
                }
                notify.success('USER.UPDATE_SUCCESS');
            });
        };

        $scope.submitCredentials = function () {
            if ($scope.credentials.password !== $scope.credentials.authenticatedUserPassword) {

                UserService.changePassword($scope.credentials).then(function () {
                    notify.success('USER.CHANGE_PASSWORD_SUCCESS');
                    $scope.credentials = {};
                    $scope.user_credentials_form.$setUntouched();
                    $scope.user_credentials_form.$setPristine();
                }, function () {
                    notify.warning('USER.VALIDATION.PASS_INVALID');
                });

            } else {
                notify.warning('USER.VALIDATION.PASS_INVALID');
            }
        };

        init();
    });

});

