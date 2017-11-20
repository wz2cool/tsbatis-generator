(function () {
    'use strict';
    angular.module('myApp').service('httpService', ['$http', '$q', function ($http, $q) {
        return {
            getTableNames: _getTableNames
        };

        function _getTableNames(sqliteFile) {
            var defer = $q.defer();
            $http({
                method: 'post',
                url: 'sqlite/getTableNames',
                data: {
                    'sqliteFile': sqliteFile
                }
            }).success(function (req) {
                defer.resolve(req);
            }).error(function (data) {
                defer.reject(data);
            });
            return defer.promise;
        }
    }]);
})();