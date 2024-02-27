# griffin-chrome-audit-extension

## Setting up a Kasm Workspace to develop & debug extensions

General steps below:

- Use an ubuntu workspace as the base image
- In the workspace settings under "Docker Run Config Override", add "user":"root"
- (Optional) Set the managed policies as normal, but make them writable - probably remove the one that installs extensions
- (Optional) Increase CPU and memory allocated to help speed up performance
- Start work space, and then manually install extension by uploading the dist-chrome.zip file and extracting on the host. Install it via chrome://extensions "Load Unpacked".

Ps. the above steps have been replicated in a dedicated workspace image, which automatically downloads the latest extensions from the SWAG server.

## Chrome managed policies

To set variables for the extension to recognise, put the below .json in /etc/opt/chrome/policies/managed inside the kasm container (make sure the extension ID is correct).
Note - if you want to add new settings, you also need to make sure that [managed_schema.json](src/managed_schema.json) is correctly updated.

ID when installed from the extensions server: ammedigflapfemmofepbeakbmlkpgela

In the future, we'll use IDs for user/workspace/persona/organisation, rather than string values.

```json
{
    "3rdparty": {
        "extensions": {
            "fepodgbdpfeaphppaeadbdajgclilkpn": {
                "settings": {
                    "user": "userid-1234",
                    "workspace": "workspaceid-1234",
                    "persona": "personaid-1234",
                    "environment": "dev",
                    "organisation": "organisationid-1234",
                    "loki_url": "https://dev-loki.griffin-web.com:7443/loki/api/v1/push"
                }
            }
        }
    }
  }
```

To install the extension from the local HTTP server, put the below .json in /etc/opt/chrome/policies/managed inside the kasm container (make sure the extension ID is correct)

```json
{
    "ExtensionSettings": {
        "fepodgbdpfeaphppaeadbdajgclilkpn": {
            "installation_mode": "force_installed",
            "update_url": "https://dev-extensions.griffin-web.com:7443/updates-audit.xml"
        }
    }
}
```

## Running a query against loki to test

The below query retrieves the last 60 minutes of logs where the environment label = dev. Make sure the URL is correct. Note that Loki has BASIC auth on the query API, credentials are in Keeper.

```bash
query="{environment=\"dev\"}"

curl -G "https://dev-loki.griffin-web.com:7443/loki/api/v1/query_range" --data-urlencode "query=$query" --data-urlencode "step=60" -u "USERNAME:PASSWORD" | jq
```

## Log format

Currently, the format of the logs is determined by the below JS code (see: [url_recorder.js](src/url_recorder.js)):

```js
[`${logData.timestamp}`, `${user} ${workspace} ${persona} "${logData.title}" ${logData.url}`]
```

Note that Loki expects the first element of the array to be the timestamp, and the second element to be the log message.
