import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacement(match):
        url = match.group(1)
        # Avoid double patching
        if "?t=" in match.group(0) or "no-cache" in match.group(0):
            return match.group(0)
        # return fetch('content/home.json?t=' + new Date().getTime())
        # The matched group 1 includes the quotes, e.g. 'content/home.json'
        # We want to do: fetch('content/home.json?t=' + new Date().getTime())
        # So we can just append it before the ending quote if it's a string,
        # but that is hard. Let's just pass { cache: "no-store" } instead.
        return f"fetch({url}, {{ cache: 'no-store' }})"

    new_content = re.sub(r'fetch\(\s*([\'"]content/[^\'"]+\.json[\'"])\s*\)', replacement, content)

    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched {file}")
