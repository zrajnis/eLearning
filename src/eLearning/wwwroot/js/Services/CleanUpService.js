angular.module('eLearning').service('cleanUpService', ['constants', 'courseService', function (constants, courseService) {
    this.clearSignUpData = $scope => { //resets all values ( input values ,input borders and errors
        $scope.signUpEmailError = false;
        $scope.signUpFirstName = '';
        $scope.signUpLastName = '';
        $scope.signUpEmail = '';
        $scope.signUpPassword = '';
        $scope.signUpRePassword = '';
        $('#signUpError').text('');
    };

    this.clearSignInData = $scope => {
        $scope.signInEmail = '';
        $scope.signInPassword = '';
        $('#signInError').text('');
    };

    this.clearSettingsData = $scope => {
        $scope.deactivateDecision = false;
        $scope.settingsOldPasswordError = false;
        $scope.settingsNewPasswordError = false;
        $scope.settingsRePasswordError = false;
        $scope.deactivateErrorMsg = '';
        $scope.settingsFirstName = '';
        $scope.settingsLastName = '';
        $scope.settingsOldPassword = '';
        $scope.settingsNewPassword = '';
        $scope.settingsRePassword = '';
    };
}]);