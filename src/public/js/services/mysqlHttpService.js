(function () {
    'use strict';
    angular.module('myApp').service('mysqlHttpService',
        ['httpService', function (httpService) {
            var host = 'http://localhost:3000';
            return {
                getTableNames: _getTableNames,
                generateEntities: _generateEntities
            };

            function _getTableNames(uri, user, pwd, database) {
                var url = host + '/mysql/getTableNames';
                var params = {};
                params.uri = uri;
                params.user = user;
                params.pwd = pwd;
                params.database = database;
                return httpService.postJson(url, params);
            }

            function _generateEntities(uri, user, pwd, database, tableNames) {
                var url = host + '/mysql/generateEntities';
                var params = {};
                params.uri = uri;
                params.user = user;
                params.pwd = pwd;
                params.database = database;
                params.tableNames = tableNames;
                return httpService.postJson(url, params, 'arraybuffer');
            }
        }]);
})();