import urllib.request
import re

url = 'https://www.youtube.com/@ArdOauthc'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'"channelId":"(UC[^"]+)"', html)
    if match:
        print("CHANNEL_ID=" + match.group(1))
    else:
        print("CHANNEL_ID=Not found")
except Exception as e:
    print("Error:", e)
