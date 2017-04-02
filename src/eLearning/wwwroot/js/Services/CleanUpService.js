angular.module('eLearning').service('cleanUpService', ['constants', function (constants) {
    this.clearSignUpErrors = ($scope) => {
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
    };

    this.clearSignUpData = ($scope) => { //resets all values ( input values ,input borders and errors
        this.clearSignUpErrors($scope);
        $scope.signUpFirstName = '';
        $scope.signUpLastName = '';
        $scope.signUpEmail = '';
        $scope.signUpPassword = '';
        $scope.signUpRePassword = '';
    };

    this.clearSignInErrors = ($scope) => {
        $scope.errorExists = false;
        $('#signInEmailError').text('');
        $('#signInEmail').removeClass('hasError');
        $('#signInPasswordError').text('');
        $('#signInPassword').removeClass('hasError');
        $('#signInError').text('');
    };

    this.clearSignInData = ($scope) => {
        this.clearSignInErrors($scope);
        $scope.signInEmail = '';
        $scope.signInPassword = '';
    };

}]);