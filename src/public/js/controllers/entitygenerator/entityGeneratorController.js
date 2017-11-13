(function () {
    'use strict';
    angular.module('myApp').controller('entityGeneratorController',
        ['$scope', '$uibModal', function ($scope, $uibModal) {
            $scope.connect = function () {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title-top',
                    ariaDescribedBy: 'modal-body-top',
                    templateUrl: 'myModalContent.html',
                    size: 'sm',
                    controller: function ($scope) {
                        $scope.name = 'top';
                    }
                });
            }
        }]);
})();