angular.module('eLearning').service('validateService', ['constants', function (constants) {
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
    };

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
    };

    this.signInValidate = ($scope) => {
        if (!constants.emailRegex.test($scope.signInEmail) || !$scope.signInEmail) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }

        if (!constants.passwordRegex.test($scope.signInPassword) || !$scope.signInPassword) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }
    };

    this.settingsValidateField = (fieldName, $scope) => { //is invoked dynamically on input change
        switch (fieldName) {
            case 'settingsFirstName':
                if (!constants.firstNameRegex.test($scope.settingsFirstName) || !$scope.settingsFirstName) {
                    $scope.errorExists = this.errorMsg('settingsFirstName', constants.firstNameError);
                }
                else {
                    this.removeErrorMsg('settingsFirstName');
                }
                break;
            case 'settingsLastName':
                if (!constants.lastNameRegex.test($scope.settingsLastName) || !$scope.settingsLastName) {
                    $scope.errorExists = this.errorMsg('settingsLastName', constants.lastNameError);
                }
                else {
                    this.removeErrorMsg('settingsLastName');
                }
                break;
            case 'settingsOldPassword':
                if (!constants.passwordRegex.test($scope.settingsOldPassword) || !$scope.settingsOldPassword) {
                    $scope.errorExists = this.errorMsg('settingsOldPassword', constants.passwordError);
                }
                else {
                    this.removeErrorMsg('settingsOldPassword');
                }
                break;
            case 'settingsNewPassword':
                if (!constants.passwordRegex.test($scope.settingsNewPassword) || !$scope.settingsNewPassword) {
                    $scope.errorExists = this.errorMsg('settingsNewPassword', constants.passwordError);
                }
                else {
                    this.removeErrorMsg('settingsNewPassword');
                }
                break;
            case 'settingsRePassword':
                if ($scope.settingsNewPassword !== $scope.settingsRePassword || !$scope.settingsRePassword) {
                    $scope.errorExists = this.errorMsg('settingsRePassword', constants.rePasswordError);
                }
                else {
                    this.removeErrorMsg('settingsRePassword');
                }
                break;
            default:
                break;
        }
    };

}]);