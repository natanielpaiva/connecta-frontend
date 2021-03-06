define([
    'connecta.portal'
], function (portal) {
    /**
     * Componente usado para renderizar e manter o menu
     */
    return portal.directive('menu', function () {
        return {
            // replace: true,
            templateUrl: 'app/portal/layout/directive/template/menu.html',
            controller: function ($scope, $location, $menu) {
                /**
                 * Testa se esse menu é o ativo atualmente
                 *
                 * @param {type} item
                 * @returns {Boolean}
                 */
                $scope.isActive = function (item) {
                    var active = false;
                    if (item.activeIf) {
                        active = new RegExp(item.activeIf).test($location.url());
                    } else if (item.href) {
                        // Monta uma RegExp e testa contra a url atual removendo a primeira barra
                        var regex = item.href + '($|[\/].*)';
                        active = new RegExp(regex).test($location.url());
                    }
                    // Caso o menu tenha filhos, verifica recursivamente se
                    // algum deles é o ativo
                    if (item.children && item.children.length) {
                        var activeChildren = item.children.filter(function (child) {
                            return $scope.isActive(child);
                        });

                        active = active || activeChildren.length > 0;
                    }

                    return active;
                };

                $scope.toggle = function (item) {
                    if (item.children && item.children.length) {
                        item.opened = !item.opened;
                    }
                };

                $scope.isOpened = function (item) {
                    return item.opened;
                };

                $scope.menu = $menu.getCurrent();

                $scope.$on('menu.change', function (event, newMenu) {
                    $scope.menu = newMenu;
                });
                
                $scope.$on('layout.modulechange', function ($event, module) {
                    $scope.currentModule = module;
                });
            }
        };
    });
});
