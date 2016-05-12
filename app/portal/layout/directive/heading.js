define([
    'angular',
    'connecta.portal',
    'portal/auth/service/login-service',
    'portal/layout/service/layout',
    'portal/layout/service/util',
    'portal/layout/service/heading-popover-service'
], function (angular, portal) {
    /**
     * Componente usado para renderizar e manter o header do portal
     */
    return portal.directive('heading', function (LayoutService, LoginService,
            HeadingPopoverService, DomainService) {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/heading.html',
            controller: function ($scope, applications, util, $route, $cookieStore) {

                $scope.user = {};
                $scope.avatarUrl = null;

                // adiciona a lista de aplicações no escopo
                $scope.applications = util.mapToArray(applications);

                $scope.$on('login.authenticated', function ($event, isAuthenticated) {
                    if (isAuthenticated) {
                        LoginService.getCurrentUser().then(function (user) {
                            $scope.user = user;
                            $scope.getUserAvatarUrl();
                            $scope.toggleDomain = false;
                            var currentDomain = $cookieStore.get('user.domain.name');
                            identifyAndHighlightUserDomain(currentDomain);
                        });
                    }
                });

                LoginService.checkAuthentication();

                $scope.getUserAvatarUrl = function () {
                    $scope.avatarUrl = $scope.user.imageUrl;
                };

                $scope.logoutUser = function () {
                    LoginService.unauthenticate();
                };

                $scope.closePopOver = function () {
                    HeadingPopoverService.hide();
                };

                $scope.toggleAppsPopOver = function () {
                    $scope.appsPopoverFocus = true;
                    var popoverOptions = {
                        id: 'appsPopOver',
                        templateurl: 'heading-popover-apps.html',
                        controller: function ($scope) {
                            $scope.applications = util.mapToArray(applications);
                        },
                        close: function () {
                            $scope.appsPopoverFocus = false;
                        }
                    };

                    HeadingPopoverService.active(popoverOptions);
                };

                $scope.toggleUserPopOver = function () {
                    $scope.userPopoverFocus = true;
                    var popoverOptions = {
                        id: 'userPopOver',
                        templateurl: 'heading-popover-user.html',
                        controller: function ($scope) {
                            $scope.applications = util.mapToArray(applications);
                        },
                        close: function () {
                            $scope.userPopoverFocus = false;
                        }
                    };

                    HeadingPopoverService.active(popoverOptions);
                };


                $scope.toggleNotificationsPopOver = function () {
                    $scope.notificationPopoverFocus = true;
                    var popoverOptions = {
                        id: 'notificationsPopOver',
                        templateurl: 'heading-popover-notifications.html',
                        controller: function ($scope) {
                            $scope.notifications = [];
                        },
                        close: function () {
                            $scope.notificationPopoverFocus = false;
                        }
                    };

                    HeadingPopoverService.active(popoverOptions);
                };

                /**
                 * Oculta e exibe a barra lateral
                 *
                 * @returns {undefined}
                 */
                $scope.toggleSidebar = function () {
                    LayoutService.toggleSidebar();
                };

                $scope.shownModules = function (obj) {
                    return (!obj.hide && obj.active);
                };

                $scope.$on('heading.change-logo', function ($event, logoSrc) {
                    $scope.logoSrc = logoSrc + "?_=" + new Date().getTime();
                });

                $scope.$on('heading.remove-logo', function ($event, logoSrc) {
                    $scope.logoSrc = null;
                });

                $scope.$on('user.refresh.done', function ($event, user) {
                    $scope.user = user;
                    $scope.getUserAvatarUrl();
                });

                $scope.$on('layout.modulechange', function ($event, module) {
                    $scope.currentModule = module;
                });

                identifyAndHighlightUserDomain = function(domainSelected){
                    for(var i = 0; i < $scope.user.domains.length; i++){
                        if($scope.user.domains[i].name === domainSelected){
                            $scope.user.domains[i].selected = true;
                        }else{
                            $scope.user.domains[i].selected = false;
                        }
                    }
                };

                $scope.toggleDomainMenu = function($event){
                    $scope.toggleDomain = !$scope.toggleDomain;
                    $event.stopPropagation();
                };

                $scope.changeDomain = function(domain){
                    var currentDomain = $cookieStore.get('user.domain.name');
                    if(currentDomain !== domain.name){
                        $cookieStore.put('user.domain.name', domain.name);
                        identifyAndHighlightUserDomain(domain.name);
                        reloadPageAfterDomainSelection();
                    }
                    $scope.toggleDomain = false;
                };

                reloadPageAfterDomainSelection = function(){
                    $route.reload();
                };

            }
        };
    });
});
