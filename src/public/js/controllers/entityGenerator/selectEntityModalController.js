(function () {
    angular.module('myApp').controller('selectEntityModalController',
        ['$scope', '$uibModalInstance', 'context', function ($scope, $uibModalInstance, context) {
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

                $uibModalInstance.close('ok');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])
})();