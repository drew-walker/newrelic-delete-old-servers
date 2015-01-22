module.exports = function(request, async) {
    var self = {};

    self.servers = [];

    self.deleteServers = function deleteServers(servers, api_key) {
        if (servers.length > 0) {
            var functionArray = [];

            servers.forEach(function(server) {
                funtionArray = functionArray.push(self.getServerDeleteFn(server, api_key));
            });

            async.parallel(functionArray, function(err, results) {
                if (err) {
                    console.log('There was an error deleting servers: ' + err.message);
                } else {
                    console.log('Successfully deleted ' + servers.length + ' servers.');
                }
            });
        }
    };

    self.getServerDeleteFn = function getServerDeleteFn(server, api_key) {
        return function deleteServer(callback) {
            console.log('Attempting to delete server "' + server.name + '". (id=' + server.id + ')');
            request({
                url : 'https://api.newrelic.com/v2/servers/' + server.id + '.json',
                method : 'DELETE',
                headers : {
                    'X-Api-Key' : api_key
                }
            }, function(err, response) {
                if (err) {
                    callback(err, server.name);
                } else {
                    if (response.statusCode === 401) {
                        var error = new Error(JSON.parse(response.body).error.title);
                        callback(error, server.name);
                    } else {
                        callback(null, server.name);
                    }
                }
            });
        }
    };

    self.parseResponse = function parseResponse(response, api_key) {
        if (response.servers.length > 0) {
            console.log('Found ' + response.servers.length + ' servers.');
            response.servers.forEach(function (server) {
                if (server.reporting === false) {
                    self.servers.push(server);
                }
            });

            if (self.servers.length > 0) {
                console.log('Found ' + self.servers.length + ' non-reporting servers.');
                self.deleteServers(self.servers, api_key);
            } else {
                console.log('No servers to delete.');
            }
        } else {
            console.log('No servers to delete.');
        }
    };

    self.getServerListCallback = function getServerListCallback(api_key) {
        return function handleServerListResponse(err, response) {
            if (err) {
                console.log('Could not retrieve list of servers: ' + err.message);
            } else {
                if (response.statusCode === 401) {
                    console.log('Could not retrieve list of servers: ' + JSON.parse(response.body).error.title);
                } else {
                    self.parseResponse(JSON.parse(response.body), api_key);
                }
            }
        }
    };

    self.getServers = function getServers(api_key) {
        request({
            url : 'https://api.newrelic.com/v2/servers.json',
            headers : { 'X-Api-Key' : api_key }
        }, self.getServerListCallback(api_key));
    };

    return self;
};