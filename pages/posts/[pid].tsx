import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { RiFocus2Line, RiHome2Line } from "react-icons/ri";
import { Breadcrumb } from "../../components/breadcrumb";
import { PageWrapper } from "../../components/page-wrapper";
import { langCode } from "../../language/lang";
import { GlobalDB, PostDocument } from "../../types/firestore";
import { Global } from "../../types/global";
import { db } from "../../utils/firebase";
import ScrollToTop from "../../components/scroll-top";
import { Dispatch, useState } from "react";
import { SetterOrUpdater } from "recoil";
import { Recomended } from "../../components/recomended";
import { getDBObject } from "../../utils/get-firestore";

const Posts = ({ post, lang }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [scaleLevel, setScaleLevel] = useState<number>(0)
  return (
    <PageWrapper lang={lang} page={{ ...Global.webMap.posts, title: (lang) => { return post.title; } }} withNavbar={true} className="!max-w-xs md:!max-w-4xl lg:!max-w-5xl pb-8" operating={false}>
      <Breadcrumb args={[{ title: Global.webMap.posts.title(lang), href: "/posts", icon: Global.webMap.posts.nav.icon }, { title: post.title, href: `/posts/${post.postId}`, icon: RiFocus2Line }]} />
      <div className={`flex flex-col text-main md:ml-7 ${ScaleClassName(scaleLevel)}`}>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row w-max mt-2 md:mt-4 text-[10px] md:text-xs bg-main2/90 text-background2 space-x-2 px-3 py-1 rounded">
            {post.tag.map((tag, key) => (
              <span key={key}>#{tag}</span>
            ))}
          </div>
          <ScaleButtons setScaleLevel={setScaleLevel} />
        </div>
        <h1 className="mt-3 font-medium">{post.title}</h1>
        <span className="mt-1 mb-4 text-xs md:text-sm text-main/70">{timestamp2Chinese(post.timestamp.seconds)} (台灣時間)</span>
        <div>
          {post.data.blocks.map((data, key) => {
            switch (data.type) {
              case "paragraph":
                return (<p className="mb-4" id={data.id} dangerouslySetInnerHTML={{ __html: data.data.text }}></p>);
              case "header":
                return (<h2 className="mt-2 font-bold" id={data.id} dangerouslySetInnerHTML={{ __html: data.data.text }}></h2>);
              default:
                console.log(key, data);
                return (<></>);
            }
          })}
        </div>
        <ScrollToTop />
      </div>
    </PageWrapper>
  )
}

const ScaleButtons = ({ setScaleLevel }: { setScaleLevel: SetterOrUpdater<number> }) => {
  return (
    <div className="flex flex-row items-end w-max select-none">
      <span className="mr-2 text-xs text-main/70">字體大小</span>
      <span className="bg-main/70 text-background mr-1 px-[6.7px] py-[2px] rounded cursor-pointer hover:bg-main/80" onClick={(e) => setScaleLevel((s) => s >= 1 ? 1 : s + 1)}>A</span>
      <span className="bg-main/70 text-background ml-1 px-[7.0px] py-[2px] rounded cursor-pointer hover:bg-main/80" onClick={(e) => setScaleLevel((s) => s <= -1 ? -1 : s - 1)}>a</span>
    </div>
  )
}

const ScaleClassName = (scaleLevel: number) => {
  if (scaleLevel === 0) {
    return "prose-h1:text-4xl prose-h1:md:text-5xl prose-p:text-base prose-h2:text-lg"
  }
  else if (scaleLevel === 1) {
    return "prose-h1:text-5xl prose-h1:md:text-6xl prose-p:text-lg prose-h2:text-xl"
  }
  else {
    return "prose-h1:text-3xl prose-h1:md:text-4xl prose-p:text-sm prose-h2:text-base"
  }
}

export const timestamp2Chinese = (timestamp: EpochTimeStamp) => {
  const date = new Date(timestamp * 1000);
  const amORpm = date.getHours() >= 12 ? "下午" : "上午";
  const numChinese = ["一", "二", "三", "四", "五", "六", "日"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 週${numChinese[date.getDay() - 1]} ${amORpm}${date.getHours() % 12 || 12}時`
}

export async function getStaticPaths() {
  const posts = await getDocs(query(collection(db, "posts"), where("isPublic", "==", true)));
  const paths = posts.docs.map(docu => {
    return { params: { pid: docu.id } };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{ pid: string }>) {
  if (!context.params) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
  const lang = await context.locale;
  const postFromServer = await getDoc(doc(db, "posts", context.params.pid));
  const postData = postFromServer.data() as PostDocument;
  const post = {
    postId: context.params.pid,
    title: postData.title,
    data: postData.data,
    tag: postData.tag,
    author: postData.owner,
    timestamp: JSON.parse(JSON.stringify(postData.createdTimestamp)),
  }
  return {
    props: {
      post: post,
      lang: lang ? lang as langCode : "zh"
    },
  }
}

export default Posts;