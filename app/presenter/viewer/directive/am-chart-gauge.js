define([
    'connecta.presenter',
    'bower_components/amcharts/dist/amcharts/gauge'
], function (presenter) {
    /**
     * Componente usado para renderizar os gráficos de barra
     * @param {type} applicationsService
     */
    return presenter.directive('amChartGauge', function () {
        return {
            replace: true,
            require: "ngModel",
            scope: {
                options: '=ngModel'
            },
            templateUrl: 'app/presenter/viewer/directive/template/am-chart.html',
            link: function (scope, $el) {
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

                if (scope.options) {
                    //Função que renderiza o gráfico na tela
                    var renderChart = function (amChartOptions) {
                        var option = amChartOptions || scope.options;
                        //Instanciando o chart de pie
                        chart = new AmCharts.AmAngularGauge();
                        chart.dataProvider = option.data;

                        //Colocando no objeto chart todos as propriedades que vierem no option
                        var chartKeys = Object.keys(option);
                        for (var i = 0; i < chartKeys.length; i++) {
                            if (typeof option[chartKeys[i]] !== 'object' && typeof option[chartKeys[i]] !== 'function') {
                                chart[chartKeys[i]] = angular.copy(option[chartKeys[i]]);
                            } else {
                                chart[chartKeys[i]] = angular.copy(option[chartKeys[i]]);
                            }
                        }
                        //Método do objeto Amchart para rendererizar o gráfico
                        chart.write(id);
                    };

                    renderChart();
                    //Escutando o objeto para que quando o mesmo for alterado reflita no gráfico
                    scope.$watch('options', function (newValue, oldValue) {
                        if (id === $el[0].id || !id) {
                            renderChart(newValue);
                        }
                    }, true);
                    
                }
            }
        };
    });
});
