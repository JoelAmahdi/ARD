<?php
// share.php - Generates Open Graph tags for WhatsApp sharing and redirects to the actual page

$type = isset($_GET['type']) ? $_GET['type'] : 'news';
$title = isset($_GET['title']) ? $_GET['title'] : '';

// Base URL of the website
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$baseUrl = $protocol . "://" . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['PHP_SELF']), '/\\') . "/";

$ogTitle = "ARD OAUTHC";
$ogDesc = "Association of Resident Doctors, OAUTHC";
$ogImage = $baseUrl . "media/logo.png";
$targetUrl = $baseUrl;

if ($type === 'news' && !empty($title)) {
    $targetUrl = $baseUrl . "news-details.html?title=" . urlencode($title);
    $jsonContent = @file_get_contents(__DIR__ . '/content/news.json');
    if ($jsonContent) {
        $data = json_decode($jsonContent, true);
        if (isset($data['posts'])) {
            foreach ($data['posts'] as $post) {
                if ($post['title'] === $title) {
                    $ogTitle = $post['title'];
                    $ogDesc = substr(strip_tags($post['body']), 0, 150) . '...';
                    if (isset($post['thumbnail']) && !empty($post['thumbnail'])) {
                        $ogImage = $baseUrl . ltrim($post['thumbnail'], '/');
                    } elseif (isset($post['image']) && !empty($post['image'])) {
                        $ogImage = $baseUrl . ltrim($post['image'], '/');
                    } else {
                        $ogImage = $baseUrl . "media/news-placeholder.jpg"; // generic fallback
                    }
                    break;
                }
            }
        }
    }
} elseif ($type === 'event' && !empty($title)) {
    $targetUrl = $baseUrl . "event-details.html?title=" . urlencode($title);
    $jsonContent = @file_get_contents(__DIR__ . '/content/events.json');
    if ($jsonContent) {
        $data = json_decode($jsonContent, true);
        if (isset($data['events_list'])) {
            foreach ($data['events_list'] as $event) {
                if ($event['title'] === $title) {
                    $ogTitle = $event['title'];
                    $ogDesc = substr(strip_tags($event['description']), 0, 150) . '...';
                    if (isset($event['image']) && !empty($event['image'])) {
                        $ogImage = $baseUrl . ltrim($event['image'], '/');
                    }
                    break;
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($ogTitle) ?></title>
    <!-- Open Graph Meta Tags for WhatsApp/Facebook/Twitter -->
    <meta property="og:title" content="<?= htmlspecialchars($ogTitle) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($ogDesc) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($ogImage) ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($targetUrl) ?>" />
    <meta property="og:type" content="article" />
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= htmlspecialchars($ogTitle) ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($ogDesc) ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($ogImage) ?>">

    <!-- Fallback redirect if JS is disabled -->
    <meta http-equiv="refresh" content="0;url=<?= htmlspecialchars($targetUrl) ?>">
</head>
<body>
    <p>Redirecting to article...</p>
    <!-- JavaScript redirect to actual page -->
    <script>
        window.location.replace(<?= json_encode($targetUrl) ?>);
    </script>
</body>
</html>
