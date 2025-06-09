import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @class SearchRestaurantDto类
 * @description 定义搜索餐厅时，URL查询参数的结构和验证规则。
 */
export class SearchRestaurantDto {
    /**
     * @property {string} [keyword] - 搜索关键词，支持餐厅名称和描述的搜索。
     * @optional
     */
    @IsOptional()
    @IsString()
    keyword?: string;

    /**
     * @property {string} [category] - 按菜品分类搜索的类别。
     * @optional
     */
    @IsOptional()
    @IsString()
    category?: string;

    /**
     * @property {number} [page] - 页码，默认为1。
     * @optional
     * @minimum 1
     */
    @IsOptional()
    @Type(() => Number) // 将字符串转换为数字
    @IsNumber()
    @Min(1)
    page?: number = 1;

    /**
     * @property {number} [pageSize] - 每页数量，默认为10。
     * @optional
     * @minimum 1
     */
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize?: number = 10;
}