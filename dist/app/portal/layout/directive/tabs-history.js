define(["connecta.portal"],function(portal){return portal.directive("appPagesTabsHistory",["pageService",function(pageService){return{restrict:"A",replace:true,templateUrl:"app/portal/layout/directive/template/tabs-history.html",scope:{page:"="},link:function(scope,element){scope.pageHistory=pageService.getPageHistory();scope.$on("page.change",function(){scope.pageHistory=pageService.getPageHistory()});scope.$on("page.remove",function(){scope.pageHistory=pageService.getPageHistory()});var eleHeight=window.screen.height;eleHeight=eleHeight-eleHeight*22.5/100;$("> ul",element).slimScroll({color:"#a1b2bd",size:"4px",height:eleHeight,alwaysVisible:false})}}}])});