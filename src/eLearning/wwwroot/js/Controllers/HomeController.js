angular.module('eLearning').controller('HomeCtrl', ['$scope', '$http', '$window', 'validateService', 'cleanUpService', 'courseService', 'constants', '$timeout', ($scope, $http, $window, validateService, cleanUpService, courseService, constants, $timeout) => {
    $('#signUpModal').on('hidden.bs.modal', () => {
        $scope.clearSignUpData();
        validateService.resetValidity($scope.signUpForm);
        $scope.$apply();
    });

    $('#signInModal').on('hidden.bs.modal', () => {
        cleanUpService.clearSignInData($scope);
        validateService.resetValidity($scope.signInForm);
        $scope.$apply();
    });

    $scope.constants = constants;
    $scope.courseService = courseService;
    $scope.clearSignUpData = () => cleanUpService.clearSignUpData($scope);
    $scope.clearSignInData = () => cleanUpService.clearSignInData($scope);
    $scope.signUpValidateField = fieldId => validateService.validateField(fieldId, $scope);

    $scope.signUp = formName => {
        if (!formName.$valid) {
            validateService.touchOnSubmit(formName);
            return;
        }
        
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
                $window.location.href = '/';
                return;
            }

            if (response.data.message === 'Email already in use.') {
                $scope.signUpEmailError = true;
                let defaultMessage = $('#signUpEmailError').text();

                $('#signUpEmailError').text(response.data.message);
                $('#signUpEmail').addClass('hasError');
                $timeout(() => {
                    $scope.signUpEmailError = false;
                    $('#signUpEmailError').text(defaultMessage);
                    $('#signUpEmail').removeClass('hasError');
                }, 2000);
            }

            $('#signUpError').text(constants.signUpError);
            $timeout(() => {
                $('#signUpError').text('');
            }, 2000);
        });
    };

    $scope.signIn = formName => {
        if (!formName.$valid) {
            $('#signInError').text(constants.signInError);
            $timeout(() => {
                $('#signInError').text('');
            }, 2000);
            return;
        }

        $http({
            method: "POST",
            url: "/Account/SignIn",
            data: {
                Email: $scope.signInEmail.toLowerCase(),
                Password: $scope.signInPassword
            }
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
                return;
            }

            $('#signInError').text(constants.signInError);
            $timeout(() => {
                $('#signInError').text('');
            }, 2000);
        });
    };
}]);