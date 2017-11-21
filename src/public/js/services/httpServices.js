(function () {
    'use strict';
    angular.module('myApp').service('httpService',
        ['$http', '$q', '$httpParamSerializerJQLike', function ($http, $q) {
            return {
                getData: _getData,
                postData: _postData,
                deleteData: _deleteData,
                putData: _putData,
                postJson: _postJson,
                putJson: _putJson
            };

            function _getData(url, params) {
                return _queryData('GET', url, params);
            }

            function _postData(url, params) {
                return _queryData('POST', url, params);
            }

            function _deleteData(url, params) {
                return _queryData('delete', url, params);
            }

            function _putData(url, params) {
                return _queryData('PUT', url, params);
            }

            function _queryData(method, url, params, responseType) {
                var deferred = $q.defer();
                var httpParams = {};
                if (method === 'GET') {
                    httpParams = {
                        url: url,
                        method: method,
                        withCredentials: true,
                        params: params
                    };
                } else {
                    httpParams = {
                        method: method,
                        url: url,
                        withCredentials: true,
                        data: $httpParamSerializerJQLike(params),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                    };
                }

                if (responseType) {
                    httpParams.responseType = responseType;
                }

                $http(httpParams).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function _postJson(url, data, responseType) {
                return _queryJson('POST', url, data, responseType);
            }

            function _putJson(url, data) {
                return _queryJson('PUT', url, data);
            }

            function _queryJson(method, url, params, responseType) {
                var deferred = $q.defer();

                var httpParam = {
                    method: method,
                    url: url,
                    data: params,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                };

                if (responseType) {
                    httpParam.responseType = responseType;
                }

                $http(httpParam).then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }]);
})();