<?

function notificationsAdd($profileIds, $notification) {
	$hlbl = 1;
	$hlblock = HL\HighloadBlockTable::getById($hlbl)->fetch(); 

	$entity = HL\HighloadBlockTable::compileEntity($hlblock); 
	$entity_data_class = $entity->getDataClass(); 
	if(is_array($profileIds)) {
		foreach($profileIds as $id) {
			$result = $entity_data_class::add(array(
				'UF_USER_ID' => $id,
				'UF_TEXT' => $notification["TEXT"],
				'UF_TYPE' => $notification["TYPE"],
				'UF_TITLE' => $notification["TITLE"],
				'UF_STATUS' => 2
		   ));
		}
	} else {
		$result = $entity_data_class::add(array(
			'UF_USER_ID' => $profileIds,
			'UF_TEXT' => $notification["TEXT"],
			'UF_TYPE' => $notification["TYPE"],
			'UF_TITLE' => $notification["TITLE"],
			'UF_STATUS' => 2
	   ));
	}
}