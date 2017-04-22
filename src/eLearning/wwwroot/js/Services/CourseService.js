angular.module('eLearning').service('courseService', ['constants', '$http', '$timeout', '$window', function (constants, $http ,$timeout, $window) { 
    this.course = { //properties are uppercased so they match models on server
        Name: null,
        Description: null,
        Lessons: [],
        Exercises: []
    };

    this.addLesson = formName => {
        if (formName.lessonsLength.$modelValue < 10) {
            formName.lessonsLength.$setTouched(true);
            this.course.Lessons.push({
                Name: null,
                Description: null
            });
        }
        else { //if user already created 10 lessons and tried to add another one,show error
            formName.lessonsLength.$setDirty(true);
            $timeout(formName.lessonsLength.$setDirty(false), 2000); //after 2 seconds remove the error, doesnt work
        }
    };

    this.addExercise = formName => {
        if (formName.exercisesLength.$valid && formName.exercisesLength.$modelValue < 10) {
            this.course.Exercises.push({
                Name: null,
                Description: null,
                Questions: []
            });
        }
        else {
            formName.exercisesLength.$setDirty(true);
            setTimeout(() => formName.exercisesLength.$setDirty(false), 2000);
        }

    };

    this.addQuestion = (formName, exerciseIndex) => {
        const questionsLength = formName["questionsLength" + exerciseIndex];

        if (questionsLength.$modelValue < 100) {
            this.course.Exercises[exerciseIndex].Questions.push({
                Sentence: null,
                Points: null,
                Answers: []
            });
        }
        else { //for consistency 
            questionsLength.$setDirty(true);
            setTimeout(() => questionsLength.$setDirty(false), 2000);
        }
        
    };

    this.addAnswer = (formName, exercise, questionIndex) => {
        const answer = formName["answer" + questionIndex];
        const answersLength = formName["answersLength" + questionIndex];
        const exerciseIndex = this.course.Exercises.indexOf(exercise);

        if (answersLength.$modelValue < 5 && answer.$valid && answer.$modelValue) { //answer field isnt required, so empty field passes as valid, hence last condition
            this.course.Exercises[exerciseIndex].Questions[questionIndex].Answers.push({
                Sentence: this.course.Exercises[exerciseIndex].Questions[questionIndex].Answer,
                IsCorrect: false
            });
        }
        else if (!answer.$valid || !answer.$modelValue) {
            answer.$setValidity("pattern", false);
            setTimeout(() => answer.$setValidity("pattern", true), 200);
            if (answer.$pristine) {
                answer.$setTouched(true); //in case user didn't even click on the input, this makes sure it shows error as well
            }
        }
        else {
            answersLength.$setDirty(true);
            setTimeout(() => answersLength.$setDirty(false), 2000);
        }
    };


    this.createCourse = formName => {
        if (formName.$valid) {
            let fd = new FormData();

            $.each($("input[type='file']"), (i, input) => { //append each uploaded file to the form data
                fd.append('Files', input.files[0]);
            });

            fd.append('Name', this.course.Name);
            fd.append('Description', this.course.Description);

            for (let i = 0; i < this.course.Lessons.length; i++) {
                fd.append('Lessons[]', JSON.stringify(this.course.Lessons[i]));
            }

            for (let i = 0; i < this.course.Exercises.length; i++) {
                fd.append('Exercises[]', JSON.stringify(this.course.Exercises[i]));
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
                    setTimeout(() => {
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
        console.log('entered remove');
        console.log('array ' + JSON.stringify(array));
        console.log('index' + index);
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
}]);