define([
    'connecta.speaknow',
    'speaknow/poll/service/poll-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('PollResultsController', function (
            $scope, $routeParams, PollService, notify) {

    	var id = $routeParams.id;
        var chartConfig = {
            "type": "pie",
            "theme": "light",
            "valueField": "total",
            "titleField": "name",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "export": {
                "enabled": true
            }
        };
        $scope.data = [];

        var setupCharts = function(data){
            $scope.results = data;

            for(var question in data.questions){
                //append dataProvider to chart template
                var questionAnswers = data.questions[question];
                chartConfig.dataProvider = questionAnswers;

                var chartAnswers = {};
                angular.copy(chartConfig, chartAnswers);

                $scope.data.push({
                    "question": question, 
                    "answers": chartAnswers
                });
            }
        };

        var init = function(){
            PollService.answers(id)
                    .success(setupCharts.bind(this))
                    .error(notify.error.bind('Error', 'answers not found'));
        };

        init();
    });
});