$stmt = $db->query('SELECT * FROM ALL_DATA WHERE id=1');
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
$ID = $row['ID']; 
$Bmag = $row['Bmag'];
}

header('Content-type: application/json');

echo json_encode(array($ID,$Bmag));

