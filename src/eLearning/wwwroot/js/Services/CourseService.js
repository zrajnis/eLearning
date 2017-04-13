angular.module('eLearning').service('courseService', ['constants', '$http', '$timeout', function (constants, $http ,$timeout) { 
    this.course = { //properties are uppercased so they match models on server
        Name: null,
        Description: null,
        Lessons: [],
        Exercises: []
    };

    this.addLesson = (formName) => {
        if ((formName.lessons.$valid || !formName.lessons.$touched) && formName.lessons.$modelValue < 10) {
            formName.lessons.$setTouched(true);
            this.course.Lessons.push({
                Name: null,
                Description: null
            });
        }
        else if (formName.lessons.$modelValue === 10) { //if user already created 10 lessons and tried to add another one,show error
            formName.lessons.$setDirty(true);
            console.log(formName.lessons.$dirty)
            $timeout(formName.lessons.$setDirty(false), 2000); //after 2 seconds remove the error, doesnt work
        }
    };

    this.addExercise = (formName) => {
        if (formName.exercises.$valid && formName.exercises.$modelValue < 10) {
            this.course.Exercises.push({
                Name: null,
                Description: null,
                Questions: []
            });
        }
        else if (formName.exercises.$modelValue === 10) {
            formName.exercises.$setDirty(true);
            setTimeout(() => formName.exercises.$setDirty(false), 2000);
        }

    };

    this.addQuestion = (exerciseIndex, formName) => {
        if ((formName["questions" + exerciseIndex].$valid || !formName["questions" + exerciseIndex].$touched) && formName["questions" + exerciseIndex].$modelValue < 100) {
            this.course.Exercises[exerciseIndex].Questions.push({
                Sentence: null,
                Points: null,
                Answers: []
            });
        }
        else if (formName["questions" + exerciseIndex].$modelValue === 100) {
            formName["questions" + exerciseIndex].$setDirty(true);
            setTimeout(() => formName["questions" + exerciseIndex].$setDirty(true), 2000);
        }
        
    };

    this.addAnswer = (exercise, questionIndex) => {
        const exerciseIndex = this.course.Exercises.indexOf(exercise);

        this.course.Exercises[exerciseIndex].Questions[questionIndex].Answers.push({
            Sentence: this.course.Exercises[exerciseIndex].Questions[questionIndex].Answer,
            IsCorrect: false
        });
    };

    this.createCourse = (formName) => {
        if (formName.$valid) {
            const fd = new FormData();

            $.each($("input[type='file']"), (i, input) => { //append each uploaded file to the form data
                fd.append('file' + i, input.files[0]);
            });

            fd.append('course', JSON.stringify(this.course));
            $http.post('/Course/Create', fd, {
                //transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }
        else {
            angular.forEach(formName.$error, (field) => { //TODO: make this work for all elements
                angular.forEach(field, (errorField) => {
                    errorField.$setTouched();
                });
            });
        }
    };
}]);

/*angular.forEach(formName.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                })
            });*/