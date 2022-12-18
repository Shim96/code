<? require_once($_SERVER['DOCUMENT_ROOT'] . "/bitrix/modules/main/include/prolog_before.php");


$stageId = $_SESSION['stageId'];

CModule::IncludeModule("iblock");

$res = CIBlockElement::GetByID($stageId);

$stage_name = 'этап';

if($ar_res = $res->GetNext()) {
	$time = $stmp = MakeTimeStamp($ar_res["ACTIVE_TO"], "DD.MM.YYYY HH:MI:SS");
    $stage_name = $ar_res["NAME"];
}

unset($_SESSION['stageId']);

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

$headers = array(
    'alg'=>'HS256',
    'typ'=>'JWT'
);

$headers_encoded = base64url_encode( json_encode( $headers ) );

$profileFields = getProfileFields();
$profileProps = getProfileProps();

$arFio = array();

if ( !empty( $profileProps['LAST_NAME']['VALUE'] ) ) $arFio[] = $profileProps['LAST_NAME']['VALUE'];
if ( !empty( $profileProps['NAME']['VALUE'] ) ) $arFio[] = $profileProps['NAME']['VALUE'];
if ( !empty( $profileProps['SECOND_NAME']['VALUE'] ) ) $arFio[] = $profileProps['SECOND_NAME']['VALUE'];

$fullName = implode( ' ', $arFio );
$userId = getUserId();

$payload = array(
    'exp' => $time,
    'username' => 'user_' . $userId,
    'identifier' => 'session_' . $stageId . '_' . $profileFields["ID"],
    'nickname' => $fullName,
    'subject' => 'Этап олимпиады «' . $stage_name . '»'
);

$fp = fopen( 'file.txt', 'w' );
fwrite( $fp, print_r( $payload, true ) );
fclose( $fp );

$payload_encoded = base64url_encode( json_encode( $payload ) );

$signature = hash_hmac( 'sha256', $headers_encoded . '.' . $payload_encoded, 'go4eenguLoh2tai6Iatoojoo', true );

$signature_encoded = base64url_encode( $signature );

$token = $headers_encoded . '.' . $payload_encoded . '.' . $signature_encoded;

echo $token;