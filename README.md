# Delete old NewRelic servers

Sick of seeing all your auto-scaling cloud servers listed in NewRelic? Then this is the module for you! The module finds all servers that are no longer reporting data and deletes them from NewRelic.

## Usage

    npm install newrelic-delete-old-servers
    node ./node_modules/new-relic-delete-old-servers/ [YOUR_API_KEY]

### Finding your NewRelic API key

Go to **Account Settings > Data Sharing** in NewRelic.