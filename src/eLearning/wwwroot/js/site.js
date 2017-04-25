﻿const app = angular.module('eLearning', ['ngRoute', 'ngFileUpload']);

app.constant('constants', {
    firstNameRegex: /^[a-zA-Z0-9.'\s]{2,32}$/,
    lastNameRegex: /^[a-zA-Z0-9.'\s]{2,32}$/,
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*\d).{6,}$/,
    pointsRegex: /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/,
    lengthRegex: /^[2-5]$/,

    fileError: 'Please upload a file in .pdf format.',
    sizeError: 'File must be smaller than 10MB.',
    answersLengthError: 'Must provide between 2 and 5 answers.',
    lessonsLengthError: 'Must provide between 1 and 10 lessons.',
    exercisesLengthError: 'Maximum of 10 exercises reached.',
    questionsLengthError: 'Must provide between 1 and 100 questions.',
    nameError: 'Please enter a valid name.',
    courseDescriptionError: 'Please enter a valid description.',
    descriptionError: 'Please enter a valid description.',
    sentenceError: 'Please enter a valid sentence.',
    pointsError: 'Please enter a valid amount of points.',
    firstNameError: 'Please enter a valid first name.',
    lastNameError: 'Please enter a valid last name.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Must have at least 1 digit and length over 5.',
    rePasswordError: 'Passwords must match.',
    signUpError: 'Sign up failed.',
    signInError: 'Sign in failed.'
});
