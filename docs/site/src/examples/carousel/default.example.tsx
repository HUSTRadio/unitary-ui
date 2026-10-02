import { Carousel } from "@/components/ui/carousel";
import { useI18n } from "@/lib/i18n";

export default function CarouselExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <Carousel
      className="w-full max-w-2xl"
      images={[
        {
          src: "/gallery-coast.svg",
          alt: zh ? "海岸与远山插画" : "Illustration of a coast and distant hills",
          caption: zh ? "海岸" : "Coast",
        },
        {
          src: "/gallery-desert.svg",
          alt: zh ? "沙漠与沙丘插画" : "Illustration of desert dunes",
          caption: zh ? "沙漠" : "Desert",
        },
        {
          src: "/gallery-forest.svg",
          alt: zh ? "森林与雪山插画" : "Illustration of a forest and snowy mountains",
          caption: zh ? "森林" : "Forest",
        },
      ]}
    />
  );
}
