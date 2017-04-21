angular.module('eLearning').service('cleanUpService', ['constants', function (constants) {
    this.clearSignUpErrors = $scope => {
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

    this.clearSignUpData = $scope => { //resets all values ( input values ,input borders and errors
        this.clearSignUpErrors($scope);
        $scope.signUpFirstName = '';
        $scope.signUpLastName = '';
        $scope.signUpEmail = '';
        $scope.signUpPassword = '';
        $scope.signUpRePassword = '';
    };

    this.clearSignInErrors = $scope => {
        $scope.errorExists = false;
        $('#signInEmailError').text('');
        $('#signInEmail').removeClass('hasError');
        $('#signInPasswordError').text('');
        $('#signInPassword').removeClass('hasError');
        $('#signInError').text('');
    };

    this.clearSignInData = $scope => {
        this.clearSignInErrors($scope);
        $scope.signInEmail = '';
        $scope.signInPassword = '';
    };
    
    this.clearSettingsErrors = $scope => {
        $scope.firstNameError = true,
        $scope.lastNameError = true;
        $scope.oldPasswordError = true;
        $scope.passwordError = true;
        $scope.rePasswordError = true; //in case empty field is submitted without it ever being validated this will make it fail without validating
        $('#settingsFirstNameError').text('');
        $('#settingsFirstName').removeClass('hasError');
        $('#settingsLastNameError').text('');
        $('#settingsLastName').removeClass('hasError');
        $('#settingsOldPasswordError').text('');
        $('#settingsOldPassword').removeClass('hasError');
        $('#settingsNewPasswordError').text('');
        $('#settingsNewPassword').removeClass('hasError');
        $('#settingsRePasswordError').text('');
        $('#settingsRePassword').removeClass('hasError');
        $('#settingsDeactivateError').text('');
    };

    this.clearSettingsData = $scope => {
        this.clearSettingsErrors($scope);
        $scope.deactivateDecision = false;
        $scope.settingsFirstName = '';
        $scope.settingsLastName = '';
        $scope.settingsOldPassword = '';
        $scope.settingsNewPassword = '';
        $scope.settingsRePassword = '';
    };

}]);