'use client';

import { IdeaUrStory, IdeaUrStoryConfig } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { useEffect, useRef, useState } from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IdeaSectionFinish } from "./idea-content-finish";
import { IdeaSectionImage } from "./idea-section-image";
import { IdeaSectionMain } from "./idea-section-main";
import { IdeaSectionText } from "./idea-section-text";
import { IdeaSectionVoice } from "./idea-section-voice";



const IdeaUrStroryContentWrapper = ({ lang, className = "", config }: { lang: LangCode; className?: string, config: IdeaUrStoryConfig }) => {
  const data = useRef<IdeaUrStory>();
  const [section, setSection] = useState<number>(0);
  const [progressbar, setProgressbar] = useState<number>(66);
  useEffect(() => {
    switch (section) {
      case 0:
        setProgressbar(33);
        break;
      case 4:
        setProgressbar(99);
        break;
      default:
        setProgressbar(66);
    }
  }, [section])
  return (
    <div className={`${className}`}>
      <div className={`h-1 bg-main2/50`}><div className={`w-[${progressbar}%] transition-all duration-500`}><div className={`h-1 bg-main animate-progressBar transition-all duration-500`}></div></div></div>
      <div className={`max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto`}>
        {section !== 0 && section !== 4 && <div className='flex flex-row items-center space-x-2 cursor-pointer text-main ml-2 mt-2' onClick={() => setSection(0)}>
          <RiArrowGoBackLine className='h-4 w-4 md:h-5 md:w-5' />
          <span className='md:text-lg'>返回</span>
        </div>}
        {section === 0 && <IdeaSectionMain title={config.title} description={config.description} accept={config.accept} setSection={setSection} />}
        {section === 1 && <IdeaSectionText setSection={setSection} data={data} />}
        {section === 2 && <IdeaSectionVoice setSection={setSection} data={data} />}
        {section === 3 && <IdeaSectionImage setSection={setSection} data={data} />}
        {section === 4 && <IdeaSectionFinish setSection={setSection} data={data} />}
      </div>
    </div>
  )
}

export { IdeaUrStroryContentWrapper };
