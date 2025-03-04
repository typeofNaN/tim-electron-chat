import { DataTableColumn } from 'naive-ui'

/**
 * 动态计算表格总宽度
 * @description 遍历表格列配置,累加每列的宽度。优先使用width属性,若无则使用minWidth,都没有则取0
 * @param tableColumns - 表格列配置数组
 * @returns {number} 表格总宽度
 */
export function dynamicSetTableWidth(tableColumns: DataTableColumn[]): number {
  return tableColumns.reduce((totalWidth: number, column: DataTableColumn) => {
    // 优先取width属性,没有则取minWidth,都没有则取0
    const columnWidth = Number(column.width || column.minWidth) || 0
    return totalWidth + columnWidth
  }, 0)
}