(function () {
    angular.module('myApp').controller('selectEntityModalController',
        ['$scope', '$uibModalInstance', 'sqliteHttpService', 'context',
            function ($scope, $uibModalInstance, sqliteHttpService, context) {
                $scope.tables = _.map(context.tables, function (x) {
                    return {isSelected: false, name: x}
                });

                $uibModalInstance.result.catch(function () {
                    $uibModalInstance.close();
                });

                $scope.ok = function () {
                    var selectedTables = _.map(
                        _.filter($scope.tables, function (x) {
                            return x.isSelected;
                        }), function (item) {
                            return item.name;
                        });
                    sqliteHttpService.generateEntities(context.sqliteFile, selectedTables)
                        .then(function (response) {
                            var blob = new Blob([response.data], {
                                type: 'application/zip'
                            });

                            saveAs(blob, 'entities.zip');
                            $uibModalInstance.close('ok');
                        })
                        .catch(function (err) {
                            alert(err.data.error);
                        });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }])
})();