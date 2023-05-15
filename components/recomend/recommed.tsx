'use client';
import { Post } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import Image from "next/image";
import Link from "next/link";
import i18nDefault from "@/translation/recommend/zh.json";
import i18n from "@/utils/i18n";
import { useRef, useState } from "react";

const RecomendElement = ({ className = "", posts, lang }: { className?: string; posts: Post[]; lang: LangCode }) => {
  const t = new i18n<typeof i18nDefault>(lang, "recommend");
  const errorRef = useRef<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const errorHandler = async () => {
    if (errorRef.current === true) return;
    errorRef.current = true;
    await fetch("/api/updateIG");
    window.location.reload;
  }
  return (
    <div className={`${className} `}>
      <div className="text-main mb-4 md:mb-9 flex flex-row items-baseline justify-between">
        <span className="text-lg md:text-3xl font-medium">{t._("recommend_title")}</span>
        <Link href={webInfo.webMap.posts.href} className="cursor-pointer hover:scale-105 hover:-translate-x-1 transition-all">
          <span className="text-main2 text-xs md:text-base font-light">{t._("recommend_more")}</span>
        </Link>
      </div>
      <div className="px-4 md:px-12 md:pt-[-2em] border-2 border-main">
        {posts.filter((item, index) => item.title.length > 18).filter((item, index) => index < 3).map((post, key) => (
          <Link key={key} href={post.url}>
            <div className="my-9 md:mt-11 flex flex-col md:flex-row items-center cursor-pointer hover:scale-[1.01] transition-all">
              <div className={`relative w-full h-auto aspect-square md:aspect-[16/9] md:h-24 md:w-auto ${isLoading ? "animate-pulse bg-background2 rounded" : ""}`}>
                <Image src={post.thumbnail} fill={true} className="object-cover" alt="文章縮圖" loading="lazy" onLoad={() => setLoading(false)} onError={() => errorHandler()} />
              </div>
              <div className="md:ml-6 md:-mt-2">
                <div className="text-sm text-main font-medium mt-1.5 flex flex-row">
                  {post.categories.filter((item, index) => index < 3).map((category, key) => (
                    <p className="mr-2" key={key}>{post.categories.length > 1 ? "#" : ""}{category.replaceAll(" ", "  ")}</p>
                  ))}
                </div>
                <p className="text-base text-gray-700 font-medium mt-1.5 line-clamp-2">{post.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export { RecomendElement };
