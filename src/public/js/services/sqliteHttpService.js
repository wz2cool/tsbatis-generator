(function () {
    'use strict';
    angular.module('myApp').service('sqliteHttpService',
        ['httpService', function (httpService) {
            var host = 'http://localhost:3000';

            return {
                getTableNames: _getTableNames,
                generateEntities: _generateEntities
            };

            function _getTableNames(sqliteFile) {
                var url = host + '/sqlite/getTableNames';
                var params = {};
                params.sqliteFile = sqliteFile;
                return httpService.postJson(url, params);
            }

            function _generateEntities(sqliteFile, tableNames) {
                var url = host + '/sqlite/generateEntities';
                var params = {};
                params.sqliteFile = sqliteFile;
                params.tableNames = tableNames;
                return httpService.postJson(url, params, 'arraybuffer');
            }
        }]);
})();