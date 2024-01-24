# griffin-chrome-audit-extension

## Setting up a Kasm Workspace to develop & debug extensions

General steps below:

- Use an ubuntu workspace as the base image
- In the workspace settings under "Docker Run Config Override", add "user":"root"
- (Optional) Set the managed policies as normal, but make them writable - probably remove the one that installs extensions
- (Optional) Increase CPU and memory allocated to help speed up performance
- Start work space, and then manually install extension by uploading the dist-chrome.zip file and extracting on the host. Install it via chrome://extensions "Load Unpacked".

## Running a query against loki to test

The below query retrieves the last 10 minutes of logs where the environment label = dev.

```bash
start_time=$(date --date='10 minutes ago' +%s)
end_time=$(date +%s)
query="{environment=\"dev\"}"

curl -G "http://localhost:3100/loki/api/v1/query_range" --data-urlencode "query=$query" --data-urlencode "start=${start_time}" --data-urlencode "end=${end_time}" --data-urlencode "step=60"
```
