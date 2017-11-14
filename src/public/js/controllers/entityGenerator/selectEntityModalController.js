(function () {
    angular.module('myApp').controller('selectEntityModalController',
        ['$scope', '$uibModalInstance', 'context', function ($scope, $uibModalInstance, context) {
            $scope.ok = function () {
                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])
})();