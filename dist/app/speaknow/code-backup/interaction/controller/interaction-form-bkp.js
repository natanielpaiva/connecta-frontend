define(["connecta.speaknow","speaknow/interaction/service/interaction-service"],function(speaknow){return speaknow.lazy.controller("InteractionFormController",["$scope","InteractionService","$location","$routeParams",function($scope,InteractionService,$location,$routeParams){$scope.interaction={};$scope.interaction.questions=[];$scope.interaction.contacts=[];$scope.question={};$scope.question.questionItems=[];$scope.steps=[true,false,false];$scope.stepsIcons=[true,false,false];$scope.currentStep=0;InteractionService.getQuestionTypes().then(function(response){$scope.questionTypes=response.data},function(response){});if($routeParams.id){}$scope.submit=function(){InteractionService.save($scope.interaction).then(function(){$location.path("speaknow/interaction")},function(response){})};$scope.activeStep=function(step){$scope.steps[$scope.currentStep]=false;$scope.steps[step]=true;$scope.currentStep=step;angular.forEach($scope.stepsIcons,function(value,key){if(key<=step){$scope.stepsIcons[key]=true}else{$scope.stepsIcons[key]=false}})};$scope.addQuestion=function(){$scope.interaction.questions.push($scope.question);$scope.question={};$scope.question.items=[]};$scope.removeQuestion=function(question){var index=$scope.questions.indexOf(question);$scope.questions.splice(index,1)};$scope.addContact=function(){$scope.contacts.push($scope.contact);$scope.contact=null};$scope.removeContact=function(contact){var index=$scope.contacts.indexOf(contact);$scope.contacts.splice(index,1)}}])});