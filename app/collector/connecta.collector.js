define([
    'angular'
], function (angular) {
    var collector = angular.module('connecta.collector', []);
    
    collector._routes = {
//        Utilizar esse formato
//        
//        '/route/': {
//            controller: 'HomeController',
//            controllerUrl: 'module/submodule/controller/controller-name',
//            templateUrl: 'app/module/submodule/template/template-name.html'
//        }
    };
    
    return collector;
});