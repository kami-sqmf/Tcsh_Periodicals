import Image from "next/image";
import Link from "next/link";
import { Global } from "./global";

const posts: {
    thumbnail: string;
    title: string;
    category: string;
}[] = [
        {
            thumbnail: "/1.JPG",
            title: "讓一間座落在台中的古厝現代化？如何從古老變為經典",
            category: "旅遊"
        }, {
            thumbnail: "/2.jpeg",
            title: "城市中到處可見的塗鴨？不同年齡層的看法",
            category: "城市"
        }
        , {
            thumbnail: "/3.png",
            title: "中國限電，哪些價格又要飆 | Fed會議紀要說了什麼?",
            category: "國際"
        }
    ]

function Recomended({ className }: { className: string }) {
    return (
        <div className={`${className} `}>
            <div className="text-main mb-4 md:mb-9 flex flex-row items-baseline justify-between">
                <span className="text-lg md:text-3xl font-medium">精選文章</span>
                <Link href={Global.webMap.posts.href}>
                    <span className="text-xs md:text-base font-light cursor-pointer hover:scale-105 hover:-translate-x-1 transition-all">更多文章⋯⋯</span>
                </Link>
            </div>
            <div className="px-5 md:px-12 md:pt-[-2em] border-2 border-main">
                {posts.map((post, key) => (
                    <div key={key} className="my-9 md:mt-11 flex flex-col md:flex-row items-center">
                        <div className="relative w-full h-auto aspect-[16/9] md:h-24 md:w-auto">
                            <Image src={post.thumbnail} layout="fill" objectFit="cover" alt="你看到這個的話那可能是你網路太爛了" />
                        </div>
                        <div className="md:ml-6 md:-mt-2">
                            <p className="text-sm text-main font-medium mt-2">{post.category}</p>
                            <p className="text-base font-medium mt-1.5 line-clamp-2">{post.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Recomended