(function () {
    'use strict';
    angular.module('myApp').controller('entityGeneratorController',
        ['$scope', '$uibModal', 'sqliteHttpService', function ($scope, $uibModal, sqliteHttpService) {
            $scope.config = {};

            $scope.connect = function () {

                if ($scope.dbType === 'sqlite') {
                    connectSqlite($scope.config.sqliteFile);
                } else {

                }

            };

            function connectMysql(uri, user, pwd, database) {
                if (!uri || !user || !pwd || !database) {
                    alert('Please finish form!');
                    return;
                }


            }

            function connectSqlite(sqliteFile) {
                if (!sqliteFile) {
                    alert('Please input file path!');
                    return;
                }

                sqliteHttpService.getTableNames(sqliteFile)
                    .then(function (response) {
                        $uibModal.open({
                            animation: true,
                            ariaLabelledBy: 'modal-title-top',
                            ariaDescribedBy: 'modal-body-top',
                            templateUrl: 'views/entityGenerator/selectEntityModal.html',
                            size: 'md',
                            controller: 'selectEntityModalController',
                            resolve: {
                                context: function () {
                                    return {
                                        tables: response.data,
                                        sqliteFile: sqliteFile
                                    };
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