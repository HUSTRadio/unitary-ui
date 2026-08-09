import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

type GeistTypographyGroup = "geist-heading" | "geist-button" | "geist-label" | "geist-copy";

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
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}
