'use strict';

angular.module('lemur')

  .config(function config($stateProvider) {
    $stateProvider.state('domains', {
      url: '/domains',
      templateUrl: '/angular/domains/view/view.tpl.html',
      controller: 'DomainsViewController'
    });
  })

  .controller('DomainsViewController', function ($scope, $modal, DomainApi, DomainService, ngTableParams, toaster) {
    $scope.filter = {};
    $scope.domainsTable = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
        id: 'desc'     // initial sorting
      },
      filter: $scope.filter
    }, {
      total: 0,           // length of data
      getData: function ($defer, params) {
        DomainApi.getList(params.url()).then(function (data) {
            params.total(data.total);
            $defer.resolve(data);
          });
      }
    });

    $scope.updateSensitive = function (domain) {
      DomainService.updateSensitive(domain).then(
        function () {
          toaster.pop({
            type: 'success',
            title: domain.name,
            body: 'Updated!'
          });
        },
        function (response) {
          toaster.pop({
            type: 'error',
            title: domain.name,
            body: 'Unable to update! ' + response.data.message,
            timeout: 100000
          });
          domain.sensitive = domain.sensitive ? false : true;
        });
    };

    $scope.create = function () {
      var modalInstance = $modal.open({
        animation: true,
        controller: 'DomainsCreateController',
        templateUrl: '/angular/domains/domain/domain.tpl.html',
        size: 'lg'
      });

      modalInstance.result.then(function () {
        $scope.domainsTable.reload();
      });

    };

    $scope.toggleFilter = function (params) {
      params.settings().$scope.show_filter = !params.settings().$scope.show_filter;
    };

  });
