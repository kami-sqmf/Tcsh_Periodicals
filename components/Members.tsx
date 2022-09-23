import { MouseEvent, useEffect, useState } from 'react';
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri';
import { Members as MembersType, RoleNum } from '../types/firestore';
import role from '../types/role';
import MemberProfile from './MemberProfile';

function Members({ memberData }: { memberData: MembersType[] }) {
    const [memberList, setMemberList] = useState(memberData.sort(function (a, b) { return a.role - b.role }))
    const [memberFilter, setMemberFilter] = useState<RoleNum>(1 as any)
    const [LeftMenu, setLeftMenu] = useState(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    const [RightMenu, setRightMenu] = useState(<RiArrowRightSFill className='h-8 w-8 invisible' />)
    const showWhat = (e: MouseEvent<SVGElement>, change: number) => {
        const list = Object.keys(role).filter(i => parseInt(i) % 100 == 1)
        const index: RoleNum = list[list.indexOf(memberFilter.toString()) + change] ? list[list.indexOf(memberFilter.toString()) + change] : (change > 0 ? list[0] : list[list.length - 1]) as any
        change > 0 ? setRightMenu(<p className='text-sm text-main/90 font-bold animate-opacity text-center'>{role[index].name}</p>) : setLeftMenu(<p className='text-sm text-main/90 animate-opacity text-center ml-2'>{role[index].name}</p>)
    }
    const ridWhat = (e: MouseEvent<SVGElement>, change: number) => {
        change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    }
    const clickWhat = (e: MouseEvent<SVGElement>, change: number) => {
        const list = Object.keys(role).filter(i => parseInt(i) % 100 == 1)
        const index: RoleNum = list[list.indexOf(memberFilter.toString()) + change] ? list[list.indexOf(memberFilter.toString()) + change] : (change > 0 ? list[0] : list[list.length - 1]) as any
        setMemberFilter(index)
        change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    }
    useEffect(() => { 
        setMemberList(memberData.filter((e)=>{
            if(memberFilter == 1){
                return e
            }
            if(memberFilter == 101){
                return Math.floor(e.role / 100) == 1 || e.role % 100 == 0
            }
            console.log(Math.floor(memberFilter / 100))
            return Math.floor(e.role / 100) == Math.floor(memberFilter / 100)
        }))
      return () => {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberFilter])
    
    return (
        <div className="mt-4">
            <div className="flex flex-col items-center transition-all">
                <div className="flex flex-row justify-around items-center border-[1.5px] border-main text-main2 rounded w-full h-16">
                    <div className='transition-all basis-2/9'>{LeftMenu}</div>
                    <RiArrowLeftSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, -1)} onMouseEnter={(e) => showWhat(e, -1)} onMouseLeave={(e) => ridWhat(e, -1)} />
                    <p className='md:text-lg font-medium basis-3/9 text-center'>{role[memberFilter].name}</p>
                    <RiArrowRightSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, 1)} onMouseEnter={(e) => showWhat(e, 1)} onMouseLeave={(e) => ridWhat(e, 1)} />
                    <div className='transition-all basis-2/9'>{RightMenu}</div>
                    {/* <div className='flex flex-col justify-center items-center'>
                        <div className='h-5 w-5 bg-main2 border-main border-4 rounded-full -mb-2 z-20'>
                            <div className='mx-auto my-0.5 h-2 w-2 bg-red-600 rounded-full'></div>
                        </div>
                        <div className='h-10 w-2 bg-main2 rounded-sm'></div>
                    </div> */}
                </div>
            </div>
            <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
                {memberList.map((memberProfile => (
                    <MemberProfile key={memberProfile.uid} profile={memberProfile} />
                )))}
            </div>
        </div>
    )
}

export default Members