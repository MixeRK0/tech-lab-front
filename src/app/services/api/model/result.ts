/**
 * main
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import {ResultDataUnit} from '@services/api/model/resultDataUnit';
import {ResultDataStat} from '@services/api/model/resultDataStat';


export interface Result {
    id?: number;
    user_id?: number;
    input_text?: string;
    data?: Array<ResultDataUnit>;
    stat?: Array<ResultDataStat>;
}
