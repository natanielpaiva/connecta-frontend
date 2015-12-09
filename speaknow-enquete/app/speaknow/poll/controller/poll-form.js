define([
    'connecta.speaknow',
    'speaknow/poll/service/poll-service',
    'portal/layout/service/notify',
], function (speaknow) {
    return speaknow.lazy.controller('PollController', 
        function ($scope, PollService, $location, $routeParams, notify) {

        var defaultAnswerType = 'SINGLE';
        var answerTypeText = 'TEXT';
           
        //used to show answers or input type text to question     
        $scope.questionText = false;
            
        $scope.imageFile = [];
        $scope.removeImage = false;
        $scope.imageUrl = [];
        $scope.poll = {};
        $scope.poll.questions = [];
        $scope.pollImage = null;
        $scope.question = {};
        $scope.answers = [];
        
        //Variável usada para ativar e desativar os steps
        $scope.steps = [true, false, false];

        //Variável usada para ativar e desativar ícones dos steps
        $scope.stepsIcons = [true, false, false];

        //Variável com o step atual
        $scope.currentStep = 0;

        $scope.answer_types = {
            "TEXT":"POLL.ANSWER_TYPES.TEXT", 
            "SINGLE": "POLL.ANSWER_TYPES.SINGLE", 
            "MULTIPLE": "POLL.ANSWER_TYPES.MULTIPLE"
        };

        $scope.answer_type = defaultAnswerType;

        if ($routeParams.id) {
            //TOOD: Implementar update
        }

        $scope.submit = function () {
             PollService.save($scope.poll, $scope.fileImage, $scope.removeImage).then(function () {
                notify.success('POLL.SUCCESS');
                $location.path('speaknow/poll');
            }, function(response){
                if(response.status === 403){
                    notify.success('POLL.FORBIDDEN');
                }else if(response.status === 404){
                    notify.error('POLL.NOT_FOUND');
                }
            });
        };

        $scope.changeQuestionType = function(){
            $scope.questionText = $scope.answer_type === answerTypeText;
        };

        /**
         * Método responsável por ativar e desativar os steps
         * @param {int} step: Número do step a ser atualizado
         */
        $scope.activeStep = function (step, next) {
            if(next && !validateForm(step)){
                return;
            }

            $scope.steps[$scope.currentStep] = false;
            $scope.steps[step] = true;
            $scope.currentStep = step;

            //Deixa os ícones do steps azuis
            angular.forEach($scope.stepsIcons, function (value, key) {
                if (key <= step) {
                    $scope.stepsIcons[key] = true;
                } else {
                    $scope.stepsIcons[key] = false;
                }
            });
        };

        $scope.addQuestion = function () {
            if(typeof $scope.question.description === 'undefined'){
                notify.warning("POLL.DESCRIPTION_WARNING");    
                return;
            }

            if(!validateChoicesQuestion()){
                return;
            }

            if(!$scope.questionText){
                //set answers if question is single or multiple choice
                $scope.question.items = $scope.answers;
            }

            //Pega o model e atribui a question para não zera o select
            $scope.question.type = $scope.answer_type;

            //quando editar a questão
            if($scope.question.index >= 0){
                var questionIndex = $scope.question.index;
                delete $scope.question.index;
                $scope.poll.questions[$scope.question.index] = $scope.question;
            }else{
                $scope.poll.questions.push($scope.question);
            }
            
            //Zera o objeto question e adiciona uma array de items
            $scope.question = {};
            $scope.answers = [];
        };

        $scope.addAnswer = function(){
            $scope.answers.push(null);
        };

        $scope.onRemoveAnswer = function(answerIndex){
            $scope.answers.splice(answerIndex, 1);
        };

        $scope.removeQuestion = function (questionIndex) {
            $scope.poll.questions.splice(questionIndex, 1);
        };

        $scope.editQuestion = function(questionIndex){
            var question = $scope.poll.questions[questionIndex];

            $scope.question = question;
            $scope.question.index = questionIndex;
            $scope.answers = question.items;
            $scope.answer_type = question.type;
        };
        
        $scope.validateImage = function (image) {
            var isValid = true;
            if (image.size / 1000000 > 1) {
                notify.warning("POLL.VALIDATION.IMAGESIZE");
                $scope.clearImage();
                isValid = false;
            } else {
                var img = angular.element("<img>")[0];
                img.src = $scope.pollImage;
                if (img.height >= img.width) {
                    notify.warning("POLL.VALIDATION.IMAGEFORM");
                    $scope.clearImage();
                    isValid = false;
                }
            }
            return isValid;
        };

        $scope.onFileSelected = function (files) {
            if (files && files.length) {
                var file = files[0];
                $scope.fileImage = file;
                $scope.imgName = file.name;
                var reader = new FileReader();
                reader.onload = function (e) {
                    if ($scope.validateImage(e)) {
                        $scope.pollImage = e.target.result;
                        $scope.$apply();
                    } else {
                        $scope.pollImage = null;
                    }
                };
                reader.readAsDataURL(files[0]);
            } else {
                notify.warning('POLL.INVALID_DOCUMENT');
            }
        };
        
        $scope.dropImageCallback = function () {
            if ($scope.imageFile.length < 1) {
                $scope.removeImage = true;
            } else {
                $scope.fileImage = $scope.imageFile[0];
                $scope.pollImage = $scope.imageUrl[0].image;
                $scope.validateImage($scope.imageFile[0]);
                $scope.removeImage = false;
            }
        };
        
        $scope.clearImage = function(){
            $scope.removeImage = true;
            $scope.pollImage = null;
            $scope.fileImage = null;
            $scope.imageFile = [];
            $scope.imageUrl = [];
        };

        var validateChoicesQuestion = function(){
            if(!$scope.questionText){
                if($scope.poll.questions.length === 0 &&
                   $scope.answers.length <= 1){
                    notify.warning("INTERACTION.MIN_ANSWER_WARNING");    
                    return false;
                }

                if(!answersAreValid()){
                    notify.warning("INTERACTION.INVALID_ANSWER_WARNING");
                    return false;
                }
            }

            return true;
        };

        var answersAreValid = function(){
            var valid = true;

            for(var index in $scope.answers){
                if ($scope.answers[index] === null){
                    valid = false;
                    break;
                }
            }

            return valid;
        };

        //TODO: refactor validation
        var validateForm = function (step) {
            var forms = {
                0: $scope.poll_step_one,
                1: $scope.poll_step_two
            };    

            if ($scope.pollImage === null) {
                notify.warning('POLL.INVALID_DOCUMENT');
                return false;
            }

            if(step === 2){
                if($scope.poll.questions.length === 0){
                    notify.warning("POLL.MIN_QUESTIONS_WARNING");    
                    return false;
                }

                return validateChoicesQuestion();
            }

            return forms[step - 1].$valid;
        };

    });
});