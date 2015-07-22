define([
    'connecta.presenter',
    'bower_components/amcharts/dist/amcharts/serial'
], function (presenter) {
    /**
     * Componente usado para renderizar os gráficos de barra
     * @param {type} applicationsService
     */
    return presenter.directive('amChartSerialColumn', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                height: '=',
                width: '='
            },
            templateUrl: 'app/presenter/viewer/directive/template/am-chart-serial-column.html',
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

                        //Instanciando o chart de serial
                        chart = new AmCharts.AmSerialChart();

                        chart.dataProvider = option.data;

                        var chartKeys = Object.keys(option);
                        for (var i = 0; i < chartKeys.length; i++) {
                            if (typeof option[chartKeys[i]] !== 'object' && typeof option[chartKeys[i]] !== 'function') {
                                chart[chartKeys[i]] = option[chartKeys[i]];
                            }
                        }

                        if (option.categoryAxis) {
                            var categoryAxis = chart.categoryAxis;

                            if (categoryAxis) {
                                keys = Object.keys(option.categoryAxis);
                                for ( i = 0; i < keys.length; i++) {
                                    if (!angular.isObject(option.categoryAxis[keys[i]]) || angular.isArray(option.categoryAxis[keys[i]])) {
                                        categoryAxis[keys[i]] = option.categoryAxis[keys[i]];
                                    } else {
                                        console.log('Stripped categoryAxis obj ' + keys[i]);
                                    }
                                }
                                chart.categoryAxis = categoryAxis;
                            }

                        }

                        var addValueAxis = function (a) {
                            var valueAxis = new AmCharts.ValueAxis();

                            keys = Object.keys(a);
                            for (i = 0; i < keys.length; i++) {
                                if (typeof a[keys[i]] !== 'object') {
                                    valueAxis[keys[i]] = a[keys[i]];
                                }
                            }
                            chart.addValueAxis(valueAxis);
                        };

                        if (option.valueAxes && option.valueAxes.length > 0) {
                            for ( i = 0; i < option.valueAxes.length; i++) {
                                addValueAxis(option.valueAxes[i]);
                            }
                        }

                        var addGraph = function (g) {
                            var graph = new AmCharts.AmGraph();
                            /** set some default values that amCharts doesnt provide **/
                            // if a category field is not specified, attempt to use the second field from an object in the array as a default value
                            graph.valueField = g.valueField || Object.keys(option.data[0])[1];
                            graph.balloonText = '<span style="font-size:14px">[[category]]: <b>[[value]]</b></span>';
                            if (g) {
                                var keys = Object.keys(g);
                                // iterate over all of the properties in the graph object and apply them to the new AmGraph
                                for ( i = 0; i < keys.length; i++) {
                                    graph[keys[i]] = g[keys[i]];
                                }
                            }
                            chart.addGraph(graph);
                        };

                        if (option.graphs && option.graphs.length > 0) {
                            for ( i = 0; i < option.graphs.length; i++) {
                                addGraph(option.graphs[i]);
                            }
                        } else {
                            addGraph();
                        }

                        var chartCursor = new AmCharts.ChartCursor();
                        if (option.chartCursor) {
                            keys = Object.keys(option.chartCursor);
                            for ( i = 0; i < keys.length; i++) {
                                if (typeof option.chartCursor[keys[i]] !== 'object') {
                                    chartCursor[keys[i]] = option.chartCursor[keys[i]];
                                }
                            }
                            chart.addChartCursor(chartCursor);
                        }


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
