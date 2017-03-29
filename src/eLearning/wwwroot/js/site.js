const app = angular.module('eLearning', []);

app.constant('constants', {
    firstNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    lastNameRegex: /^[a-zA-Z0-9.\s]{2,32}$/,
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    passwordRegex: /^(?=.*\d).{6,}$/,

    firstNameError: 'Please enter a valid first name.',
    lastNameError: 'Please enter a valid last name.',
    emailError: 'Please enter a valid email address.',
    passwordError: 'Must have at least 1 digit and length over 5.',
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

    this.signUpValidate = ($scope) => {
        if (!constants.firstNameRegex.test($scope.signUpFirstName) || !$scope.signUpFirstName) { //alternative is pre writing all errors, hiding them and then showing ones that do come up
            $scope.errorExists = this.errorMsg('signUpFirstName', constants.firstNameError);
        }

        if (!constants.lastNameRegex.test($scope.signUpLastName) || !$scope.signUpLastName) {
            $scope.errorExists = this.errorMsg('signUpLastName', constants.lastNameError);
        }

        if (!constants.emailRegex.test($scope.signUpEmail) || !$scope.signUpEmail) { // or statement isnt needed for this case ,but still ,consistency
            $scope.errorExists = this.errorMsg('signUpEmail', constants.emailError);
        }

        if (!constants.passwordRegex.test($scope.signUpPassword) || !$scope.signUpPassword) {
            $scope.errorExists = this.errorMsg('signUpPassword', constants.passwordError);
        }

        if ($scope.signUpPassword !== $scope.signUpRePassword || !$scope.signUpRePassword) {
            $scope.errorExists = this.errorMsg('signUpRePassword', constants.rePasswordError);
        }
    }

    this.signUpValidateField = (fieldName, $scope) => { //is invoked dynamically on input change
        switch (fieldName) {
            case 'signUpFirstName':
                if (!constants.firstNameRegex.test($scope.signUpFirstName) || !$scope.signUpFirstName) {
                    $scope.errorExists = this.errorMsg('signUpFirstName', constants.firstNameError);
                }
                else {
                    this.removeErrorMsg('signUpFirstName');
                }
                break;
            case 'signUpLastName':
                if (!constants.lastNameRegex.test($scope.signUpLastName) || !$scope.signUpLastName) {
                    $scope.errorExists = this.errorMsg('signUpLastName', constants.lastNameError);
                }
                else {
                    this.removeErrorMsg('signUpLastName');
                }
                break;
            case 'signUpEmail':
                if (!constants.emailRegex.test($scope.signUpEmail) || !$scope.signUpEmail) {
                    $scope.errorExists = this.errorMsg('signUpEmail', constants.emailError);
                }
                else {
                    this.removeErrorMsg('signUpEmail');
                }
                break;
            case 'signUpPassword':
                if (!constants.passwordRegex.test($scope.signUpPassword) || !$scope.signUpPassword) {
                    $scope.errorExists = this.errorMsg('signUpPassword', constants.passwordError);
                }
                else {
                    this.removeErrorMsg('signUpPassword');
                }
                break;
            case 'signUpRePassword':
                if ($scope.signUpPassword !== $scope.signUpRePassword || !$scope.signUpRePassword) {
                    $scope.errorExists = this.errorMsg('signUpRePassword', constants.rePasswordError);
                }
                else {
                    this.removeErrorMsg('signUpRePassword');
                }
                break;
            default:
                break;
        }
    }

   this.signInValidate = ($scope) => {
        if (!constants.emailRegex.test($scope.signInEmail) || !$scope.signInEmail) {
            $scope.errorExists = this.errorMsg('signInEmail', constants.emailError);
        }

        if (!constants.passwordRegex.test($scope.signInPassword) || !$scope.signInPassword) {
            $scope.errorExists = this.errorMsg('signInPassword', constants.passwordError);
        }
   }

   this.signInValidateField = (fieldName, $scope) => {
       switch (fieldName) {
           case 'signInEmail':
               if (!constants.emailRegex.test($scope.signInEmail) || !$scope.signInEmail) {
                   $scope.errorExists = this.errorMsg('signInEmail', constants.emailError);
               }
               else {
                   this.removeErrorMsg('signInEmail');
               }
               break;
           case 'signInPassword':
               if (!constants.passwordRegex.test($scope.signInPassword) || !$scope.signInPassword) {
                   $scope.errorExists = this.errorMsg('signInPassword', constants.passwordError);
               }
               else {
                   this.removeErrorMsg('signInPassword');
               }
               break;
           default:
               break;
       }
   }

}]);

app.controller('home',['$scope', '$http', 'validateService', 'constants', ($scope, $http, validateService, constants) => {
    $('#signUpModal').on('hidden.bs.modal', function () {
        $scope.clearSignUpData();
        $scope.$apply();
    });

    $('#signInModal').on('hidden.bs.modal', function () {
        $scope.clearSignInData();
        $scope.$apply();
    });

    $scope.errorExists = false;
    $scope.clearSignUpErrors = () => {
        $scope.errorExists = false;
        $('#signUpFirstNameError').text('');
        $('#signUpFirstName').removeClass('hasError');
        $('#signUpLastNameError').text('');
        $('#signUpLastName').removeClass('hasError');
        $('#signUpEmailError').text('');
        $('#signUpEmail').removeClass('hasError');
        $('#signUpPasswordError').text('');
        $('#signUpPassword').removeClass('hasError');
        $('#signUpRePasswordError').text('');
        $('#signUpRePassword').removeClass('hasError');
        $('#signUpError').text('');
    }

    $scope.clearSignUpData = () => { //resets all values ( input values ,input borders and errors
        $scope.clearSignUpErrors();
        $scope.signUpFirstName = '';
        $scope.signUpLastName = '';
        $scope.signUpEmail = '';
        $scope.signUpPassword = '';
        $scope.signUpRePassword = '';
    }

    $scope.signUpValidate = () => validateService.signUpValidate($scope);
    $scope.signUpValidateField = (fieldName) => validateService.signUpValidateField(fieldName, $scope);

    $scope.signUp = () => {
        $scope.clearSignUpErrors();
        $scope.signUpValidate(); //sets $scope.errorExists to true if theres any error
        if (!$scope.errorExists) {
            $http({
                method: "POST",
                url: "/Account/SignUp",
                data: {
                    FirstName: $scope.signUpFirstName,
                    LastName: $scope.signUpLastName,
                    Email: $scope.signUpEmail.toLowerCase(),
                    Password: $scope.signUpPassword
                }
            }).then((response) => {
                if (response.data.message === 'Success!') {
                    $('#signUpModal').modal('hide');
                    $('#signInSuccessModal').modal('show');
                }
                else {
                    if (response.data.message === 'Email already in use.') {
                        $('#signUpEmailError').text(response.data.message);
                        $('#signUpEmail').addClass('hasError');
                    }

                    $('#signUpError').text('Sign up failed!');
                }
            });
        }
    };

    $scope.clearSignInErrors = () => {
        $scope.errorExists = false;
        $('#signInEmailError').text('');
        $('#signInEmail').removeClass('hasError');
        $('#signInPasswordError').text('');
        $('#signInPassword').removeClass('hasError');
        $('#signInError').text('');
    }

    $scope.clearSignInData = () => {
        $scope.clearSignInErrors();
        $scope.signInEmail = '';
        $scope.signInPassword = '';
    }

    $scope.signInValidate = () => validateService.signInValidate($scope);
    $scope.signInValidateField = (fieldName) => validateService.signInValidateField(fieldName, $scope);

    $scope.signIn = () => {
        $scope.clearSignInErrors();
        $scope.signInValidate();
        if (!$scope.errorExists) {
            $http({
                method: "POST",
                url: "/Home/signIn",
                data: {
                    user: {
                        Email: $scope.signInEmail.toLowerCase(),
                        Password: $scope.signInPassword
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