'use client';

import { Dispatch, MouseEvent, PropsWithChildren, SetStateAction, useState } from "react";
import { IconType } from "react-icons";
import { Loading } from "../global/loading";
import { AdminManageModal } from "./modal";
import { AdminManageToolBar } from "./toolbar";

const AdminManageWrapper = ({ ready, toolbar, modalInfos, children }: PropsWithChildren<{ ready: boolean; toolbar: Toolbar; modalInfos: ModalInfos; }>) => {
  const [modalStatus, setModalStatus] = useState<typeof toolbar.actions[number]['name']>("");
  const [toolbarLevel, setToolbarLevel] = useState<number>(0);
  const onWrapperClicked = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.childNodes[0].contains(e.target as any)) return;
    if (e.currentTarget.childNodes[1] !== e.target && e.currentTarget.childNodes[1].contains(e.target as any)) {
      setToolbarLevel(1);
    }
    else {
      modalInfos.setModalInfo(null);
      setToolbarLevel(0);
    }
    return;
  }
  return (
    <>
      {ready ?
        <div className='mx-auto my-6 w-full bg-background2 rounded-md min-h-[70vh] px-8 py-6' onClickCapture={onWrapperClicked}>
          <AdminManageToolBar actions={toolbar.actions} toolbarLevel={toolbarLevel} setModalOpen={modalInfos.setModalOpen} setActionType={setModalStatus}>
            <>{toolbar.left}</>
          </AdminManageToolBar>
          <>{children}</>
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>}
      {ready && <AdminManageModal modalInfos={modalInfos.infos} modalOpen={modalInfos.modalOpen} setModalOpen={modalInfos.setModalOpen} modalType={modalStatus} />}
    </>
  )
}

export type ModalInfos = {
  infos: ModalInfo[];
  modalInfo: any;
  setModalInfo: Dispatch<SetStateAction<any>>;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

type ModalInfo = {
  name: string;
  title: string;
  modal: JSX.Element;
}

export type Toolbar = {
  actions: Action[];
  left?: JSX.Element;
}

type Action = {
  name: string;
  text: string;
  level: number[];
  icon: IconType;
  iconHover: IconType;
  onClick?: VoidFunction;
}

export { AdminManageWrapper };