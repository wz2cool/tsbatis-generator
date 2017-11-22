(function () {
    'use strict';
    angular.module('myApp').controller('entityGeneratorController',
        ['$scope', '$uibModal', 'sqliteHttpService', 'mysqlHttpService',
            function ($scope, $uibModal, sqliteHttpService, mysqlHttpService) {
                $scope.config = {};

                $scope.connect = function () {

                    if ($scope.dbType === 'sqlite') {
                        connectSqlite($scope.config.sqliteFile);
                    } else {
                        connectMysql($scope.config.uri,
                            $scope.config.user,
                            $scope.config.pwd,
                            $scope.config.database);
                    }
                };

                function connectMysql(uri, user, pwd, database) {
                    if (!uri || !user || !pwd || !database) {
                        alert('Please finish form!');
                        return;
                    }

                    mysqlHttpService.getTableNames(uri, user, pwd, database)
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
                                            dbType: 'mysql',
                                            tables: response.data,
                                            uri: uri,
                                            user: user,
                                            pwd: pwd,
                                            database: database
                                        };
                                    }
                                }
                            });
                        })
                        .catch(function (err) {
                            alert(err.data.error);
                        });
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
                                            dbType: 'sqlite',
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