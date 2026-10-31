/**
 * 粘贴矩阵解析（M3-04）。
 *
 * 只处理「剪贴板文本 → 二维单元格」这一步：优先按制表符（表格软件），
 * 否则按逗号（CSV）切分；引号包裹与转义不在本轮范围，遇到时按字面字符处理。
 */

/** 行分隔：CRLF / LF / CR。 */
const ROW_BREAK = /\r\n|\n|\r/;

/** 解析剪贴板文本；空文本返回空数组。 */
export function parsePasteMatrix(text: string): string[][] {
  if (!text) return [];
  // 末尾换行（含 CRLF）不产生空行。
  const trimmed = text.replace(/(?:\r\n|\n|\r)+$/, "");
  if (!trimmed) return [];
  const delimiter = trimmed.includes("\t") ? "\t" : ",";
  return trimmed.split(ROW_BREAK).map((row) => row.split(delimiter).map((cell) => cell.trim()));
}

/** 是否是「块」粘贴（多于一行或多于一列）。 */
export function isBlockPaste(matrix: string[][]): boolean {
  if (matrix.length === 0) return false;
  return matrix.length > 1 || (matrix[0]?.length ?? 0) > 1;
}
