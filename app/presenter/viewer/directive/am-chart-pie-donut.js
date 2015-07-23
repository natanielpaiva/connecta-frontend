define([
    'connecta.presenter',
    'bower_components/amcharts/dist/amcharts/pie'
], function (presenter) {
    /**
     * Componente usado para renderizar os gráficos de barra
     * @param {type} applicationsService
     */
    return presenter.directive('amChartPieDonut', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                height: '=',
                width: '='
            },
            templateUrl: 'app/presenter/viewer/directive/template/am-chart.html',
            link: function ($scope, $el) {

                var id = $el[0].id;
                $el.attr('id', id);

                var chart;

                if ($scope.options.data) {
                    var renderChart = function (amChartOptions) {
                        var option = amChartOptions || $scope.options;
                        var keys = 0;

                        //Tamanho e largura default do gráfico
                        var height = $scope.height || '400px';
                        var width = $scope.width || '800px';

                        $el.css({
                            'height': height,
                            'width': width
                        });

                        // PIE CHART
                        chart = new AmCharts.AmPieChart();

                        chart.dataProvider = option.data;

                        chart.path = option.path;
                        chart.balloonText = option.balloonText;
                        if (option.innerRadius !== undefined)
                            chart.innerRadius = option.innerRadius;
                        chart.titleField = option.titleField;
                        chart.valueField = option.valueField;
                        chart.allLabels = option.allLabels;
                        chart.balloon = option.balloon;

                        chart.backgroundAlpha = 0.4;

                        chart.sequencedAnimation = true;
                        chart.startEffect = "elastic";
                        chart.labelsEnabled = true;
                        chart.labelText = "[[title]]";
                        chart.startDuration = option.startDuration;
                        chart.labelRadius = option.labelRadius;
                        chart.depth3D = option.depth3D;
                        chart.legend = option.legend;
                        chart.titles = option.titles;

                        // WRITE
                        chart.write(id);


                    };

                    renderChart();

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
