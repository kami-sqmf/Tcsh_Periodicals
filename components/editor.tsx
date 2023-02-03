import EditorJS, { OutputData } from "@editorjs/editorjs";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { EDITOR_JS_TOOLS, Undo } from '../utils/editor-tool.js';
import { PostDocument } from "../types/firestore.js";


const EditorBlock = ({ data, onChange, editorId, serverData, titleRef }: { data?: OutputData; onChange(val: OutputData): void; editorId: string; serverData: PostDocument; titleRef: MutableRefObject<HTMLInputElement> }) => {
  const refEditor = useRef<EditorJS>();
  const [titleFocus, setTitleFocus] = useState<boolean>(false);

  useEffect(() => {
    if (!refEditor.current) {
      const editor = new EditorJS({
        holder: editorId,
        tools: EDITOR_JS_TOOLS,
        data: data,
        placeholder: "Write your thought",
        onReady: () => {
          const undo = new Undo({ editor, debounceTimer: 100 });
          if (data) undo.initialize(data);
        },
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
        inlineToolbar: true
      });
      refEditor.current = editor;
    }
    return () => {
      if (refEditor.current && refEditor.current.destroy) {
        refEditor.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id={editorId} className="w-full text-main prose-h2:text-lg prose-h2:font-medium my-6 flex flex-col">
      <div className="w-full">
        <div className="flex flex-row -ml-4 lg:ml-[54px]">
          <span className={`hidden md:block text-sm border-r-2 border-main/40 pr-3 mr-6 py-[22px] ${titleFocus ? "opacity-100" : "opacity-0"} transition-all duration-150`}>Title</span>
          <input id={"title"} defaultValue={serverData.title || ""} ref={titleRef} placeholder="Title" className="text-5xl font-bold bg-transparent focus:outline-none mb-2 flex-grow" onFocus={() => setTitleFocus(true)} onBlur={() => setTitleFocus(false)} />
        </div>
      </div>
    </div>
  )
}

export default EditorBlock;