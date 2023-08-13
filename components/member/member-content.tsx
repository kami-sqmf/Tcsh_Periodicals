'use client';

import { Member, Members } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { MemberRoleKey } from "@/types/role";
import { db } from "@/utils/firebase";
import { MemberRole } from "@/utils/role";
import { collection, DocumentData, getDocs, getDocsFromCache, QuerySnapshot } from "firebase/firestore";
import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import { Language } from "../global/language";
import { TeamInfo } from "./member-content-wrapper";
import { Profile } from "./profile";


const MembersContent = ({ lang, className = "", teamsInfo, defaultProfiles }: { lang: LangCode; className?: string; teamsInfo: TeamInfo[]; defaultProfiles: Member[] }) => {
  const serverList = useRef<Members[]>([{ team: teamsInfo[0].team, teamId: teamsInfo[0].teamId, profiles: defaultProfiles, present: teamsInfo[0].present }]);
  const [renderList, setRenderList] = useState<Member[]>(defaultProfiles);
  const [teamFilter, setTeamFilter] = useState<number>(teamsInfo[0].team);
  const [roleFilter, setRoleFilter] = useState<MemberRoleKey>(1);
  const [LeftMenu, setLeftMenu] = useState(<RiArrowLeftSFill className='h-8 w-8 invisible' />);
  const [RightMenu, setRightMenu] = useState(<RiArrowRightSFill className='h-8 w-8 invisible' />);
  const findValidRole: (list: string[], change: number) => MemberRoleKey = (list: string[], change: number) => {
    const currentTeam = serverList.current.find(team => team.team === teamFilter);
    if (!currentTeam) return 1;
    const currentRoleIndex = list.indexOf(roleFilter.toString());
    const flag = currentRoleIndex + change >= 0 ? (list.length > currentRoleIndex + change ? list[currentRoleIndex + change] : list[0]) : list[list.length - currentRoleIndex + change];
    if (!flag) return 1;
    else if (!currentTeam.profiles.find(profile => profile.role.toString()[0] === flag[0])) return findValidRole(list, change > 0 ? change + 1 : change - 1);
    else return parseInt(flag) as MemberRoleKey;
  }
  const showWhat = (e: MouseEvent<SVGElement>, change: number) => {
    const list = Object.keys(MemberRole).filter(i => parseInt(i) % 100 == 1);
    const index = findValidRole(list, change);
    change > 0 ? setRightMenu(<p className='text-sm text-main/90 font-bold animate-opacity text-center'>{MemberRole[index].name(lang)}</p>) : setLeftMenu(<p className='text-sm text-main/90 animate-opacity text-center ml-2'>{MemberRole[index as MemberRoleKey].name(lang)}</p>)
  }
  const ridWhat = (e: MouseEvent<SVGElement>, change: number) => {
    change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
  }
  const clickWhat = (e: MouseEvent<SVGElement>, change: number) => {
    const list = Object.keys(MemberRole).filter(i => parseInt(i) % 100 == 1)
    const index = findValidRole(list, change);
    setRoleFilter(index)
    change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
  }
  useEffect(() => {
    const list = serverList.current.find(team => team.team === teamFilter);
    if (!list) return;
    setRenderList(list.profiles.filter((e) => {
      if (roleFilter == 1) {
        return e
      }
      if (roleFilter == 101) {
        return Math.floor(e.role / 100) == 1 || e.role % 100 == 0
      }
      return Math.floor(e.role / 100) == Math.floor(roleFilter / 100)
    }))
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])
  useEffect(() => {
    const queryTeamId = teamsInfo.filter(team => team.team === teamFilter)[0].teamId;
    const chachedList = serverList.current.find((team) => team.teamId === queryTeamId);
    if (chachedList) setRenderList(chachedList.profiles);
    else getProfiles(teamFilter, queryTeamId,  serverList, setRenderList);
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
            <p className='md:text-lg font-medium basis-3/9 text-center'>{MemberRole[roleFilter as MemberRoleKey].name(lang)}</p>
            <RiArrowRightSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, 1)} onMouseEnter={(e) => showWhat(e, 1)} onMouseLeave={(e) => ridWhat(e, 1)} />
            <div className='transition-all basis-2/9'>{RightMenu}</div>
          </div>
        </div>
        <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
          {renderList.sort((a, b) => a.role - b.role).map((profile, index) => (
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

async function getProfiles(team: number, teamId: string, serverListRef: MutableRefObject<Members[]>, setProfiles: Dispatch<SetStateAction<Member[]>>) {
  const docRef = collection(db, "members", teamId, "profiles");
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  const list = col.docs.map((doc) => doc.data()) as Member[];
  setProfiles(list);
  serverListRef.current.push({ team: team, teamId: teamId, present: true, profiles: list });
}