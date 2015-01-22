var newRelic = require('./src/newrelic-delete-old-servers')(
    require('request'),
    require('async')
);

newRelic.getServers(process.argv[2], 1);