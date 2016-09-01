define([
    'connecta.portal',
    'json!package',
    'portal/user/directive/unique-email',
//    'portal/auth/service/facebook-service',s
//    'portal/auth/service/google-plus-service',
    'portal/layout/service/notify'
], function (portal, package) {
    return portal.directive('login', function () {
        return {
            templateUrl: 'app/portal/auth/directive/template/login.html',
            controller: function ($scope, LoginService, UserService, $location, $route, notify, DomainService, $translate) { // FacebookService, GPlusService,
                $scope.package = package;

                $scope.credentials = {};
                $scope.authResponse = {};
                $scope.email = "";
                $scope.logged = false;
                $scope.isCreating = false;
                $scope.sections = {
                    login: "login",
                    form: "form",
                    domain: "domain"
                };
                $scope.currentSection = $scope.sections.login;
                $scope.setSection = function (section) {
                    $scope.user = {};
                    $scope.userImage = undefined;
                    $scope.currentSection = section;
                };

                LoginService.checkAuthentication();

//                $scope.loginWithFacebook = function () {
//                    FacebookService.login();
//                };

                $scope.submit = function () {
                    LoginService.doLogin($scope.credentials).then(function () {
                        $scope.loadDomains($scope.credentials.email);
                        $scope.setSection($scope.sections.domain);
                    }, function () {
                        notify.warning("USER.VALIDATION.USER_OR_PASS_INVALID");
                    });
                };

                $scope.selectDomain = function (domain) {
                    LoginService.selectDomain(domain);
                    $route.reload();
                };
                $scope.showConfiguration = function (domain) {
                    event.stopPropagation();
                    domain.isEditing = domain.isEditing === false ||
                            domain.isEditing === undefined ? true : false;
                };

                $scope.configureDomain = function (domain) {
                    event.stopPropagation();
                    DomainService.updateDomain(domain);
                    domain.isEditing = false;

                };

                $scope.createUser = function () {
                    UserService.save($scope.user).then(function () {
                        LoginService.doLogin($scope.user);
                        $scope.setSection($scope.sections.domain);
                    }, function (response) {
                        notify.error(response.data);
                    });
                };

                $scope.createDomain = function () {
                    DomainService.createDomain($scope.domain).then(function () {
                        $scope.loadDomains($scope.credentials.email);
                        $scope.setSection($scope.sections.domain);
                        $scope.isCreating = false;
                        notify.success('DOMAIN.CREATED');
                    });
                };

                $scope.deleteDomain = function (id) {
                    console.log(id);
                    DomainService.deleteDomain(id).then(function () {
                        notify.success('DOMAIN.DELETED');
                    });
                };


//                $scope.loginWithGoogle = function(){
//                    GPlusService.loginWithGoogle();
//                };

//                $scope.$on('facebook-without-email', function (event, userFacebook) {
//                    console.log("User: ", userFacebook);
//                    $scope.user = {
//                        profile: {
//                            "firstName": userFacebook.first_name,
//                            "lastName": userFacebook.last_name,
//                            "avatarUrl": "http://graph.facebook.com/" + userFacebook.id + "/picture?type=large"
//                        },
//                        credentials: {
//                        }
//                    };
//                    $scope.userImage = $scope.user.profile.avatarUrl;
//                    $scope.currentSection = $scope.sections.form;
//                });

                $scope.loadDomains = function (username) {
                    //getUserDomains
                    DomainService.getDomainsByUser(username).then(function (response) {
                        $scope.domains = response.data;
                    });
                };
            }
        };
    });
});
