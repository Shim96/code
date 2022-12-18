<?php

namespace Spbgasu;

use Bitrix\Main\Loader;
Loader::includeModule( 'iblock' );

class Files
{
    public static function ClearTmp ()
    {
    	// $dir = $_SERVER["DOCUMENT_ROOT"]."/upload/tmp/";

		$iterator = new DirectoryIterator($dir);

		foreach($iterator as $element){

			// если "." или ".." пропускаем
		    if($element->isDot()) {
		        continue;
		    }

		    // получаем название файла
		    $nameArr = explode("/", $element->getRealPath());
		    $nameKey = count($nameArr)-1;

		    if(!$element->isDir()) {

		    	// по названию получаем файл в базе
		    	$res = CFile::GetList(array("FILE_SIZE"=>"desc"), array("MODULE_ID"=>"iblock", "FILE_NAME"=>$nameArr[$nameKey]));
				while($res_arr = $res->GetNext()) {

					$fileId = $res_arr["ID"];

					// текущая дата
				    $now = date_create(date("d.m.Y H:i:s."));

				    // дата загрузки файла
				    $fileDate = date_create(date("d.m.Y H:i:s.", filectime($element->getRealPath())));

				    // если разница дат больше суток удаляем
				    if(date_diff($now, $fileDate)->d > 0) {
				    	// CFile::Delete($fileId);
				    	// unlink($element->getRealPath());
				   	}
				}
			}

		    if($element->isDir()) {
		        ClearTmp($element->getRealPath());
		    }
		}
    }
}