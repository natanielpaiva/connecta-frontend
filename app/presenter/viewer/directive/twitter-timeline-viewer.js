/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util'
], function (portal) {
    return portal.lazy.directive('twitterTimelineViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/twitter-timeline-viewer.html',
            scope: {
                model: '=ngModel',
                edit: '=?edit'
            },
            controller: function ($scope, $timeout, util) {
                $scope.uuid = util.uuid();

                var iframeId = '';

                $scope.$watch('model.twitterUser', function() {
                    var frame = document.getElementById(iframeId);

                    if(frame)
                        frame.parentNode.removeChild(frame);

                    $timeout(function() {
                        twttr.widgets.createTimeline(
                          {
                            sourceType: 'profile',
                            screenName: $scope.model.twitterUser === undefined ?
                                'twitterdev' : $scope.model.twitterUser
                          },
                          document.getElementById('twitter-timeline-' + $scope.uuid),
                          {
                            width: '100%',
                            height: '100%',
                            chrome: 'nofooter'
                          }
                        ).then(function (el) {
                            iframeId = el.id;
                        });
                    },1000);
                });
            }
        };
    });
});
