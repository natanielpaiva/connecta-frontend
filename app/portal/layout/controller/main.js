define([
    'connecta.portal',
    'portal/layout/directive/layout'
], function(portal) {

    /**
     * Controller principal da aplicação
     */
    return portal.controller('appMain', function($scope, applicationsService, applications) {
        // Atualiza a lista de aplicações do portal
        applicationsService.setApplications(applications);

        resetStyles = function() {
            //Carrega os estilos personalizados da aplicação
            $scope.stylesheets = [];

            // adiciona o estilo base de todas as aplicações registrada
            for (var a in applications) {
                if (!applications.hasOwnProperty(a)) {
                    continue;
                }
                var application = applications[a];
                $scope.stylesheets.push('assets/css/'+application.name+'.css');
            }
        };

        resetStyles();

        // FIXME Remover esses estilos sob demanda, o Frontend tem que ser íntegro
        // Evento ao atualizar a aplicação em execução
        $scope.$on('applications.change', function(event) {
            resetStyles();

            // Adiciona os estilos personalizados da aplicação atual
            var appInstance = applicationsService.getInstance();
            if (appInstance && appInstance.styles) {
                $.each(appInstance.styles, function(i, item) {
                    $scope.stylesheets.push(appInstance.host + '/resources/css/' + item);
                });
            }

            $scope.actualAppName = appInstance.name;
        });
    });
});