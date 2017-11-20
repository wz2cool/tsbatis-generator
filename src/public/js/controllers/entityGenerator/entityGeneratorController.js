(function () {
    'use strict';
    angular.module('myApp').controller('entityGeneratorController',
        ['$scope', '$uibModal', 'httpService', function ($scope, $uibModal, httpService) {
            $scope.sqliteFile = '';

            $scope.connect = function () {
                httpService.getTableNames($scope.sqliteFile)
                    .then(function (data) {
                        $uibModal.open({
                            animation: true,
                            ariaLabelledBy: 'modal-title-top',
                            ariaDescribedBy: 'modal-body-top',
                            templateUrl: 'views/entityGenerator/selectEntityModal.html',
                            size: 'sm',
                            controller: 'selectEntityModalController',
                            resolve: {
                                context: function () {
                                    return {};
                                }
                            }
                        });
                    })
                    .catch(function (err) {
                        alert(err);
                    });
            }
        }]);
})();