(function () {
    'use strict';
    angular.module('myApp').controller('entityGeneratorController',
        ['$scope', '$uibModal', 'sqliteHttpService', function ($scope, $uibModal, sqliteHttpService) {
            $scope.config = {};

            $scope.connect = function () {
                if (!$scope.config.sqliteFile) {
                    alert('Please input file path!');
                    return;
                }

                sqliteHttpService.getTableNames($scope.config.sqliteFile)
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
                        alert(err.data.error);
                    });
            }
        }]);
})();