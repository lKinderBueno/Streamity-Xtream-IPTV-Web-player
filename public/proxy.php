<?php
// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

include "config.php";

// Check if CORS is enabled and DNS is configured
if($cors !== true || empty($dns)) {
    http_response_code(403);
    die('Proxy not available');
}

// Validate URL parameter exists
if (!isset($_GET['url']) || empty($_GET['url'])) {
    http_response_code(400);
    die('Missing URL parameter');
}

$url = $_GET['url'];

// Validate URL format
if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
    http_response_code(400);
    die('Invalid URL format');
}

// Normalize DNS by removing trailing slash
$dns_normalized = rtrim($dns, '/');

// Check if URL starts with the configured DNS
if (strpos($url, $dns_normalized) !== 0) {
    http_response_code(403);
    die('URL not allowed');
}

// Parse URL to validate scheme and host
$parsed_url = parse_url($url);

if ($parsed_url === false || !isset($parsed_url['scheme']) || !isset($parsed_url['host'])) {
    http_response_code(400);
    die('Invalid URL');
}

// Only allow http and https schemes
$url_scheme = strtolower($parsed_url['scheme']);
if (!in_array($url_scheme, ['http', 'https'])) {
    http_response_code(400);
    die('Invalid URL scheme');
}

// Prevent requests to private/internal IPs
$url_host = $parsed_url['host'];
$ip = gethostbyname($url_host);
if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
    http_response_code(403);
    die('Private/Reserved IP addresses not allowed');
}

// Sanitize and validate POST data
$post_data = null;
if (count($_POST) > 0) {
    // Limit POST data size to prevent memory exhaustion
    $max_post_size = 1024 * 100; // 100KB
    $post_json = json_encode($_POST);
    
    if (strlen($post_json) > $max_post_size) {
        http_response_code(413);
        die('Request too large');
    }
    
    $post_data = $post_json;
}

// Set timeout and configure stream context with security options
$timeout = 30; // 30 seconds timeout

try {
    if ($post_data !== null) {
        $options = array(
            'http' => array(
                'method'  => 'POST',
                'content' => $post_data,
                'header'  => "Content-Type: application/json\r\n" .
                            "Accept: application/json\r\n" .
                            "User-Agent: StreamityProxy/1.0\r\n",
                'timeout' => $timeout,
                'ignore_errors' => false,
                'follow_location' => 0 // Prevent redirect attacks
            )
        );
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
    } else {
        $options = array(
            'http' => array(
                'method'  => 'GET',
                'timeout' => $timeout,
                'ignore_errors' => false,
                'follow_location' => 0, // Prevent redirect attacks
                'header'  => "User-Agent: StreamityProxy/1.0\r\n"
            )
        );
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
    }
    
    if ($result === false) {
        http_response_code(502);
        die('Failed to fetch content');
    }
    
    // Set appropriate content type if available
    if (isset($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (stripos($header, 'Content-Type:') === 0) {
                header($header);
                break;
            }
        }
    }
    
    echo $result;
    
} catch (Exception $e) {
    http_response_code(500);
    die('Internal server error');
}

?>