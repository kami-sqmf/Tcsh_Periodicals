import { Posts } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { getDocFromCacheOrServer } from "@/utils/get-firestore";
import { getPlaiceholder } from "plaiceholder";
import { RecomendElement } from "./recommed";

const getThumbnailsBlurData = async (imageUrl: string) => {
  const { base64 } = await getPlaiceholder(imageUrl);
  return base64;
}

async function getRecommend() {
  const posts = await getDocFromCacheOrServer<Posts>("Global", "Posts");
  for (let i = 0; i < posts.posts.length; i++) {
    const post = posts.posts.at(i);
    if (!post) continue;
    posts.posts[i] = {
      ...post,
      thumbnail_blur: await getThumbnailsBlurData(post.thumbnail)
    } as any
  }
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
