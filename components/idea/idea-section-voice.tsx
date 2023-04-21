import { IdeaUrStory } from "@/types/firestore";
import { serverTimestamp } from "firebase/firestore";
import { MutableRefObject, useState, ChangeEvent, useCallback, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { RiPlaneFill } from "react-icons/ri";

const IdeaSectionVoice = ({ setSection, data }: { setSection: Dispatch<SetStateAction<number>>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [error, setError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (error === "") setNextDisabled(false);
    else setNextDisabled(true);
  }, [error])
  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (files) {
      if (files.length != 1) return setError("您沒有選擇檔案！請再試一次。");
      const file = files[0];
      if (((file.size / 1024) / 1024) > 30) { return setError("您選擇檔案太大了！最多30MB") };
      if (!file.type.startsWith("audio/") && !file.type.includes("ogg") && !file.type.includes("mp4")) return setError("您選擇的格式並非語音檔案！支援的語音檔案（.mp3, .wav, .aifc, .aiff, .m4a, .mp2, .ogg）");
      return setNextDisabled(false);
    } else {
      return setError("您沒有選擇檔案！請再試一次。")
    }
  }
  const onNextClick = () => {
    data.current = {
      type: "voice",
      file: inputRef.current!.files![0],
      content: textValue,
      createdTimestamp: serverTimestamp()
    }
    setSection(4);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請選擇您的語音檔案！</h1>
      <input type="file" accept="audio/*,application/ogg" onChange={onFileInput} ref={inputRef} />
      <input value={textValue} onChange={(e) => setTextValue(e.target.value)} className="text-lg resize-none w-[83vw] bg-transparent focus:outline-none mt-2" placeholder="請輸入簡述" />
      <span className='text-medium text-red-700'>{error}</span>
      <button disabled={nextDisabled || textValue.length === 0} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

export { IdeaSectionVoice }