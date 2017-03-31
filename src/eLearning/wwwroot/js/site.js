const app = angular.module('eLearning', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "Home",
        controller: 'HomeCtrl'
    })
    .when("/User", {
        templateUrl: "User"
    })
    .when("/Search", {
        templateUrl: "Home/Search"
    })
    .when("/User/Search", {
        templateUrl: "/User/Search"
    });
});

app.constant('constants', {
    firstNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    lastNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*\d).{6,}$/,

    firstNameError: 'Please enter a valid first name.',
    lastNameError: 'Please enter a valid last name.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Must have at least 1 digit and length over 5.',
    rePasswordError: 'Passwords must match.',
    signUpError: 'Sign up failed.',
    signInError: 'Sign in failed.'
});



