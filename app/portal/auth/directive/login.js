define([
    'connecta.portal',
    'json!package',
    'portal/user/directive/unique-email',
    // 'portal/layout/directive/click-out',
    'portal/layout/service/confirm',
    'portal/layout/service/notify'
            //    'portal/auth/service/facebook-service',
            //    'portal/auth/service/google-plus-service',
], function (portal, package) {
    return portal.directive('login', function () {
        return {
            templateUrl: 'app/portal/auth/directive/template/login.html',
            controller: function ($scope, LoginService, UserService, $location, $route, notify, DomainService, $translate, $confirm) { // FacebookService, GPlusService,
                $scope.package = package;

                $scope.invite = {};
                $scope.invite.user = {};
                $scope.invited = {};
                $scope.credentials = {};
                $scope.authResponse = {};
                $scope.user = {};
                $scope.domains = [];
                $scope.email = "";
                $scope.hash = $location.search().hash;
                $scope.domainBeingEdited = null;
                $scope.logged = false;
                $scope.isCreating = false;
                $scope.sections = {
                    login: "login",
                    form: "form",
                    domain: "domain",
                    formInvited: "formInvited"
                };

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
                    location.hash = '';
                    return $scope.sections.formInvited;
                };

                $scope.currentSection = $scope.hash && $scope.hash !== '' ?
                        $scope.prepareInviteSection() : $scope.sections.login;

                $scope.loadDomains = function (username) {
                    DomainService.getDomainsByUser(username).then(function (response) {
                        $scope.domains = response.data;
                    });
                };

                $scope.submit = function () {
                    LoginService.doLogin($scope.credentials).then(function () {
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
                    LoginService.selectDomain(domain);
                    $route.reload();
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

//                    UserService.getAll().then(function (response) {
//                        $scope.invite.users = response.data;
//                    });
                };

                $scope.updateDomain = function (domain) {
                    event.stopPropagation();

                    DomainService.updateDomain(domain).then(function () {
                        $scope.domainBeingEdited = null;
                        notify.success('DOMAIN.UPDATED');
                        $scope.inviteUser(domain.id);
                    });
                };

                $scope.createDomain = function (domain) {
                    DomainService.createDomain(domain).then(function (response) {
                        angular.extend(domain, response.data);
                        $scope.domainBeingEdited = null;
                        notify.success('DOMAIN.CREATED');
                        $scope.inviteUser(domain.id);
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
                        DomainService.deleteDomain(id).then(function () {
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

                $scope.inviteUser = function (id) {
                    if ($scope.invite.emails) {
                        $scope.emails = $scope.invite.emails.split(" ");
                        DomainService.inviteUser($scope.emails, id).then(function () {
                            notify.success('USER.INVITED_SUCCESS');
                        });
                    }

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
