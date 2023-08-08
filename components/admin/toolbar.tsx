'use client';

import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { HoverICON } from "../global/hover-icon";
import { Toolbar } from "./admin";

const AdminManageToolBar = ({ actions, toolbarLevel, setActionType, setModalOpen, children }: PropsWithChildren<{ actions: Toolbar["actions"]; toolbarLevel: number; setActionType: Dispatch<SetStateAction<string>>; setModalOpen: Dispatch<SetStateAction<boolean>>; }>) => {
  return (
    <div className='flex flex-row flex-wrap justify-between text-main'>
      <div className="">
        {children}
      </div>
      <div className='flex flex-row space-x-6'>
        {actions.map((action, key) => (
          <>
            {action.level.includes(toolbarLevel) && <div key={key} className='group flex flex-row space-x-1 hover:text-main2 cursor-pointer items-center' onClick={() => { action.onClick ? action.onClick() : true; setActionType(action.name); setModalOpen(true); }}>
              <HoverICON className='w-5 h-5' Icon={action.icon} IconHover={action.iconHover} size={5} />
              <span className='transition-all duration-300'>{action.text}</span>
            </div>}
          </>
        ))}
      </div>
    </div>
  )
}

export { AdminManageToolBar };
