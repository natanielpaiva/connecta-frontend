/* global angular */
define([
    'connecta.portal'
], function (portal) {

    return portal.lazy.service('ConnectaConfigService', function(applications, $http){

        this.getJob = function(){
            var url = applications.presenter.host + "/" + "quartzJob/RefreshAnalysisJob";
            return $http.get(url);
        };

        this.reschedule = function (job, interval) {
            job.interval = interval;
            var url = applications.presenter.host + "/" + "quartzJob/reschedule";
            return $http.post(url, job);
        };

    });
});

