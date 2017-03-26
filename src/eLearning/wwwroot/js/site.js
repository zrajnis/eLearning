const app = angular.module('eLearning', []);

app.constant('constants', {
    firstNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    lastNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^[\s\S]{4,16}$/,

    firstNameError: 'Please enter a valid first name.',
    lastNameError: 'Please enter a valid last name.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Password must be 4-16 characters long.',
    rePasswordError: 'Passwords must match.'
});

app.service('validateService', ['constants', function(constants) {

    this.errorMsg = (errorName, message) => {
        $('#' + errorName + 'Error').text(message);
        $('#' + errorName).addClass('hasError');
        return true;
    };

    this.removeErrorMsg = (errorName) => {
        $('#' + errorName + 'Error').text('');
        $('#' + errorName).removeClass('hasError');
    };

    this.signupValidate = ($scope) => {
        if (!constants.firstNameRegex.test($scope.signupFirstName) || !$scope.signupFirstName) { //alternative is pre writing all errors, hiding them and then showing ones that do come up
            $scope.errorExists = this.errorMsg('signupFirstName', constants.firstNameError);
        }

        if (!constants.lastNameRegex.test($scope.signupLastName) || !$scope.signupLastName) {
            $scope.errorExists = this.errorMsg('signupLastName', constants.lastNameError);
        }

        if (!constants.emailRegex.test($scope.signupEmail) || !$scope.signupEmail) { // or statement isnt needed for this case ,but still ,consistency
            $scope.errorExists = this.errorMsg('signupEmail', constants.emailError);
        }

        if (!constants.passwordRegex.test($scope.signupPassword) || !$scope.signupPassword) {
            $scope.errorExists = this.errorMsg('signupPassword', constants.passwordError);
        }

        if ($scope.signupPassword !== $scope.signupRePassword || !$scope.signupRePassword) {
            $scope.errorExists = this.errorMsg('signupRePassword', constants.rePasswordError);
        }
    }

    this.signupValidateField = (fieldName, $scope) => { //is invoked dynamically on input change
        switch (fieldName) {
            case 'signupFirstName':
                if (!constants.firstNameRegex.test($scope.signupFirstName) || !$scope.signupFirstName) {
                    $scope.errorExists = this.errorMsg('signupFirstName', constants.firstNameError);
                }
                else {
                    this.removeErrorMsg('signupFirstName');
                }
                break;
            case 'signupLastName':
                if (!constants.lastNameRegex.test($scope.signupLastName) || !$scope.signupLastName) {
                    $scope.errorExists = this.errorMsg('signupLastName', constants.lastNameError);
                }
                else {
                    this.removeErrorMsg('signupLastName');
                }
                break;
            case 'signupEmail':
                if (!constants.emailRegex.test($scope.signupEmail) || !$scope.signupEmail) {
                    $scope.errorExists = this.errorMsg('signupEmail', constants.emailError);
                }
                else {
                    this.removeErrorMsg('signupEmail');
                }
                break;
            case 'signupPassword':
                if (!constants.passwordRegex.test($scope.signupPassword) || !$scope.signupPassword) {
                    $scope.errorExists = this.errorMsg('signupPassword', constants.passwordError);
                }
                else {
                    this.removeErrorMsg('signupPassword');
                }
                break;
            case 'signupRePassword':
                if ($scope.signupPassword !== $scope.signupRePassword || !$scope.signupRePassword) {
                    $scope.errorExists = this.errorMsg('signupRePassword', constants.rePasswordError);
                }
                else {
                    this.removeErrorMsg('signupRePassword');
                }
                break;
            default:
                break;
        }
    }

   this.signinValidate = ($scope) => {
        if (!constants.emailRegex.test($scope.signinEmail) || !$scope.signinEmail) {
            $scope.errorExists = this.errorMsg('signinEmail', constants.emailError);
        }

        if (!constants.passwordRegex.test($scope.signinPassword) || !$scope.signinPassword) {
            $scope.errorExists = this.errorMsg('signinPassword', constants.passwordError);
        }
   }

   this.signinValidateField = (fieldName, $scope) => {
       switch (fieldName) {
           case 'signinEmail':
               if (!constants.emailRegex.test($scope.signinEmail) || !$scope.signinEmail) {
                   $scope.errorExists = this.errorMsg('signinEmail', constants.emailError);
               }
               else {
                   this.removeErrorMsg('signinEmail');
               }
               break;
           case 'signinPassword':
               if (!constants.passwordRegex.test($scope.signinPassword) || !$scope.signinPassword) {
                   $scope.errorExists = this.errorMsg('signinPassword', constants.passwordError);
               }
               else {
                   this.removeErrorMsg('signinPassword');
               }
               break;
           default:
               break;
       }
   }

}]);

app.controller('home',['$scope', '$http', 'validateService', 'constants', ($scope, $http, validateService, constants) => {
    $('#signupModal').on('hidden.bs.modal', function () {
        $scope.clearSignupData();
    });

    $('#signinModal').on('hidden.bs.modal', function () {
        $scope.clearSigninData();
    });

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
        $('#signupError').text('');
    }

    $scope.clearSignupData = () => { //resets all values ( input values ,input borders and errors
        $scope.clearSignupErrors();
        $('#signupFirstName').val('');
        $('#signupLastName').val('');
        $('#signupEmail').val('');
        $('#signupPassword').val('');
        $('#signupRePassword').val('');
    }

    $scope.signupValidate = () => validateService.signupValidate($scope);
    $scope.signupValidateField = (fieldName) => validateService.signupValidateField(fieldName, $scope);

    $scope.signup = () => {
        $scope.clearSignupErrors();
        $scope.signupValidate(); //sets $scope.errorExists to true if theres any error
        if (!$scope.errorExists) {
            $http({
                method: "POST",
                url: "/Home/Signup",
                data: {
                    FirstName: $scope.signupFirstName,
                    LastName: $scope.signupLastName,
                    Email: $scope.signupEmail.toLowerCase(),
                    Password: $scope.signupPassword
                }
            }).then((response) => {
                if (response.data.message === 'Success') {
                    alert('Congratulations, you have signed up!');
                }
                else {
                    if (response.data.message === 'Email already in use.') {
                        $('#signupEmailError').text(response.data.message);
                        $('#signupEmail').addClass('hasError');
                    }

                    $('#signupError').text('Sign up failed!');
                }
            });
        }
    };

    $scope.clearSigninErrors = () => {
        $scope.errorExists = false;
        $('#signinEmailError').text('');
        $('#signinEmail').removeClass('hasError');
        $('#signinPasswordError').text('');
        $('#signinPassword').removeClass('hasError');
        $('#signinError').text('');
    }

    $scope.clearSigninData = () => {
        $scope.clearSigninErrors();
        $('#signinEmail').val('');
        $('#signinPassword').val('');
    }

    $scope.signinValidate = () => validateService.signinValidate($scope);
    $scope.signinValidateField = (fieldName) => validateService.signinValidateField(fieldName, $scope);

    $scope.signin = () => {
        $scope.clearSigninErrors();
        $scope.signinValidate();
        if (!$scope.errorExists) {
            $http({
                method: "POST",
                url: "/Home/Signin",
                data: {
                    user: {
                        Email: $scope.signinEmail.toLowerCase(),
                        Password: $scope.signinPassword
                    }
                }
            }).then((response) => {
                if (response.data.message === 'Success') {
                    alert('Congratulations, you have signed in!');
                }
                else {
                    alert('Sign in failed!');
                }
            });
        }
    }
}]);