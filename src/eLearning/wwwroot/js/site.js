const app = angular.module('eLearning', []);

const firstNameRegex = /^[a-zA-Z0-9.\s]{2,}$/;
const lastNameRegex = /^[a-zA-Z0-9.\s]{2,}$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[\s\S]{4,16}$/;

const firstNameError = 'Please enter a valid first name.';
const lastNameError = 'Please enter a valid last name.';
const emailError = 'Please enter a valid email address.';
const passwordError = 'Password must be 4-16 characters long.';
const rePasswordError = 'Passwords must match';

let errorMsg = (errorName, message) => {
    $('#' + errorName + 'Error').text(message);
    $('#' + errorName).addClass('hasError');
    return true;
};

let removeErrorMsg = (errorName) => {
    $('#' + errorName + 'Error').text('');
    $('#' + errorName).removeClass('hasError');
};

app.controller('home', function ($scope) {
    $scope.errorExists = false;

    $scope.clearSignupErrors = () => {
        $scope.errorExists = false;
        $('#signupFirstNameError').text('');
        $('#signupFirstName').removeClass('hasError');
        $('#signupLastNameError').text('');
        $('#signupLastName').removeClass('hasError');
        $('#signupEmailError').text('');
        $('#signupEmail').removeClass('hasError');
        $('#signupPasswordError').text('');
        $('#signupPassword').removeClass('hasError');
        $('#signupRePasswordError').text('');
        $('#signupRePassword').removeClass('hasError');
    }

    $scope.clearSignupData = () => { //resets all values ( input values ,input borders and errors
        $scope.clearSignupErrors();
        $('#signupFirstName').val('');
        $('#signupLastName').val('');
        $('#signupEmail').val('');
        $('#signupPassword').val('');
        $('#signupRePassword').val('');
    }

    $scope.signupValidate = () => {
        if (!firstNameRegex.test($scope.signupFirstName) || !$scope.signupFirstName) { //alternative is pre writing all errors, hiding them and then showing ones that do come up
            $scope.errorExists = errorMsg('signupFirstName', firstNameError);
        }

        if (!lastNameRegex.test($scope.signupLastName) || !$scope.signupLastName) {
            $scope.errorExists = errorMsg('signupLastName', lastNameError);
        }

        if (!emailRegex.test($scope.signupEmail) || !$scope.signupEmail) { // or statement isnt needed for this case ,but still ,consistency
            $scope.errorExists = errorMsg('signupEmail', emailError);
        }

        if (!passwordRegex.test($scope.signupPassword) || !$scope.signupPassword) {
            $scope.errorExists = errorMsg('signupPassword', passwordError);
        }

        if ($scope.signupPassword !== $scope.signupRePassword || !$scope.signupRePassword) {
            $scope.errorExists = errorMsg('signupRePassword', rePasswordError);
        }
    }

    $scope.signupValidateField = (fieldName) => { //is invoked dynamically on input change
        switch (fieldName) {
            case 'signupFirstName':
                if (!firstNameRegex.test($scope.signupFirstName) || !$scope.signupFirstName) {
                    $scope.errorExists = errorMsg('signupFirstName', firstNameError);
                }
                else {
                    removeErrorMsg('signupFirstName');
                }
                break;
            case 'signupLastName':
                if (!lastNameRegex.test($scope.signupLastName) || !$scope.signupLastName) {
                    $scope.errorExists = errorMsg('signupLastName', lastNameError);
                }
                else {
                    removeErrorMsg('signupLastName');
                }
                break;
            case 'signupEmail':
                if (!emailRegex.test($scope.signupEmail) || !$scope.signupEmail) { 
                    $scope.errorExists = errorMsg('signupEmail', emailError);
                }
                else {
                    removeErrorMsg('signupEmail');
                }
                break;
            case 'signupPassword':
                if (!passwordRegex.test($scope.signupPassword) || !$scope.signupPassword) {
                    $scope.errorExists = errorMsg('signupPassword', passwordError);
                }
                else {
                    removeErrorMsg('signupPassword');
                }
                break;
            case 'signupRePassword':
                if ($scope.signupPassword !== $scope.signupRePassword || !$scope.signupRePassword) {
                    $scope.errorExists = errorMsg('signupRePassword', rePasswordError);
                }
                else {
                    removeErrorMsg('signupRePassword');
                }
                break;
            default:
                break;
        }  
    }

    $scope.signup = () => {
        $scope.clearSignupErrors();
        $scope.signupValidate(); //sets $scope.errorExists to true if theres any error
        if ($scope.errorExists) {
            alert('cant sign up');
        }
        else {
            alert('sign up succeeded')
        }
    };

    $scope.clearSigninErrors = () => {
        $scope.errorExists = false;
        $('#signinEmailError').text('');
        $('#signinEmail').removeClass('hasError');
        $('#signinPasswordError').text('');
        $('#signinPassword').removeClass('hasError');
    }

    $scope.clearSigninData = () => {
        $scope.clearSigninErrors();
        $('#signinEmail').val('');
        $('#signinPassword').val('');
    }

    $scope.signinValidate = () => {
        if (!emailRegex.test($scope.signinEmail) || !$scope.signinEmail) {
            $scope.errorExists = errorMsg('signinEmail', emailError);
        }

        if (!passwordRegex.test($scope.signinPassword) || !$scope.signinPassword) {
            $scope.errorExists = errorMsg('signinPassword', passwordError);
        }
    }

    $scope.signinValidateField = (fieldName) => {
        switch (fieldName) {
            case 'signinEmail':
                if (!emailRegex.test($scope.signinEmail) || !$scope.signinEmail) {
                    $scope.errorExists = errorMsg('signinEmail', emailError);
                }
                else {
                    removeErrorMsg('signinEmail');
                }
                break;
            case 'signinPassword':
                if (!passwordRegex.test($scope.signinPassword) || !$scope.signinPassword) {
                    $scope.errorExists = errorMsg('signinPassword', passwordError);
                }
                else {
                    removeErrorMsg('signinPassword');
                }
                break;
            default:
                break;
        }
    }

    $scope.signin = () => {
        $scope.clearSigninErrors();
        $scope.signinValidate(); //sets $scope.errorExists to true if theres any error
        if ($scope.errorExists) {
            alert('cant sign in');
        }
        else {
            alert('sign in succeeded')
        }
    }
});