import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    if 'birthday-form' in file:
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Events link
    new_content = re.sub(
        r'<a href="[^"]*#events"\s*class="nav-link">\s*Events\s*</a>',
        r'<a href="events.html" class="nav-link">Events</a>',
        content
    )
    
    # Gallery link
    new_content = re.sub(
        r'<a href="[^"]*#gallery"\s*class="nav-link">\s*Gallery\s*</a>',
        r'<a href="gallery.html" class="nav-link">Gallery</a>',
        new_content
    )

    # News link
    new_content = re.sub(
        r'<a href="[^"]*#news"\s*class="nav-link">\s*News & Publications\s*</a>',
        r'<a href="news.html" class="nav-link">News & Publications</a>',
        new_content
    )
    
    # Also fix it if there are exact href="#news" without "index.html"
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched navbar links in {file}")
