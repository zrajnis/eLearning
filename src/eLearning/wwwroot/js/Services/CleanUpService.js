angular.module('eLearning').service('cleanUpService', ['constants', 'courseService', function (constants, courseService) {
    this.clearSignUpData = $scope => { //resets all values ( input values ,input borders and errors
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
        $scope.deactivateErrorMsg = '';
        $scope.settingsFirstName = '';
        $scope.settingsLastName = '';
        $scope.settingsOldPassword = '';
        $scope.settingsNewPassword = '';
        $scope.settingsRePassword = '';
    };
}]);