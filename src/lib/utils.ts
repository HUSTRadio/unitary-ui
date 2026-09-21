import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

type GeistTypographyGroup =
  | "geist-heading"
  | "geist-button"
  | "geist-label"
  | "geist-copy"
  | "geist-style";

const mergeClasses = extendTailwindMerge<GeistTypographyGroup>({
  extend: {
    classGroups: {
      "geist-heading": [
        {
          text: [
            "heading-14",
            "heading-16",
            "heading-20",
            "heading-24",
            "heading-32",
            "heading-40",
            "heading-48",
            "heading-56",
            "heading-64",
            "heading-72",
          ],
        },
      ],
      "geist-button": [{ text: ["button-12", "button-14", "button-16"] }],
      "geist-label": [
        {
          text: [
            "label-12",
            "label-12-mono",
            "label-13",
            "label-13-mono",
            "label-14",
            "label-14-mono",
            "label-16",
            "label-18",
            "label-20",
          ],
        },
      ],
      "geist-copy": [
        {
          text: ["copy-13", "copy-13-mono", "copy-14", "copy-16", "copy-18", "copy-20", "copy-24"],
        },
      ],
      /* HIG 文本样式族（@utility text-style-*）。未登记时会被 tailwind-merge 的
         「任意 text-* = 文本色」兜底规则吃掉：cn("text-style-subhead …", "text-gray-900")
         会静默丢弃字号/行高。与 label/copy/heading 族同级登记。 */
      "geist-style": [
        {
          text: [
            "style-large-title",
            "style-title1",
            "style-title2",
            "style-title3",
            "style-headline",
            "style-body",
            "style-callout",
            "style-subhead",
            "style-footnote",
            "style-caption1",
            "style-caption2",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}

/** number → px 字符串；字符串原样返回（组件 width/height 双形态输入的标准化，snippet / skeleton 共用）。 */
export function toCssSize(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}
