import { Slide } from "@/types/firestore";
import { getDocsFromCacheOrServer } from "@/utils/get-firestore";
import { getPlaiceholder } from "plaiceholder";
import { SlideElement } from "./slide";

const getThumbnailsBlurData = async (imageUrl: string) => {
  try {
    const { base64 } = await getPlaiceholder(imageUrl);
    return base64;
  } catch (err) {
    return "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;"
  }
}

async function getSlides() {
  const slides = await getDocsFromCacheOrServer<Slide[]>("slides", "order", true);
  for (let i = 0; i < slides.length; i++) {
    const slide = slides.at(i);
    if (!slide) continue;
    slides[i] = {
      ...slide,
      image_blur: await getThumbnailsBlurData(slide.image)
    } as any
  }
  return slides;
}

const SlideWrapper = async ({ className }: { className?: string; }) => {
  const slides = await getSlides();
  return (
    <div className={`${className} space-y-4`}>
      <SlideElement slides={slides} />
    </div>
  )
}

export const revalidate = 150;
export { SlideWrapper };
