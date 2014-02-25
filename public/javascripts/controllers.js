app.controller("ZookeepersController", function ($scope, $http, $location) {

    $scope.groups = [
        {name: 'All'},
        {name: 'Development'},
        {name: 'Production'},
        {name: 'Staging'},
        {name: 'Test'}
    ];

    $scope.zookeeper = {};
    $scope.zookeeper.group = $scope.groups[0];

    var ws = new WebSocket('ws://' + $location.host() + ':' + $location.port() + '/zookeepers.json/feed');

    ws.onmessage = function (message) {
        var serverZookeeper = angular.fromJson(message.data);
        var modelName = angular.lowercase(serverZookeeper.group) + 'Zookeepers';
        var isNewZookeeper = true;

        angular.forEach($scope[modelName], function (clientZookeeper) {
                if (clientZookeeper.name === serverZookeeper.name) {
                    clientZookeeper.status = serverZookeeper.status;
                    isNewZookeeper = false;
                }
            }
        );

        if (isNewZookeeper && typeof($scope[modelName]) !== 'undefined') {
            $scope[modelName].push(serverZookeeper);
        }
        else if (typeof($scope[modelName]) === 'undefined') {
            $scope[modelName] = [serverZookeeper];
        }

        $scope.$apply();
    };

    $scope.$on('$destroy', function () {
        ws.close();
    });

    $scope.getZookeepers = function (group) {
        $http.get('/zookeepers.json/' + group).
            success(function (data, status, headers, config) {
                $scope[group + 'Zookeepers'] = angular.fromJson(data);
            });
    };

    $scope.createZookeeper = function (zookeeper) {
        $http.post('/zookeepers.json', { name: zookeeper.name, host: zookeeper.host, port: zookeeper.port, group: zookeeper.group.name}).success(function () {
            $location.path("/");
        });
    };
});

app.controller("TopicsController", function ($scope, $location, $http, $routeParams) {
    $http.get('/topics.json').
        success(function (data, status, headers, config) {
            $scope.topics = data;
        });

    $scope.getTopic = function (topic) {
        $location.path('/topics/' + topic.name + '/' + topic.zookeeper);
    };
});

app.controller("TopicController", function ($http, $scope, $location, $routeParams) {
    $http.get('/topics.json/' + $routeParams.name + '/' + $routeParams.zookeeper).success(function (data) {
        var maxPartitionCount = 0;
        $scope.topic = data;
        angular.forEach($scope.topic, function (consumer) {
            maxPartitionCount = consumer.offsets.length;

            if (maxPartitionCount < consumer.offsets.length) {
                maxPartitionCount = consumer.offsets.length;
            }
        });

        $scope.maxPartitionCount = new Array(maxPartitionCount);

    });

    var ws = new WebSocket('ws://' + $location.host() + ':' + $location.port() + '/topics.json/' + $routeParams.name + '/' + $routeParams.zookeeper + '/feed');
    ws.onmessage = function (message) {
        var p = angular.element("<p />");
        p.text(message.data);
        $("#topic-feed").append(p);
        $scope.$apply();
    }

    $scope.$on('$destroy', function () {
        ws.close();
    });
});

app.controller("BrokersController", function ($scope, $http) {
    $http.get('/brokers.json').
        success(function (data, status, headers, config) {
            $scope.brokers = data;
        });
});