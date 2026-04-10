import os
import tinify

tinify.key = "bDVdFM7m1kPhFLKMk7b8DdgVBwv5kyvK"
media_dir = "e:/code/ARD/media/"

print("Starting TinyPNG compression...")

for filename in os.listdir(media_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        file_path = os.path.join(media_dir, filename)
        size_before = os.path.getsize(file_path)
        print(f"Compressing {filename} (Before: {size_before/1024:.1f} KB)...")
        try:
            source = tinify.from_file(file_path)
            source.to_file(file_path)
            size_after = os.path.getsize(file_path)
            print(f"Successfully compressed {filename} (After: {size_after/1024:.1f} KB, Saved: {((size_before-size_after)/size_before)*100:.1f}%)")
        except Exception as e:
            print(f"Error compressing {filename}: {e}")

print("Compression complete!")
