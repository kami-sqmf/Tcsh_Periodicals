import { IdeaUrStory } from "@/types/firestore";
import { serverTimestamp } from "firebase/firestore";
import { MutableRefObject, useState, ChangeEvent, useCallback, Dispatch, SetStateAction } from "react";
import { RiPlaneFill } from "react-icons/ri";

const IdeaSectionText = ({ setSection, data }: { setSection: Dispatch<SetStateAction<number>>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [rowTextarea, setTextarea] = useState<number>(1);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    if (hiddenTextarea) {
      hiddenTextarea.value = e.target.value;
      setTextarea(hiddenTextarea.scrollHeight / 24);
    }
    if (hiddenTextarea.value.length === 0) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }
  const onRefChange = useCallback((node: HTMLTextAreaElement) => {
    if (node === null) return;
    const lookMount = setInterval(() => {
      if (node.scrollHeight !== 0) {
        clearInterval(lookMount);
        setTextarea(node.scrollHeight / 24);
      }
    }, 1)
  }, []);
  const onNextClick = () => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    data.current = {
      type: "text",
      content: hiddenTextarea.value,
      createdTimestamp: serverTimestamp()
    }
    setSection(4);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請輸入您的故事！</h1>
      <textarea id="textarea" className="text-base resize-none w-[83vw] bg-transparent focus:outline-none" rows={rowTextarea} placeholder="我想要說⋯⋯" onChange={handleTextArea} />
      <textarea id="hidden-textarea" className="text-base resize-none w-[83vw] invisible absolute overflow-hidden" rows={1} ref={onRefChange} disabled></textarea>
      <button disabled={nextDisabled} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

export { IdeaSectionText }