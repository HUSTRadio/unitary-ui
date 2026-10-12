import { useState } from "react";
import { Carousel, type CarouselVariant } from "@hustradio/unitary-ui";
import { Select, SelectItem } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

export default function CarouselVariantsExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [variant, setVariant] = useState<CarouselVariant>("fade");
  return (
    <div className="w-full max-w-2xl space-y-4">
      <Select
        label={zh ? "切换效果" : "Transition effect"}
        value={variant}
        onValueChange={(value) => setVariant(value as CarouselVariant)}
      >
        <SelectItem value="slide">{zh ? "滑动" : "Slide"}</SelectItem>
        <SelectItem value="fade">{zh ? "淡入淡出" : "Fade"}</SelectItem>
        <SelectItem value="fade-scale">{zh ? "淡入淡出与缩放" : "Fade and scale"}</SelectItem>
      </Select>
      <Carousel
        variant={variant}
        images={[
          { src: "/gallery-coast.svg", alt: zh ? "海岸与远山" : "Coast and distant hills" },
          { src: "/gallery-desert.svg", alt: zh ? "沙漠与沙丘" : "Desert dunes" },
          { src: "/gallery-forest.svg", alt: zh ? "森林与雪山" : "Forest and snowy mountains" },
        ]}
      />
    </div>
  );
}
