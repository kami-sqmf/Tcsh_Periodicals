import { GetStaticProps, InferGetStaticPropsType } from "next"
import { MouseEvent } from "react"
import { RiArrowLeftSFill, RiArrowRightSFill, RiGroup2Line } from "react-icons/ri"
import { Breadcrumb } from "../components/Breadcrumb"
import { PageWrapper } from "../components/PageWrapper"
import ScrollToTop from "../components/scrollTop"
import { Global } from "../types/global"
import { useState, useEffect } from "react"
import { MemberRole, MemberRoleKey } from "../types/role"
import { getProps_Global_Members_DB } from "../utils/getFirestore"
import { Profile } from "../components/Profile"
import { Language } from "../components/Language"

const Member = ({ data, members, lang }: InferGetStaticPropsType<typeof getProps_Global_Members_DB>) => {
    const [memberList, setMemberList] = useState(Object.values(members))
    const [memberFilter, setMemberFilter] = useState<MemberRoleKey>(1)
    const [LeftMenu, setLeftMenu] = useState(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    const [RightMenu, setRightMenu] = useState(<RiArrowRightSFill className='h-8 w-8 invisible' />)
    const showWhat = (e: MouseEvent<SVGElement>, change: number) => {
        const list = Object.keys(MemberRole).filter(i => parseInt(i) % 100 == 1)
        const index: MemberRoleKey = list[list.indexOf(memberFilter.toString()) + change] ? list[list.indexOf(memberFilter.toString()) + change] : (change > 0 ? list[0] : list[list.length - 1]) as any
        change > 0 ? setRightMenu(<p className='text-sm text-main/90 font-bold animate-opacity text-center'>{MemberRole[index].name(lang)}</p>) : setLeftMenu(<p className='text-sm text-main/90 animate-opacity text-center ml-2'>{MemberRole[index].name(lang)}</p>)
    }
    const ridWhat = (e: MouseEvent<SVGElement>, change: number) => {
        change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    }
    const clickWhat = (e: MouseEvent<SVGElement>, change: number) => {
        const list = Object.keys(MemberRole).filter(i => parseInt(i) % 100 == 1)
        const index: MemberRoleKey = list[list.indexOf(memberFilter.toString()) + change] ? list[list.indexOf(memberFilter.toString()) + change] : (change > 0 ? list[0] : list[list.length - 1]) as any
        setMemberFilter(index)
        change > 0 ? setRightMenu(<RiArrowRightSFill className='h-8 w-8 invisible' />) : setLeftMenu(<RiArrowLeftSFill className='h-8 w-8 invisible' />)
    }
    useEffect(() => {
        setMemberList(Object.values(members).filter((e) => {
            if (memberFilter == 1) {
                return e
            }
            if (memberFilter == 101) {
                return Math.floor(e.role / 100) == 1 || e.role % 100 == 0
            }
            return Math.floor(e.role / 100) == Math.floor(memberFilter / 100)
        }))
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberFilter])
    return (
        <PageWrapper lang={lang} page={Global.webMap.member} withNavbar={true} operating={false}>
            <Breadcrumb args={[{ title: Global.webMap.member.title(lang), href: "/member", icon: RiGroup2Line }]} />
            <div className="mt-4">
                <div className="flex flex-col items-center transition-all">
                    <div className="flex flex-row justify-around items-center border-[1.5px] border-main text-main2 rounded w-full h-16">
                        <div className='transition-all basis-2/9'>{LeftMenu}</div>
                        <RiArrowLeftSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, -1)} onMouseEnter={(e) => showWhat(e, -1)} onMouseLeave={(e) => ridWhat(e, -1)} />
                        <p className='md:text-lg font-medium basis-3/9 text-center'>{MemberRole[memberFilter].name(lang)}</p>
                        <RiArrowRightSFill className='h-8 w-8 cursor-pointer basis-1/9' onClick={(e) => clickWhat(e, 1)} onMouseEnter={(e) => showWhat(e, 1)} onMouseLeave={(e) => ridWhat(e, 1)} />
                        <div className='transition-all basis-2/9'>{RightMenu}</div>
                    </div>
                </div>
                <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
                    {memberList.map((profile, index) => (
                        <Profile key={index} profile={{ type: "Member", data: profile }} owned={false} rounded={true} lang={lang} />
                    ))}
                </div>
                <div className="my-3 flex justify-end">
                    <Language lang={lang} />
                </div>
            </div>
            <ScrollToTop />
        </PageWrapper>
    )
}

export default Member

export const getStaticProps: GetStaticProps = getProps_Global_Members_DB