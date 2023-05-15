import { LangCode } from "@/types/i18n";
import { getRecommend } from "@/utils/get-firestore";
import { RecomendElement } from "./recommed";


const RecommendWrapper = async ({ className, lang }: { className?: string; lang: LangCode }) => {
  const posts = await getRecommend();
  return (
    <div className={`${className} space-y-4`}>
      <RecomendElement posts={posts.posts} lang={lang} />
    </div>
  )
}

export const revalidate = 300;
export { RecommendWrapper };
