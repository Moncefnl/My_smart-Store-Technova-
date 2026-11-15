<?php
/**
 * Orders REST API for XAMPP MySQL
 * إدارة الطلبيات والمبيعات ومزامنتها عبر PDO
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

// 1. جلب الطلبيات (GET)
if ($method === 'GET') {
    $storeId = $_GET['store_id'] ?? 'store-technova';
    $stmt = $pdo->prepare("SELECT * FROM `orders` WHERE `store_id` = ? ORDER BY `created_at` DESC");
    $stmt->execute([$storeId]);
    $orders = $stmt->fetchAll();

    // فك تشفير مصفوفة المنتجات من JSON
    foreach ($orders as &$ord) {
        if (!empty($ord['items_json'])) {
            $ord['items'] = json_decode($ord['items_json'], true);
        }
    }

    echo json_encode([
        'success' => true,
        'count'   => count($orders),
        'orders'  => $orders
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. إنشاء طلبية جديدة (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['customer_name']) || empty($data['customer_phone']) || empty($data['wilaya_code'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'اسم الزبون ورقم الهاتف والولاية حقول إلزامية'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = !empty($data['id']) ? $data['id'] : 'ord-' . time() . '-' . rand(100, 999);
    $orderNumber = !empty($data['order_number']) ? $data['order_number'] : 'ORD-' . date('Y') . '-' . rand(1000, 9999);
    $storeId = $data['store_id'] ?? 'store-technova';
    $itemsJson = isset($data['items']) ? json_encode($data['items'], JSON_UNESCAPED_UNICODE) : '[]';

    $sql = "INSERT INTO `orders` (
        `id`, `store_id`, `order_number`, `customer_name`, `customer_phone`,
        `wilaya_code`, `wilaya_name`, `commune`, `address`, `subtotal`,
        `shipping_fee`, `total_amount`, `status`, `payment_method`, `notes`, `items_json`
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id,
        $storeId,
        $orderNumber,
        $data['customer_name'],
        $data['customer_phone'],
        $data['wilaya_code'],
        $data['wilaya_name'] ?? ('ولاية ' . $data['wilaya_code']),
        $data['commune'] ?? '',
        $data['address'] ?? '',
        (float) ($data['subtotal'] ?? $data['total_amount'] ?? 0),
        (float) ($data['shipping_fee'] ?? 0),
        (float) ($data['total_amount'] ?? 0),
        $data['status'] ?? 'pending',
        $data['payment_method'] ?? 'cod',
        $data['notes'] ?? null,
        $itemsJson
    ]);

    echo json_encode([
        'success'      => true,
        'message'      => 'تم تسجيل الطلبية بنجاح في قاعدة البيانات MySQL 📦',
        'order_id'     => $id,
        'order_number' => $orderNumber
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. تحديث حالة الطلبية (PUT)
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id']) || empty($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'معرف الطلب والحالة الجديدة حقول مطلوبة'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE `orders` SET `status` = ?, `updated_at` = NOW() WHERE `id` = ?");
    $stmt->execute([$data['status'], $data['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'تم تحديث حالة الطلبية بنجاح'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
