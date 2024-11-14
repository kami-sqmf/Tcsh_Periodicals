"use server";
import { getSlides } from "@/utils/get-firestore";
import { SlideElement } from "./slide";

const SlideWrapper = async ({ className }: { className?: string; }) => {
  const slides = await getSlides();
  return (
    <div className={`${className} space-y-4`}>
      <SlideElement slides={slides} />
    </div>
  )
}

export { SlideWrapper };
