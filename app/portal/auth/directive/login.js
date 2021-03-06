define([
    'connecta.portal',
    'json!package',
    'json!applications.json',
    'portal/user/directive/unique-email',
    'portal/domain/service/invite-service',
    'portal/domain/service/invite-user',
    // 'portal/layout/directive/click-out',
    'portal/layout/service/confirm',
    'portal/layout/service/notify'
            //    'portal/auth/service/facebook-service',
            //    'portal/auth/service/google-plus-service',
], function (portal, package, applications) {
    return portal.directive('login', function () {
        return {
            templateUrl: 'app/portal/auth/directive/template/login.html',
            controller: function ($scope, LoginService, UserService, $location,
                    $route, $routeParams, notify, DomainService,
                    InviteService, $translate, $confirm, $inviteUser) { // FacebookService, GPlusService,

                var AMOUNT_USERS = 10;
                var _accessToken = "";

                $scope.package = package;
                $scope.applicationsPortal = applications.portal;

                $scope.invite = {};
                $scope.invited = {};
                $scope.credentials = {};
                $scope.authResponse = {};
                $scope.user = {};
                $scope.domains = [];
                $scope.email = "";
                $scope.hash = $routeParams.hash;
                $scope.flow = $routeParams.flow;
                $scope.domainBeingEdited = null;
                $scope.logged = false;
                $scope.isCreating = false;
                $scope.sections = {
                    login: "login",
                    form: "form",
                    domain: "domain",
                    formInvited: "formInvited",
                    forgotPassword: "recoveryPassword",
                    forgotForm: "forgotForm"
                };

                $scope.colors = [
                    "#2980b9",
                    "#9b59b6",
                    "#2ecc71",
                    "#e74c3c",
                    "#e67e22",
                    "#f1c40f",
                    "#95a5a6"
                ];

                $scope.setSection = function (section) {
                    $scope.user = {};
                    $scope.user.email = null; // Parece que não faz sentido. Mas faz. Acredite. E tem que ser nessa ordem.
                    $scope.currentSection = section;
                };

                $scope.prepareInviteSection = function () {
                    UserService.getByHash($scope.hash).then(function (response) {
                        $scope.invited.email = response.data.email;
                        $scope.email = $scope.invited.email;

                    });
                };

                function init() {
                    switch ($scope.flow) {
                        case 'create-account':
                            $scope.prepareInviteSection();
                            $scope.setSection($scope.sections.formInvited);
                            break;
                        case 'forgot-password':
                            $scope.credentials = null;
                            $scope.setSection($scope.sections.forgotForm);
                            break;
                        default:
                            $scope.setSection($scope.sections.login);
                    }
                    // location.hash = '';
                }

                init();

                $scope.inviteUser = function (idDomain) {
                    UserService.get(AMOUNT_USERS, idDomain, _accessToken).then(function (response) {
                        $inviteUser(response.data, idDomain, _accessToken).then(function () {
                            notify.success('USER.INVITED_SUCCESS');
                        });
                    });
                };

                $scope.loadDomains = function (username) {
                    DomainService.getDomainsByUser(username, _accessToken).then(function (response) {
                        $scope.domains = response.data;
                    });
                };

                $scope.submit = function () {
                    LoginService.checkLogin($scope.credentials).then(function (response) {
                        _accessToken = response.data.access_token;
                        $scope.loadDomains($scope.credentials.email);
                        $scope.setSection($scope.sections.domain);
                    }, function () {
                        notify.warning("USER.VALIDATION.USER_OR_PASS_INVALID");
                    });
                };

                LoginService.checkAuthentication();

//                $scope.loginWithFacebook = function () {
//                    FacebookService.login();
//                };

                $scope.selectDomain = function (domain) {
                    LoginService.selectDomain(domain).then(function () {
                        LoginService.doLogin($scope.credentials.keepLogged);
                        $route.reload();
                    });
                };

                function _removeInvalidDomain() {
                    var domain = $scope.domains[$scope.domains.length - 1];
                    if (domain && !domain.id) {
                        $scope.domains.pop();
                    }
                }

                $scope.showConfiguration = function (index) {
                    event.stopPropagation();

                    $scope.invite.emails = null;
                    $scope.domainBeingEdited = index;
                    _removeInvalidDomain();

                };

                $scope.updateDomain = function (domain) {
                    event.stopPropagation();

                    DomainService.updateDomain(domain, _accessToken).then(function () {
                        $scope.domainBeingEdited = null;
                        notify.success('DOMAIN.UPDATED');
                    });
                };

                $scope.createDomain = function (domain) {
                    DomainService.createDomain(domain, _accessToken).then(function (response) {
                        angular.extend(domain, response.data);
                        $scope.domainBeingEdited = null;
                        notify.success('DOMAIN.CREATED');
                    });
                };

                $scope.newDomain = function () {
                    _removeInvalidDomain();
                    $scope.domains.push({});
                    $scope.domainBeingEdited = $scope.domains.length - 1;
                    $scope.invite.emails = null;

                };

                $scope.deleteDomain = function (id, index) {
                    $confirm('LAYOUT.CONFIRM_DELETE', 'DOMAIN.DELETE_CONFIRM').then(function () {
                        DomainService.deleteDomain(id, _accessToken).then(function () {
                            $scope.domains.splice(index, 1);
                            $scope.domainBeingEdited = null;
                            notify.success('DOMAIN.DELETED');
                        });
                    });
                };

                $scope.createUser = function () {
                    $scope.credentials = $scope.user;
                    UserService.save($scope.user).then(function () {
                        LoginService.doLogin($scope.user).then(function () {
                            $scope.setSection($scope.sections.domain);
                        });

                    }, function (response) {
                        notify.error(response.data);
                    });
                };

                $scope.createInvited = function () {
                    $scope.credentials = $scope.invited;
                    UserService.saveInvited($scope.invited).then(function () {
                        $scope.submit();
                    }, function (response) {
                        notify.error(response.data);
                    });
                };

                $scope.forgotPassword = function () {
                    UserService.recoverPassword($scope.emailRecoverPass).then(function () {
                        notify.success('USER.FORGOT_PASSWORD');
                    }, function () {
                        notify.warning('USER.ERROR.FORGOT_PASSWORD');
                    });
                    $scope.setSection($scope.sections.login);
                };
                $scope.savePassword = function () {
                    UserService.resetPassword($scope.hash, $scope.credentials.password).then(function () {
                        notify.success('USER.CHANGE_PASSWORD_SUCCESS');
                        $scope.setSection($scope.sections.login);
                    });
                };
                $scope.cancel = function () {
                    $scope.setSection($scope.sections.login);
                    location.hash = '';
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

            }
        };
    });
});
