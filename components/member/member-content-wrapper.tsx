import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getProfiles, getTeams } from "@/utils/get-firestore";
import { BreadcrumbServerWrapper } from "../breadcumb/breadcumb-server";
import { MembersContent } from "./member-content";

const MembersContentWrapper = async ({ lang, className = "" }: { lang: LangCode; className?: string }) => {
  const teams = await getTeams();
  const presentTeam = teams.filter((t) => t.present === true);
  const profiles = await getProfiles(presentTeam[0] ? presentTeam[0].teamId : teams[0].teamId);
  return (
    <>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.member.title(lang) as string, href: webInfo.webMap.member.href, icon: webInfo.webMap.member.nav.icon }]} />
      <MembersContent lang={lang} teamsInfo={presentTeam.length > 0 ? presentTeam : teams } defaultProfiles={profiles} />
    </>
  )
}

export const revalidate = 300;
export { MembersContentWrapper };

export type TeamInfo = {
  team: number;
  teamId: string;
  present: boolean;
}