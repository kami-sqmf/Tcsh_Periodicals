import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";
import { RiImage2Fill, RiImage2Line, RiMic2Fill, RiMic2Line, RiQuillPenFill, RiQuillPenLine } from "react-icons/ri";
import { HoverICON } from "../global/hover-icon";

const sections = [{
  title: "筆墨",
  section: 1,
  icon: RiQuillPenLine,
  iconHover: RiQuillPenFill,
}, {
  title: "語音",
  section: 2,
  icon: RiMic2Line,
  iconHover: RiMic2Fill,
}, {
  title: "圖片",
  section: 3,
  icon: RiImage2Line,
  iconHover: RiImage2Fill,
}]

const IdeaSectionMain = ({ setSection, title, description, accept }: { setSection: Dispatch<SetStateAction<number>>; title: string; description: string; accept: number[] }) => (
  <div className='min-h-[80vh] w-full flex flex-col justify-around md:justify-center text-main my-8'>
    <h1 className='text-4xl font-bold mb-2'>{title}</h1>
    <p className="hidden md:block">{description}</p>
    <div className='flex flex-row justify-between w-full gap-12 md:mt-8'>
      {sections.filter((sec) => accept.includes(sec.section)).map((info, key) => (<App key={key} info={info} setSection={setSection} />))}
    </div>
  </div>
)

const App = ({ setSection, info }: { setSection: Dispatch<SetStateAction<number>>; info: { title: string; section: number; icon: IconType; iconHover: IconType; } }) => (
  <div className='flex-grow group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer' onClick={() => setSection(info.section)}>
    <HoverICON className="w-16 h-16 group-hover:!text-main2" Icon={info.icon} IconHover={info.iconHover} size={16} />
    <p className='pt-2 -pb-2 text-center text-lg text-main group-hover:text-main2 group-hover:font-medium'>{info.title}</p>
  </div>
)

export { IdeaSectionMain };
