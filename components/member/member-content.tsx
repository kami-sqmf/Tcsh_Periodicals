'use client';

import { Member, Members, Role } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { db } from "@/utils/firebase";
import { collection, DocumentData, getDocs, getDocsFromCache, QuerySnapshot } from "firebase/firestore";
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import { Language } from "../global/language";
import { TeamInfo } from "./member-content-wrapper";
import { Profile } from "./profile";


const MembersContent = ({ lang, className = "", roles, teamsInfo, defaultProfiles }: { lang: LangCode; className?: string; roles: Role[]; teamsInfo: TeamInfo[]; defaultProfiles: Member[] }) => {
  const rolesParentList = roles.filter(roles => roles.parent);
  const serverList = useRef<Members[]>([{ team: teamsInfo[0].team, teamId: teamsInfo[0].teamId, profiles: defaultProfiles, present: teamsInfo[0].present }]);
  const [renderList, setRenderList] = useState<Member[]>(defaultProfiles);
  const [teamFilter, setTeamFilter] = useState<number>(teamsInfo[0].team);
  const [roleFilterIndex, setRoleFilterIndex] = useState<number>(0);
  const [LeftMenu, setLeftMenu] = useState(<RiArrowLeftSFill className='h-8 w-8 invisible' />);
  const [RightMenu, setRightMenu] = useState(<RiArrowRightSFill className='h-8 w-8 invisible' />);
  const findValidRole: any = (roles: Role[], currentIndex: number, change: number) => {
    const currentTeam = serverList.current.find(team => team.team === teamFilter);
    if (!currentTeam) return 0;
    let flag: number;
    if (currentIndex + change > roles.length - 1) flag = 0;
    else if (currentIndex + change < 0 && change < 0) flag = roles.length - 1 + change;
    else if (currentIndex + change < 0 && change > 0) flag = roles.length - 1;
    else flag = currentIndex + change;
    const nextRoleProfiles = currentTeam.profiles.findIndex(e => {
      if (!e.roleInfo) return false;
      if (rolesParentList[flag].id === e.roleInfo.id) return true;
      return rolesParentList[flag].childs.findIndex(role => (role as any).includes(e.roleInfo!.id)) >= 0;
    })
    if (nextRoleProfiles < 0) return findValidRole(roles, currentIndex, change > 0 ? change + 1 : change - 1);
    return flag;
  }
  const showWhat = (e: MouseEvent<SVGElement>, change: number) => {
    let index = findValidRole(rolesParentList, roleFilterIndex, change);
    change > 0 ? setRightMenu(<p className='text-sm text-main/90 font-bold animate-opacity text-center'>{rolesParentList[index].name[lang]}</p>) : setLeftMenu(<p className='text-sm text-main/90 animate-opacity text-center ml-2'>{rolesParentList[index].name[lang]}</p>)
  }
  const ridWhat = (e: MouseEvent<SVGElement>, change: number) => {
    change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
  }
  const clickWhat = (e: MouseEvent<SVGElement>, change: number) => {
    const index = findValidRole(rolesParentList, roleFilterIndex, change);
    setRoleFilterIndex(index);
    change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
  }
  useEffect(() => {
    const list = serverList.current.find(team => team.team === teamFilter);
    if (!list) return;
    setRenderList(list.profiles.filter(e => {
      if (!e.roleInfo) return false;
      if (rolesParentList[roleFilterIndex].id === e.roleInfo.id) return true;
      return rolesParentList[roleFilterIndex].childs.findIndex(role => (role as any).includes(e.roleInfo!.id)) >= 0;
    }))
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilterIndex])
  useEffect(() => {
    const queryTeamId = teamsInfo.filter(team => team.team === teamFilter)[0].teamId;
    const chachedList = serverList.current.find((team) => team.teamId === queryTeamId);
    if (chachedList) setRenderList(chachedList.profiles);
    else getProfiles(teamFilter, queryTeamId, roles, serverList, setRenderList);
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamFilter])
  return (
    <>
      <div className="relative mt-4">
        <select value={teamFilter} onChange={(e) => { setTeamFilter(parseInt(e.target.value)) }} className="absolute -top-9 right-0 text-sm text-main bg-transparent border-[1.5px] border-main px-2 py-1 rounded select-none outline-none">
          {teamsInfo.map((team) => (
            <option key={team.team} value={team.team}>{teamParser(lang, team.team)}</option>
          ))}
        </select>
        <div className="flex flex-col items-center transition-all select-none ">
          <div className="flex flex-row justify-around items-center border-[1.5px] border-main text-main2 rounded w-full h-16">
            <div className='transition-all basis-2/9'>{LeftMenu}</div>
            <RiArrowLeftSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, -1)} onMouseEnter={(e) => showWhat(e, -1)} onMouseLeave={(e) => ridWhat(e, -1)} />
            <p className='md:text-lg font-medium basis-3/9 text-center'>{rolesParentList[roleFilterIndex].name[lang]}</p>
            <RiArrowRightSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, 1)} onMouseEnter={(e) => showWhat(e, 1)} onMouseLeave={(e) => ridWhat(e, 1)} />
            <div className='transition-all basis-2/9'>{RightMenu}</div>
          </div>
        </div>
        <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
          {renderList
            .sort((a, b) => (a.roleInfo?.order || 0) - (b.roleInfo?.order || 0))
            .map((profile, index) => (
              <Profile key={index} profile={profile} lang={lang} />
            ))}
        </div>
        <div className="my-3 flex justify-end">
          <Language lang={lang} />
        </div>
      </div>
      {/* <ScrollToTop /> */}
    </>
  )
}

export { MembersContent };

export const teamParser = (lang: LangCode, team: number) => {
  if (lang === "zh") {
    return `第${chineseNumberParser(team)}屆`;
  } else {
    return `Team ${team}`;
  }
}

const chineseNumberParser = (number: number) => {
  let output = "";
  if (number < 10 || number >= 100) {
    const numStr = number.toString();
    const dic = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    for (let i = 0; i < numStr.length; i++) {
      output += dic[parseInt(numStr[i])];
    }
  } else if (number == 10) {
    output = "十";
  } else {
    const numStr = number.toString();
    const dic = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    for (let i = 0; i < numStr.length; i++) {
      if (i % 2 !== 0) output += "十"
      output += dic[parseInt(numStr[i])];
    }
    if (output[0] == "一") output = output.slice(1);
  }
  return output;
}

async function getProfiles(team: number, teamId: string, roles: Role[], serverListRef: MutableRefObject<Members[]>, setProfiles: Dispatch<SetStateAction<Member[]>>) {
  const docRef = collection(db, "members", teamId, "profiles");
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  const rawList = col.docs.map((doc) => doc.data()) as Member[];
  const list = rawList.map((profile) => {
    profile.roleInfo = roles.find(role => profile.role.path.includes(role.id));
    return profile;
  }) as Member[];
  setProfiles(list);
  serverListRef.current.push({ team: team, teamId: teamId, present: true, profiles: list });
}