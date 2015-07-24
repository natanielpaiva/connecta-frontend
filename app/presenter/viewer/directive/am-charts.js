define([
    'connecta.presenter',
], function (presenter) {
    /**
     * Componente usado para renderizar os gráficos de barra
     * @param {type} applicationsService
     */
    return presenter.directive('amCharts', function () {
        return {
            scope: {
                options: '='
            },
            templateUrl: 'app/presenter/viewer/directive/template/am-chart-templates.html'
        };
    });
});
