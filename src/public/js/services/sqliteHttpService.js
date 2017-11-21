(function () {
    'use strict';
    angular.module('myApp').service('sqliteHttpService',
        ['httpService', function (httpService) {
            var host = 'http://localhost:3000';

            return {
                getTableNames: _getTableNames,
            };

            function _getTableNames(sqliteFith) {
                var url = host + '/sqlite/getTableNames';
                var params = {};
                params.sqliteFile = sqliteFith;
                return httpService.postJson(url, params);
            }
        }]);
})();