define([
    'connecta.presenter',
    'bower_components/amcharts/dist/amcharts/funnel'
], function (presenter) {
    /**
     * Componente usado para renderizar os gráficos de barra
     * @param {type} applicationsService
     */
    return presenter.directive('amChartFunnel', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '='
            },
            templateUrl: 'app/presenter/viewer/directive/template/am-chart.html',
            link: function ($scope, $el) {
                //Gerando um uid para colocar no elemento
                var guid = function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                };

                var id = guid();
                $el.attr('id', id);
                var chart;

                if ($scope.options.data) {
                    //Função que renderiza o gráfico na tela
                    var renderChart = function (amChartOptions) {
                        var option = amChartOptions || $scope.options;
                        //Instanciando o chart de funnel
                        chart = new AmCharts.AmFunnelChart();
                        chart.dataProvider = option.data;

                        //Colocando no objeto chart todos as propriedades que vierem no option
                        var chartKeys = Object.keys(option);
                        for (var i = 0; i < chartKeys.length; i++) {
                            if (typeof option[chartKeys[i]] !== 'object' && typeof option[chartKeys[i]] !== 'function') {
                                chart[chartKeys[i]] = option[chartKeys[i]];
                            } else {
                                chart[chartKeys[i]] = angular.copy(option[chartKeys[i]]);
                            }
                        }
                        //Método do objeto Amchart para rendererizar o gráfico
                        chart.write(id);
                    };

                    renderChart();
                    //Evento para renderizar os gráficos de qualquer controller
                    $scope.$on('amCharts.renderChart', function (event, amChartOptions, id) {
                        if (id === $el[0].id || !id) {
                            renderChart(amChartOptions);
                        }
                    });
                }
            }
        };
    });
});
