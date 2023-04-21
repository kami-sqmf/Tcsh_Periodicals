import { Slide } from "@/types/firestore";
import { getDocsFromCacheOrServer } from "@/utils/get-firestore";
import { SlideElement } from "./slide";

async function getSlides() {
  const slides = await getDocsFromCacheOrServer<Slide[]>("slides", "order", true);
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
