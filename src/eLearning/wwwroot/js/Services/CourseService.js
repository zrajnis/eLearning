angular.module('eLearning').service('courseService', ['constants', '$http', '$timeout', '$window', function (constants, $http ,$timeout, $window) { 
    $('#createForm').on('keyup keypress', function (e) { //disable submit when enter is pressed
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

    this.course = {
        name: null,
        description: null,
        lessons: [],
        exercises: []
    };

    this.addLesson = formName => {
        if (formName.lessonsLength.$modelValue < 10) {
            formName.lessonsLength.$setTouched(true);
            this.course.lessons.push({
                name: null,
                description: null
            });
            $timeout(() => scrollBottom('lessonsFieldsetElements'), 1);
        }
        else { //if user already created 10 lessons and tried to add another one,show error 
            formName.lessonsLength.$setTouched(true);
            formName.lessonsLength.$setValidity('pattern', false);
            $timeout(() => formName.lessonsLength.$setValidity('pattern', true), 2000)

        }
    };

    this.addExercise = formName => {
        if (formName.exercisesLength.$valid && formName.exercisesLength.$modelValue < 10) {
            this.course.exercises.push({
                name: null,
                description: null,
                questions: []
            });;
            $timeout(() => scrollBottom('exercisesFieldsetElements'), 1);
        }
        else {
            formName.exercisesLength.$setTouched(true);
            formName.exercisesLength.$setValidity('pattern', false);
            $timeout(() => formName.exercisesLength.$setValidity('pattern', true), 2000);
        }

    };

    this.addQuestion = (formName, exerciseIndex) => {
        const questionsLength = formName['questionsLength' + exerciseIndex];

        if (questionsLength.$modelValue < 100) {
            this.course.exercises[exerciseIndex].questions.push({
                sentence: null,
                points: null,
                answers: []
            });
            $timeout(() => scrollToQuestion('addQuestionBtn' + exerciseIndex), 1);
        }
        else { //for consistency 
            questionsLength.$setTouched(true);
            questionsLength.$setValidity('pattern', false);
            $timeout(() => questionsLength.$setValidity('pattern', true), 2000);
        }
        
    };

    this.addAnswer = (formName, exercise, questionIndex) => {
        let answer = formName['answer' + questionIndex];
        const answersLength = formName['answersLength' + questionIndex];
        const exerciseIndex = this.course.exercises.indexOf(exercise);

        if (answersLength.$modelValue < 5 && answer.$valid && answer.$modelValue) { //answer field isnt required, so empty field passes as valid, hence last condition
            this.course.exercises[exerciseIndex].questions[questionIndex].answers.push({
                sentence: this.course.exercises[exerciseIndex].questions[questionIndex].answer,
                isCorrect: false
            });
            this.course.exercises[exerciseIndex].questions[questionIndex].answer = ''; //reset field value
            $timeout(() => scrollToAnswer('questionContainerE' + exerciseIndex + 'Q' + questionIndex), 1);
        }
        else if (!answer.$valid || !answer.$modelValue) {
            answer.$setValidity('pattern', false);
            if (answer.$pristine) {
                answer.$setTouched(true); //in case user didn't even click on the input, this makes sure it shows error as well
            }

            $timeout(() => answer.$setValidity('pattern', true), 2000);  
        }
        else {
            answersLength.$setTouched(true);
            answersLength.$setValidity('pattern', false);
            $timeout(() => answersLength.$setValidity('pattern', true), 2000);
        }
    };


    this.createCourse = formName => {
        if (formName.$valid) {
            let fd = new FormData();

            $.each($("input[type='file']"), (i, input) => { //append each uploaded file to the form data
                fd.append('Files', input.files[0]);
            });

            fd.append('Name', this.course.name);
            fd.append('Description', this.course.description);

            for (let i = 0; i < this.course.lessons.length; i++) {
                fd.append('Lessons[]', JSON.stringify(this.course.lessons[i]));
            }

            for (let i = 0; i < this.course.exercises.length; i++) {
                fd.append('Exercises[]', JSON.stringify(this.course.exercises[i]));
            }

            $http.post('/Course/Create', fd, {
                //transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(response => {
                if (response.data.message === 'Success!') {
                    $window.location.href = '/Course/Create';
                }
                else {
                    $('#createError').text(response.data.message);
                    $timeout(() => {
                        $('#createError').text('');
                    }, 2000);
                }
            });
        }
        else {
            touchOnSubmit(formName);
        }
    };

    this.remove = (array, index) => {
        array.splice(index, 1);
    };

    const touchOnSubmit = formName => {
        angular.forEach(formName.$error, (field) => {
            angular.forEach(field, (errorField) => {
                if (!errorField.$name.includes('Form')) {
                    errorField.$setTouched();
                }
                else { //if error field has "Form" in its name, then it's ng-form, so we call the same function in order to touch its fields
                    touchOnSubmit(errorField);
                }
            });
        });
    };

    const scrollBottom = id => {
        const el = $('#' + id);

        el.scrollTop(el.prop('scrollHeight'));
    };

    const scrollToQuestion = (id, exerciseId) => {
        const el = $('#' + id);
        const fieldsetContainer = $('#exercisesFieldsetElements');

        fieldsetContainer.scrollTop(el.position().top - 400);
    };

    const scrollToAnswer = (id) => {
        const questionContainer = $('#' + id);
        const fieldsetContainer = $('#exercisesFieldsetElements');

        fieldsetContainer.scrollTop(questionContainer.position().top + 75);
    };
}]);