angular.module('eLearning').service('validateService', ['constants', function (constants) {
    this.errorMsg = (inputID, message) => {
        $('#' + inputID + 'Error').text(message);
        $('#' + inputID).addClass('hasError');
        return true;
    };

    this.removeErrorMsg = (inputID) => {
        $('#' + inputID + 'Error').text('');
        $('#' + inputID).removeClass('hasError');
        return false;
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

    this.signInValidate = ($scope) => {
        if (!constants.emailRegex.test($scope.signInEmail) || !$scope.signInEmail) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }

        if (!constants.passwordRegex.test($scope.signInPassword) || !$scope.signInPassword) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }
    };

    this.validateField = (inputID, $scope) => { //is invoked dynamically on input change, works for any kind of field
        const inputName = $('#'+inputID).attr('name');
        const errorVariable = inputName + 'Error';
        const errorName = inputID.includes('Old') ? 'passwordError' : inputName + 'Error'; //if input is for old password set error name to passwordError, 
        const regexName = inputID.includes('Old') ? 'passwordRegex' : inputName + 'Regex'; //same logic for regex, since it abides passwordRegex

        if ((!inputID.includes('Re') && !constants[regexName].test($scope[inputID])) || //if field doesnt pass regex test or if its password confirmation that doesnt match the password
            (inputID.includes('settingsRe') && ($scope.settingsNewPassword !== $scope.settingsRePassword || !$scope.settingsRePassword)) ||
            (inputID.includes('signUpRe') && ($scope.signUpPassword !== $scope.signUpRePassword || !$scope.signUpRePassword))) { 
            inputID.includes('settings') ? $scope[errorVariable] = this.errorMsg(inputID, constants[errorName]) : this.errorMsg(inputID, constants[errorName]);
        }
        else {
            inputID.includes('settings') ? $scope[errorVariable] = this.removeErrorMsg(inputID) : this.removeErrorMsg(inputID);  //remove error if field belongs to settings form
        }
    };

}]);