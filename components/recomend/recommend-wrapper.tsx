import { Posts } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { getDocFromCacheOrServer } from "@/utils/get-firestore";
import { RecomendElement } from "./recommed";

async function getRecommend() {
  const posts = await getDocFromCacheOrServer<Posts>("Global", "Posts");
  return posts;
}

const RecommendWrapper = async ({ className, lang }: { className?: string; lang: LangCode }) => {
  const posts = await getRecommend();
  return (
    <div className={`${className} space-y-4`}>
      <RecomendElement posts={posts.posts} lang={lang} />
    </div>
  )
}

export const revalidate = 150;
export { RecommendWrapper };
