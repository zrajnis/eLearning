angular.module('eLearning').controller('HomeCtrl', ['$scope', '$http', '$window', 'validateService', 'cleanUpService', 'constants', ($scope, $http, $window, validateService, cleanUpService, constants) => {
    $('#signUpModal').on('hidden.bs.modal', () => {
        $scope.clearSignUpData();
        $scope.$apply();
    });

    $('#signInModal').on('hidden.bs.modal', () => {
        cleanUpService.clearSignInData($scope);
        $scope.$apply();
    });

    $scope.errorExists = false;
    $scope.clearSignUpData = () => cleanUpService.clearSignUpData($scope);
    $scope.clearSignInData = () => cleanUpService.clearSignInData($scope);
    $scope.signUpValidateField = fieldID => validateService.validateField(fieldID, $scope);

    $scope.signUp = () => {
        cleanUpService.clearSignUpErrors($scope);
        validateService.signUpValidate($scope); //sets $scope.errorExists to true if theres any error
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
                    $('#signUpSuccessModal').modal('show');
                }
                else {
                    if (response.data.message === 'Email already in use.') {
                        $('#signUpEmailError').text(response.data.message);
                        $('#signUpEmail').addClass('hasError');
                    }

                    $('#signUpError').text(constants.signUpError);
                }
            });
        }
    };

    $scope.signIn = () => {
        cleanUpService.clearSignInErrors($scope);
        validateService.signInValidate($scope);
        if (!$scope.errorExists) {
            $http({
                method: "POST",
                url: "/Account/SignIn",
                data: {
                    Email: $scope.signInEmail.toLowerCase(),
                    Password: $scope.signInPassword
                }
            }).then((response) => {
                if (response.data.message === 'Success!') {
                    $window.location.href = '/User';
                }
                else {
                    $('#signInError').text(constants.signInError);
                }
            });
        }
    };
}]);