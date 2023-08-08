import { IdeaUrStory } from "@/types/firestore";
import { Dispatch, FormEvent, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { RiPlaneFill } from "react-icons/ri";

const IdeaSectionName = ({ setSection, data }: { setSection: Dispatch<SetStateAction<number>>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  const nameRef = useRef<HTMLInputElement>(null);
  const classRef = useRef<HTMLInputElement>(null);
  const onNextClick = () => {
    data.current!.class = classRef.current?.value;
    data.current!.name = nameRef.current?.value;
    setSection(5);
  }
  const checkInputCorrect = () => {
    if (nameRef.current?.value && classRef.current?.value) {
      if (nameRef.current.value.length > 1 && classRef.current.value.length > 2) return setNextDisabled(false);
    }
    return setNextDisabled(true);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請輸入您的班級與姓名</h1>
      <input ref={classRef} onInput={checkInputCorrect} className="text-lg resize-none bg-transparent focus:outline-none mt-2 border-main/60 border-b-2 focus:border-main" placeholder="請輸入您的班級名稱" />
      <input ref={nameRef} onInput={checkInputCorrect} className="text-lg resize-none bg-transparent focus:outline-none mt-2 border-main/60 border-b-2 focus:border-main" placeholder="請輸入您的姓名" />
      <button disabled={nextDisabled} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

export { IdeaSectionName };
