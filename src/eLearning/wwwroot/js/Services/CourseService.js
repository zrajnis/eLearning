﻿angular.module('eLearning').service('courseService', ['constants', '$http', function (constants, $http) { 
    this.course = { //properties are uppercased so they match models on server
        Name: null,
        Description: null,
        Lessons: [],
        Exercises: []
    };

    this.addLesson = () => {
        this.course.Lessons.push({
            Name: null,
            Description: null
        });
    };

    this.addExercise = () => {
        this.course.Exercises.push({
            Name: null,
            Description: null,
            Questions: []
        });
    };

    this.addQuestion = (exerciseIndex) => {
        this.course.Exercises[exerciseIndex].Questions.push({
            Sentence: null,
            Points: null,
            Answers: []
        });
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