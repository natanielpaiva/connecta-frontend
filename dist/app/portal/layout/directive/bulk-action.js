define(["connecta.portal"],function(portal){return portal.directive("bulkAction",function(){return{restrict:"E",scope:{icon:"@",title:"@"},templateUrl:"app/portal/layout/directive/template/bulk-action.html"}})});