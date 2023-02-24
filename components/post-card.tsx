import Link from "next/link";
import { timestamp2Chinese } from "../pages/posts/[pid]";
import { PostDocument } from "../types/firestore";
import Image from "next/image";

export const PostCard = ({ post, isEditor = false }: { post: { id: string; data: PostDocument; }; isEditor?: boolean }) => {
  const thumbnail = post.data.thumbnail ? post.data.thumbnail : post.data.data.blocks.filter((block) => block.type === "image")?.at(0)?.data.file.url || "https://firebasestorage.googleapis.com/v0/b/tcsh-periodicals.appspot.com/o/idea-urstory%2FKHwFIHiE1GGT4MLdXv?alt=media&token=a720de97-840e-4852-ab36-72a8256ec534";
  return (
    <Link href={`/${isEditor ? "editor" : "posts"}/${post.id}`} className={`group flex "flex-col" md:"flex-row"} gap-4`}>
      {thumbnail && <div className='border-0 group-hover:border-2 border-main2 transition-all duration-300 relative aspect-[16/9] rounded-lg overflow-hidden basis-1/4'><Image fill={true} src={thumbnail} alt={`縮圖-${post.data.title}`} className='object-cover' /></div>}
      <div className='basis-3/4 flex flex-col text-main group-hover:text-main2 transition-all duration-300'>
        <h3 className='text-2xl font-medium'>{post.data.title}</h3>
        <p className='text-base opacity-70 mt-2'>{post.data.description}</p>
        <div className='text-xs self-end mt-3 space-x-2'>
          {post.data.tag.map((tag, key) => (<span key={key}>#{tag}</span>))}
          <span>| {timestamp2Chinese((post.data.lastEditTimestamp as any).seconds)} (台灣時間)</span>
        </div>
      </div>
    </Link>
  )
}