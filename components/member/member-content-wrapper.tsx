import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getProfiles, getTeams } from "@/utils/get-firestore";
import { BreadcrumbServerWrapper } from "../breadcumb/breadcumb-server";
import { MembersContent } from "./member-content";

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

export const revalidate = 300;
export { MembersContentWrapper };

export type TeamInfo = {
  team: number;
  teamId: string;
}