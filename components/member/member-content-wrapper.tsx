import { Member } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import { collection, DocumentData, getDocs, getDocsFromCache, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { BreadcrumbServerWrapper } from "../breadcumb/breadcumb-server";
import { MembersContent } from "./member-content";

async function getTeams() {
  const docRef = query(collection(db, "members"), orderBy("team", 'desc'));
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  return col.docs.map((doc) => {
    return {
      team: doc.data().team,
      teamId: doc.id
    }
  }) as TeamInfo[];
}

async function getProfiles(teamId: string) {
  const docRef = collection(db, "members", teamId, "profiles");
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  return col.docs.map((doc) => doc.data()) as Member[];
}

const MembersContentWrapper = async ({ lang, className = "" }: { lang: LangCode; className?: string }) => {
  const teams = await getTeams();
  const profiles = await getProfiles(teams[0].teamId);
  return (
    <>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.member.title(lang) as string, href: webInfo.webMap.member.href, icon: webInfo.webMap.member.nav.icon }]} />
      <MembersContent lang={lang} teamsInfo={teams} defaultProfiles={profiles} />
    </>
  )
}

export const revalidate = 150;
export { MembersContentWrapper };

export type TeamInfo = {
  team: number;
  teamId: string;
}