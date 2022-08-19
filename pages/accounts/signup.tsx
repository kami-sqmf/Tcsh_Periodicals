import { Dialog, Transition } from '@headlessui/react';
import { collection, getDocs, query as queryDB, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, Dispatch, FormEvent, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';
import { setTimeout } from 'timers/promises';
import HeadUni from '../../components/HeadUni';
import { decrypt } from '../../utils/crypt';
import { db } from '../../utils/firebase';

const NetflixAvatars = [
  {
    "name": "經典",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E5%8F%B2%E5%98%89%E8%95%BE%C2%B7%E5%A5%87%E5%88%A9%E8%8C%B2.png?alt=media&token=8e9bf610-2f6f-4409-8867-a00e56129f01",
        "name": "史嘉蕾·奇利茲.png"
      },
      {
        "name": "桑妮·奇利茲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E6%A1%91%E5%A6%AE%C2%B7%E5%A5%87%E5%88%A9%E8%8C%B2.png?alt=media&token=1f51b1b8-2fa3-4f54-bd8a-e1901f22add2"
      },
      {
        "name": "羅賓·奇利茲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%BE%85%E8%B3%93%C2%B7%E5%A5%87%E5%88%A9%E8%8C%B2.png?alt=media&token=889df9c1-f6b3-430a-bb32-095af6e62ffc"
      },
      {
        "name": "達斯提·奇利茲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E9%81%94%E6%96%AF%E6%8F%90%C2%B7%E5%A5%87%E5%88%A9%E8%8C%B2.png?alt=media&token=da414601-0cf2-41f2-891d-284731d53975"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%B4%AB%E8%89%B2%E8%B6%85%E7%B4%9A%E8%8B%B1%E9%9B%84.png?alt=media&token=f7774aa7-a26e-43c4-a330-10172635385e",
        "name": "紫色超級英雄.png"
      },
      {
        "name": "鬍鬚.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E9%AC%8D%E9%AC%9A.png?alt=media&token=f89dc286-30dd-48fd-94c2-fb580a6cbc94"
      },
      {
        "name": "小狗.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E5%B0%8F%E7%8B%97.png?alt=media&token=8d0e2ebb-465e-420b-8e94-01f8611d7e33"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%B4%85%E8%89%B2%E8%B6%85%E7%B4%9A%E8%8B%B1%E9%9B%84.png?alt=media&token=3619ebf8-4a51-4f57-a4df-407bd23f2e4a",
        "name": "紅色超級英雄.png"
      },
      {
        "name": "紫色企鵝.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%B4%AB%E8%89%B2%E4%BC%81%E9%B5%9D.png?alt=media&token=5eaf4132-6d55-44fa-bcc9-604007836121"
      },
      {
        "name": "粉色傻笑.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%B2%89%E8%89%B2%E5%82%BB%E7%AC%91.png?alt=media&token=aa8506e7-25ce-4dc2-b535-24313ca0e4ff"
      },
      {
        "name": "野雞.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E9%87%8E%E9%9B%9E.png?alt=media&token=a624885f-e3bb-4a97-859f-45fa27acb358"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%9C%BC%E7%BD%A9.png?alt=media&token=f902c557-16ae-41e4-8177-9d4eb5926044",
        "name": "眼罩.png"
      },
      {
        "name": "外星人.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E5%A4%96%E6%98%9F%E4%BA%BA.png?alt=media&token=69d8534a-1801-4fcb-ba9c-dd8095f5e4ff"
      }
    ],
    "quantity": 13
  },
  {
    "name": "BLACKPINK: Light Up the Sky",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FBLACKPINK%3A%20Light%20Up%20the%20Sky%2FJennie.png?alt=media&token=8191f270-1d50-4aaa-a308-70690e409613",
        "name": "Jennie.png"
      },
      {
        "name": "Jisoo.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FBLACKPINK%3A%20Light%20Up%20the%20Sky%2FJisoo.png?alt=media&token=88c99d5c-71d3-44e5-8a59-21238ec81281"
      },
      {
        "name": "Lisa.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FBLACKPINK%3A%20Light%20Up%20the%20Sky%2FLisa.png?alt=media&token=b9f6cb79-f3c2-4af9-8497-e280c04c043a"
      },
      {
        "name": "Rosé.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FBLACKPINK%3A%20Light%20Up%20the%20Sky%2FRos%C3%A9.png?alt=media&token=01945d85-886a-4981-a71e-c43641e5b486"
      }
    ],
    "quantity": 4
  },
  {
    "name": "My Little Pony：活力新生代",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E6%A1%91%E5%A6%AE%20(1).png?alt=media&token=bab45c69-ecb3-4154-907b-376f2204d434",
        "name": "桑妮 (1).png"
      },
      {
        "name": "希契.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E5%B8%8C%E5%A5%91.png?alt=media&token=d2fd5682-59ad-484b-a7bd-0527964cc4dc"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E4%BC%8A%E8%8C%B2.png?alt=media&token=5796aa6f-7591-4d86-8d34-44a3e9d8c478",
        "name": "伊茲.png"
      },
      {
        "name": "奇波.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E5%A5%87%E6%B3%A2.png?alt=media&token=32568355-5a4a-498c-82ac-18746b5c78b1"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E7%90%B5%E6%B3%A2.png?alt=media&token=61f737ee-d949-4885-b524-53e2e87c891d",
        "name": "琵波.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E4%BA%9E%E8%93%8B%E7%88%BE.png?alt=media&token=89940f09-7cb4-4a2c-bbc0-ef9bc0a2a963",
        "name": "亞蓋爾.png"
      },
      {
        "name": "菲麗絲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E8%8F%B2%E9%BA%97%E7%B5%B2.png?alt=media&token=75349c62-bc66-48f2-b5c8-d499dcc029b4"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E6%96%AF%E6%99%AE%E6%8B%89.png?alt=media&token=1b9c0992-20be-4a70-9e0f-83ee4fc57402",
        "name": "斯普拉.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E5%A4%A9%E5%A0%82%E5%A5%B3%E7%8E%8B.png?alt=media&token=5f9fddff-d1a3-4588-a2c8-7d0a57869edb",
        "name": "天堂女王.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E9%98%BF%E6%B3%95.png?alt=media&token=28fa79ce-bc58-46a8-a0d2-4f08f25e1528",
        "name": "阿法.png"
      },
      {
        "name": "雲芙.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E9%9B%B2%E8%8A%99.png?alt=media&token=a8eb9467-b743-425a-bc80-47437c98dbdb"
      },
      {
        "name": "桑妮 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2FMy%20Little%20Pony%EF%BC%9A%E6%B4%BB%E5%8A%9B%E6%96%B0%E7%94%9F%E4%BB%A3%2F%E6%A1%91%E5%A6%AE%20(1).png?alt=media&token=568d2da7-4773-41ea-bdcf-00fa1c2394ec"
      }
    ],
    "quantity": 12
  },
  {
    "name": "亞森·羅蘋",
    "files": [
      {
        "name": "怪盜紳士亞森.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E6%80%AA%E7%9B%9C%E7%B4%B3%E5%A3%AB%E4%BA%9E%E6%A3%AE.png?alt=media&token=d2f44d8a-16ae-475d-a333-447128671e75"
      },
      {
        "name": "宅男亞森.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E5%AE%85%E7%94%B7%E4%BA%9E%E6%A3%AE.png?alt=media&token=c2fab097-a4df-4352-963c-5fb0cc4a6fdf"
      },
      {
        "name": "商人亞森.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E5%95%86%E4%BA%BA%E4%BA%9E%E6%A3%AE.png?alt=media&token=b838f18e-4664-4f4e-a8e7-7c62a2b21ad9"
      },
      {
        "name": "工友亞森.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E5%B7%A5%E5%8F%8B%E4%BA%9E%E6%A3%AE.png?alt=media&token=7d61815d-2dd5-4237-8a7c-8c71971d84e1"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E8%B3%88%E8%A8%B4.png?alt=media&token=344986f0-14ff-470b-bf66-9bf9dae5da87",
        "name": "賈訴.png"
      },
      {
        "name": "項鍊.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E9%A0%85%E9%8D%8A.png?alt=media&token=76993c6e-41d9-499d-b0bf-d589e99bb027"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E4%BA%9E%E6%A3%AE%C2%B7%E7%BE%85%E8%98%8B%2F%E8%80%81%E4%BA%BA%E4%BA%9E%E6%A3%AE.png?alt=media&token=6b624689-bdb7-463c-851c-1716dbb91b72",
        "name": "老人亞森.png"
      }
    ],
    "quantity": 8
  },
  {
    "name": "光靈",
    "files": [
      {
        "name": "沃德.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%85%89%E9%9D%88%2F%E6%B2%83%E5%BE%B7.png?alt=media&token=94dd941a-7755-47bd-9c25-96ad07823990"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%85%89%E9%9D%88%2F%E9%9B%85%E5%90%84%E6%AF%94.png?alt=media&token=7569adec-33c6-43f9-b939-786047157390",
        "name": "雅各比.png"
      },
      {
        "name": "精靈.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%85%89%E9%9D%88%2F%E7%B2%BE%E9%9D%88.png?alt=media&token=cacf0f65-45aa-48ae-9c91-2ed96413701f"
      },
      {
        "name": "魔杖.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%85%89%E9%9D%88%2F%E9%AD%94%E6%9D%96.png?alt=media&token=ef7074a5-671b-4217-a9ee-54b986d00c83"
      }
    ],
    "quantity": 4
  },
  {
    "name": "勁爆女子監獄",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E6%B4%BE%E4%BD%A9.png?alt=media&token=d6610af1-c7c5-4b13-b75a-57aea5a54b8d",
        "name": "派佩.png"
      },
      {
        "name": "蘇珊.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E8%98%87%E7%8F%8A.png?alt=media&token=148097d4-7e39-4e0f-bc34-42b858435ab3"
      },
      {
        "name": "葛洛莉亞.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E8%91%9B%E6%B4%9B%E8%8E%89%E4%BA%9E.png?alt=media&token=a1cbb363-a58e-494d-8fac-1dde6687dc65"
      },
      {
        "name": "泰莎.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E6%B3%B0%E8%8E%8E.png?alt=media&token=d9a54073-f8fc-4422-ad83-ec1b3173c5d6"
      },
      {
        "name": "艾莉絲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E8%89%BE%E8%8E%89%E7%B5%B2.png?alt=media&token=8d64647a-741b-4b65-b667-1cf8a3ef4daa"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E9%BB%91%E8%BE%9B%E8%92%82.png?alt=media&token=eff57738-ca70-4a63-b28c-6174e9d0b28e",
        "name": "黑辛蒂.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E7%B4%85%E5%A7%8A.png?alt=media&token=87398b6f-a176-451b-a12b-818b5ee1a730",
        "name": "紅姊.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E5%A6%B2%E4%BA%9E.png?alt=media&token=00c3a217-a6f3-438d-ac47-e6f7faf73348",
        "name": "妲亞.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E5%B0%BC%E5%A7%AC.png?alt=media&token=e688b4e6-194f-485d-84bf-9d8996d427fc",
        "name": "尼姬.png"
      },
      {
        "name": "勁爆女子監獄裡的雞.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%2F%E5%8B%81%E7%88%86%E5%A5%B3%E5%AD%90%E7%9B%A3%E7%8D%84%E8%A3%A1%E7%9A%84%E9%9B%9E.png?alt=media&token=8859edbb-17f2-44cc-9a8f-9ed99e9c95f3"
      }
    ],
    "quantity": 11
  },
  {
    "name": "外灘探秘",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%96%E7%81%98%E6%8E%A2%E7%A7%98%2F%E7%B4%84%E7%BF%B0%E5%B8%83%E5%85%8B.png?alt=media&token=be1b3df5-1104-4248-b598-45bd392bb0ea",
        "name": "約翰布克.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%96%E7%81%98%E6%8E%A2%E7%A7%98%2F%E8%8E%8E%E6%8B%89%20(1).png?alt=media&token=613cb7c1-89e4-4bb1-a87b-ca9a2b7d341d",
        "name": "莎拉 (1).png"
      },
      {
        "name": "阿傑.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%96%E7%81%98%E6%8E%A2%E7%A7%98%2F%E9%98%BF%E5%82%91.png?alt=media&token=b024f6b9-546d-4451-8e30-dffc6c7155c0"
      },
      {
        "name": "綺拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%96%E7%81%98%E6%8E%A2%E7%A7%98%2F%E7%B6%BA%E6%8B%89.png?alt=media&token=4d52a48e-f70e-49a2-8cff-681202c3aff5"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%96%E7%81%98%E6%8E%A2%E7%A7%98%2F%E6%B3%A2%E6%99%AE.png?alt=media&token=29e87a14-b3a0-44ba-b576-2ad8c5583eac",
        "name": "波普.png"
      }
    ],
    "quantity": 5
  },
  {
    "name": "太空迷航",
    "files": [
      {
        "name": "約翰.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E7%B4%84%E7%BF%B0.png?alt=media&token=6e6ebc98-962d-4857-bc45-caf0584b7af9"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E8%8E%AB%E7%90%B3.png?alt=media&token=c2364063-c75d-4cb4-a74c-ef60c3a3a58b",
        "name": "莫琳.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E8%8C%B1%E8%92%82.png?alt=media&token=5492f612-fc97-4333-8708-b7e74ebe4ac8",
        "name": "茱蒂.png"
      },
      {
        "name": "潘妮.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E6%BD%98%E5%A6%AE.png?alt=media&token=a1e88dc1-16fc-4e04-856d-59de7115e195"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E5%A8%81%E7%88%BE%20(1).png?alt=media&token=64eeba87-c919-4378-9f74-6242fbbac9a9",
        "name": "威爾 (1).png"
      },
      {
        "name": "唐威斯特.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E5%94%90%E5%A8%81%E6%96%AF%E7%89%B9.png?alt=media&token=8814dc94-f014-4cdc-a789-2e8b15471e49"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E5%8F%B2%E5%AF%86%E6%96%AF%E9%86%AB%E7%94%9F.png?alt=media&token=4f7947a5-c490-4886-8caf-d83177d0cd45",
        "name": "史密斯醫生.png"
      },
      {
        "name": "機器人 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E7%A9%BA%E8%BF%B7%E8%88%AA%2F%E6%A9%9F%E5%99%A8%E4%BA%BA%20(1).png?alt=media&token=8d505b54-b1b4-4756-b552-b90301c18c98"
      }
    ],
    "quantity": 10
  },
  {
    "name": "太陽召喚",
    "files": [
      {
        "name": "阿利娜.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E9%98%BF%E5%88%A9%E5%A8%9C.png?alt=media&token=1b44743a-f814-4e7e-8ae4-dce3c0597efb"
      },
      {
        "name": "凱利根將軍.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E5%87%B1%E5%88%A9%E6%A0%B9%E5%B0%87%E8%BB%8D.png?alt=media&token=2137463f-4689-4af6-a46b-2a38c1560bb5"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E7%91%AA%E7%88%BE.png?alt=media&token=4863bb9b-5f28-41c7-b1d5-465442116c72",
        "name": "瑪爾.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E5%87%B1%E8%8C%B2.png?alt=media&token=1c703cc5-0383-48f2-8de9-dc58ce3d943c",
        "name": "凱茲.png"
      },
      {
        "name": "賈斯柏.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E8%B3%88%E6%96%AF%E6%9F%8F.png?alt=media&token=623454fe-16f5-4722-9336-69878a0deaf8"
      },
      {
        "name": "伊奈許.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E4%BC%8A%E5%A5%88%E8%A8%B1.png?alt=media&token=11864493-7a94-4b70-a4e1-34b6dbe1cb1e"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E9%9B%84%E9%B9%BF.png?alt=media&token=7a4179ab-7094-4647-a9e0-bc107f26cde5",
        "name": "雄鹿.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E7%83%8F%E9%B4%89.png?alt=media&token=d29713ab-300e-4c88-9439-aaee658daa39",
        "name": "烏鴉.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A4%AA%E9%99%BD%E5%8F%AC%E5%96%9A%2F%E7%B1%B3%E7%BE%85.png?alt=media&token=4c69c72e-dbe6-4503-9b3a-f8d3a0ba3df1",
        "name": "米羅.png"
      }
    ],
    "quantity": 10
  },
  {
    "name": "奧術",
    "files": [
      {
        "name": "吉茵珂絲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E5%90%89%E8%8C%B5%E7%8F%82%E7%B5%B2.png?alt=media&token=8490847d-927a-4502-b1ae-477795dc7be5"
      },
      {
        "name": "菲艾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E8%8F%B2%E8%89%BE.png?alt=media&token=c9687b3d-3929-40de-a8d0-99a42656a682"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E5%87%B1%E7%89%B9%E7%90%B3.png?alt=media&token=939d5f47-e93e-4c0c-a97e-dd8d53fc963f",
        "name": "凱特琳.png"
      },
      {
        "name": "艾克.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E8%89%BE%E5%85%8B.png?alt=media&token=5e7d0a9d-c47d-413c-b59f-778723fc0392"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E7%B6%AD%E5%85%8B%E7%89%B9.png?alt=media&token=81abe84b-7538-42de-a45c-9fda659ff0e5",
        "name": "維克特.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E6%A2%85%E7%88%BE.png?alt=media&token=6952bdf9-0dfc-4db6-b85f-b9506012f643",
        "name": "梅爾.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E6%99%AE%E7%BE%85.png?alt=media&token=dc506a9e-32c3-406f-acef-935bb9333d52",
        "name": "普羅.png"
      },
      {
        "name": "杰西.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E6%9D%B0%E8%A5%BF.png?alt=media&token=180bd336-4499-4d6c-96c2-62ef71056e77"
      },
      {
        "name": "漢默丁格.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E6%BC%A2%E9%BB%98%E4%B8%81%E6%A0%BC.png?alt=media&token=42ecaa71-5260-4144-9204-86f8c2d4dad7"
      },
      {
        "name": "塞薇卡.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E5%A1%9E%E8%96%87%E5%8D%A1.png?alt=media&token=03363679-f467-4bb1-98b9-a9b01b7c9f41"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E5%B8%8C%E7%88%BE%E7%A7%91.png?alt=media&token=7481499f-5831-41d2-9523-f0177ffdd60a",
        "name": "希爾科.png"
      },
      {
        "name": "范德爾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%A5%A7%E8%A1%93%2F%E8%8C%83%E5%BE%B7%E7%88%BE.png?alt=media&token=c10510cc-9e4c-4b7b-9bc2-b7f671429502"
      }
    ],
    "quantity": 13
  },
  {
    "name": "寶貝老闆：重出江湖",
    "files": [
      {
        "name": "寶貝老闆.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86.png?alt=media&token=c193e72c-1e48-477b-8727-2b9205f67370"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E6%8F%90%E5%A7%86.png?alt=media&token=fca25803-228b-4a6a-a5db-a53cac3b984e",
        "name": "提姆.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E9%87%91%E5%AF%B6.png?alt=media&token=7d215b28-080c-4fe2-87c5-7540018d4bec",
        "name": "金寶.png"
      },
      {
        "name": "史黛西.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E5%8F%B2%E9%BB%9B%E8%A5%BF.png?alt=media&token=133afd85-3716-420e-9b6d-217485da6926"
      },
      {
        "name": "三胞胎的福瑞德.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E4%B8%89%E8%83%9E%E8%83%8E%E7%9A%84%E7%A6%8F%E7%91%9E%E5%BE%B7.png?alt=media&token=17a2ea71-f8f5-4817-8c89-a66a29273a49"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E4%B8%89%E8%83%9E%E8%83%8E%E7%9A%84%E8%89%BE%E7%91%9E%E5%85%8B.png?alt=media&token=10f6facc-b0e1-480b-b67e-1dd9294880db",
        "name": "三胞胎的艾瑞克.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E4%B8%89%E8%83%9E%E8%83%8E%E7%9A%84%E7%A6%8F%E7%91%9E%E5%85%8B.png?alt=media&token=fc7438ce-6105-4bad-be98-413ae15f8f72",
        "name": "三胞胎的福瑞克.png"
      },
      {
        "name": "貓咪.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E8%B2%93%E5%92%AA.png?alt=media&token=c88fbefb-674d-4fae-84b9-2091038326e5"
      },
      {
        "name": "超巨胖寶貝執行長.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E8%B6%85%E5%B7%A8%E8%83%96%E5%AF%B6%E8%B2%9D%E5%9F%B7%E8%A1%8C%E9%95%B7.png?alt=media&token=1c0675c4-e5d5-404c-995e-47b851638a3f"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E5%A5%B6%E5%98%B4.png?alt=media&token=95d5687e-a671-49d5-9c5b-a993ed6a49e5",
        "name": "奶嘴.png"
      },
      {
        "name": "餅乾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%AF%B6%E8%B2%9D%E8%80%81%E9%97%86%EF%BC%9A%E9%87%8D%E5%87%BA%E6%B1%9F%E6%B9%96%2F%E9%A4%85%E4%B9%BE.png?alt=media&token=b0854531-f8ea-4d36-9733-33be4b07b761"
      }
    ],
    "quantity": 12
  },
  {
    "name": "崩壞夢王國",
    "files": [
      {
        "name": "荳荳.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E8%8D%B3%E8%8D%B3.png?alt=media&token=d5a8e190-61b9-4be8-8852-59784e6168f4"
      },
      {
        "name": "路西.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E8%B7%AF%E8%A5%BF.png?alt=media&token=93c0e4ac-095a-47b9-9d52-79d979708de4"
      },
      {
        "name": "阿福.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E9%98%BF%E7%A6%8F.png?alt=media&token=aba7b9fa-81d0-4066-a6fe-94e49aa5bf45"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E7%B4%A2%E5%8F%A4.png?alt=media&token=1ee627ef-fd92-4625-b159-16ad369bc39d",
        "name": "索古.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E7%83%8F%E5%A8%9C.png?alt=media&token=629e967e-1b12-4423-8fc2-8459130e14a2",
        "name": "烏娜.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E5%B4%A9%E5%A3%9E%E5%A4%A2%E7%8E%8B%E5%9C%8B%2F%E5%8A%8A%E5%AD%90%E6%89%8B%E5%8F%B2%E4%B8%B9.png?alt=media&token=56eefab7-5ba8-44b9-83f9-38945f4afe1f",
        "name": "劊子手史丹.png"
      }
    ],
    "quantity": 6
  },
  {
    "name": "性愛自修室",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E6%AD%90%E5%B8%9D%E6%96%AF.png?alt=media&token=ae0f8d2c-2991-4a4e-936a-fd68f8e851c7",
        "name": "歐帝斯.png"
      },
      {
        "name": "梅芙.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E6%A2%85%E8%8A%99.png?alt=media&token=609b18c2-68f0-48c1-9caf-dc80d406d53b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E7%8F%8D.png?alt=media&token=66e940d8-f4ab-466f-ba2d-c178287ff463",
        "name": "珍.png"
      },
      {
        "name": "艾瑞克.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E8%89%BE%E7%91%9E%E5%85%8B.png?alt=media&token=da6ec6ea-4c8a-47d0-a675-e701863700bb"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E8%89%BE%E5%92%AA.png?alt=media&token=9081ed46-fbbe-4f78-a0ed-cfea236d9be3",
        "name": "艾咪.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E4%BA%9E%E7%95%B6.png?alt=media&token=9d8fc814-2fba-4f1a-b46c-87ad9776ade1",
        "name": "亞當.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E5%82%91%E5%85%8B%E6%A3%AE.png?alt=media&token=73012af5-0160-4c7b-ac49-88a946e854a0",
        "name": "傑克森.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E6%AD%90%E6%8B%89.png?alt=media&token=8ad6625f-c696-4fee-8d80-abef0b2974f5",
        "name": "歐拉.png"
      },
      {
        "name": "莉莉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E8%8E%89%E8%8E%89.png?alt=media&token=10fd63c1-1a97-41ea-9a1e-831cdbaf1a0c"
      },
      {
        "name": "薇.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E8%96%87.png?alt=media&token=2e77bed5-f24a-411f-85b6-40a333caba53"
      },
      {
        "name": "以撒.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E4%BB%A5%E6%92%92.png?alt=media&token=cf0f1433-b4f7-4daa-b7d8-08d29fc2944c"
      },
      {
        "name": "路比.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E8%B7%AF%E6%AF%94.png?alt=media&token=d6d7ddfd-7463-4575-b850-61b33437a77b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%A7%E6%84%9B%E8%87%AA%E4%BF%AE%E5%AE%A4%2F%E6%8B%89%E8%BE%9B.png?alt=media&token=b1a75581-14b1-46e5-9e56-8e585c210ed0",
        "name": "拉辛.png"
      }
    ],
    "quantity": 13
  },
  {
    "name": "怪奇物語",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E4%BC%8A%E8%90%8A%E9%9B%AF.png?alt=media&token=27f9f7ee-59bf-425c-8a1f-049d9b637f05",
        "name": "伊萊雯.png"
      },
      {
        "name": "麥克.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E9%BA%A5%E5%85%8B.png?alt=media&token=3c29e1b6-4f8a-43e4-8c85-dce8250d9d0d"
      },
      {
        "name": "達斯汀.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E9%81%94%E6%96%AF%E6%B1%80.png?alt=media&token=646f1416-8522-48bd-8b3c-a8ab4c9d21e9"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E5%A8%81%E7%88%BE.png?alt=media&token=ff2bf8eb-610c-4291-a9ac-b4f22ef8ed50",
        "name": "威爾.png"
      },
      {
        "name": "盧卡斯.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E7%9B%A7%E5%8D%A1%E6%96%AF.png?alt=media&token=55cd2008-6e96-4c25-9235-ec7eae655052"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E9%BA%A5%E6%96%AF.png?alt=media&token=18bef0b7-02f8-4ee8-a17c-6d756742aca0",
        "name": "麥斯.png"
      },
      {
        "name": "比利.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E6%AF%94%E5%88%A9.png?alt=media&token=555ff03e-566b-4461-b288-c8dd67d8e0ab"
      },
      {
        "name": "史帝夫.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E5%8F%B2%E5%B8%9D%E5%A4%AB.png?alt=media&token=eb7deea5-55cd-420f-9c7b-bc6fddc0bdd1"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E8%98%BF%E8%90%8D.png?alt=media&token=29ab5c26-e88b-4861-a720-dacc1169f7bc",
        "name": "蘿萍.png"
      },
      {
        "name": "南西.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E5%8D%97%E8%A5%BF.png?alt=media&token=8dbf289c-f36d-402d-8a46-4253189de881"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E5%BC%B7%E7%B4%8D%E6%A3%AE.png?alt=media&token=51008f00-d52c-4398-b081-94e3523cb6b0",
        "name": "強納森.png"
      },
      {
        "name": "愛瑞卡.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E6%84%9B%E7%91%9E%E5%8D%A1.png?alt=media&token=f561fcc6-54ae-4b24-81b7-88d3d344a963"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%80%AA%E5%A5%87%E7%89%A9%E8%AA%9E%2F%E5%93%88%E6%99%AE.png?alt=media&token=64d8aab4-c951-4146-810a-c39aea66054f",
        "name": "哈普.png"
      }
    ],
    "quantity": 13
  },
  {
    "name": "我們的星球",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E8%80%81%E8%99%8E.png?alt=media&token=050af63a-4c5a-4ad5-b0ca-7268221082d9",
        "name": "老虎.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%8A%80%E7%89%9B.png?alt=media&token=efc203e8-e959-41d5-bece-2f9c40a3f348",
        "name": "犀牛.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E9%9D%92%E8%9B%99.png?alt=media&token=461c7cff-712f-468f-ab32-9c5176ac16f1",
        "name": "青蛙.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%8B%90%E7%8B%B8.png?alt=media&token=4a389718-3ffc-4630-829b-99d06de559d4",
        "name": "狐狸.png"
      },
      {
        "name": "企鵝.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E4%BC%81%E9%B5%9D.png?alt=media&token=b5310a82-2018-468c-9b22-58ddcf043959"
      },
      {
        "name": "美洲豹.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%BE%8E%E6%B4%B2%E8%B1%B9.png?alt=media&token=25299bda-30cc-48ee-b0f6-f534bf1dc80b"
      },
      {
        "name": "烏龜.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%83%8F%E9%BE%9C.png?alt=media&token=ad813b54-4485-4918-9773-38b74e4054cd"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%8C%B4%E5%AD%90.png?alt=media&token=68b2ca73-7cc2-4512-94bc-07451811652e",
        "name": "猴子.png"
      },
      {
        "name": "水豚.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E6%B0%B4%E8%B1%9A.png?alt=media&token=66ffbd57-29b5-42e5-b50d-a4e3a8c87e35"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E8%9D%B4%E8%9D%B6.png?alt=media&token=d126ddb4-8731-47b0-8035-7a3e165302da",
        "name": "蝴蝶.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E5%8C%97%E6%A5%B5%E7%86%8A.png?alt=media&token=2420c748-5681-4151-b251-69f51f41eedd",
        "name": "北極熊.png"
      },
      {
        "name": "鯊魚.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E9%AF%8A%E9%AD%9A.png?alt=media&token=ae26942d-138b-4865-863c-8a6598c83fc7"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%80%91%E7%9A%84%E6%98%9F%E7%90%83%2F%E7%8C%A9%E7%8C%A9.png?alt=media&token=f4545d28-0854-4b31-a966-e24d4a6eae19",
        "name": "猩猩.png"
      }
    ],
    "quantity": 13
  },
  {
    "name": "我和紐約超級皇后",
    "files": [
      {
        "name": "阿里 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E9%98%BF%E9%87%8C%20(1).png?alt=media&token=4a56fc1a-a6c2-4bae-bc76-60ad7027f4e4"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E5%AE%89%E7%90%AA.png?alt=media&token=94b0763a-ba74-4dcf-92ec-b0504d0715b5",
        "name": "安琪.png"
      },
      {
        "name": "碧雅.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E7%A2%A7%E9%9B%85.png?alt=media&token=2453b581-90ec-42e0-a878-5fdd8c77114e"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E9%87%91%E5%A1%94.png?alt=media&token=be56ae26-f544-4e30-8ac8-f07beae39966",
        "name": "金塔.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E5%B8%95%E8%92%82.png?alt=media&token=39f0e90d-08c2-4daa-9f51-e53df6c53cda",
        "name": "帕蒂.png"
      },
      {
        "name": "蜜雅.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E8%9C%9C%E9%9B%85.png?alt=media&token=3bc13fee-5fe4-4704-9317-b8e8cc62e557"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E4%BC%8A%E5%A8%83%20(1).png?alt=media&token=36f7c598-b11e-4669-a131-7883cd3f6c40",
        "name": "伊娃 (1).png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%88%91%E5%92%8C%E7%B4%90%E7%B4%84%E8%B6%85%E7%B4%9A%E7%9A%87%E5%90%8E%2F%E9%98%BF%E9%87%8C%20(1).png?alt=media&token=cf83bb52-5695-48cd-99e7-d49715fc8394",
        "name": "阿里 (1).png"
      }
    ],
    "quantity": 8
  },
  {
    "name": "打不倒的金咪",
    "files": [
      {
        "name": "金咪.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E9%87%91%E5%92%AA.png?alt=media&token=86b1389e-af6b-4f50-968d-86f60d51cf5a"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E6%B3%B0%E5%9D%A6%E6%96%AF.png?alt=media&token=2e061e3f-c9b2-4c9f-9321-12023555a9ca",
        "name": "泰坦斯.png"
      },
      {
        "name": "傑奎琳.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E5%82%91%E5%A5%8E%E7%90%B3.png?alt=media&token=87d8f5bf-4804-4849-bb68-867fb200976e"
      },
      {
        "name": "莉莉恩.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E8%8E%89%E8%8E%89%E6%81%A9.png?alt=media&token=0ed4ff94-f02f-432a-85bf-f3f1a497a04d"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E6%A9%9F%E5%99%A8%E4%BA%BA.png?alt=media&token=8de7801a-b649-4085-9fdf-68b46cc47b60",
        "name": "機器人.png"
      },
      {
        "name": "葡萄酒杯.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%89%93%E4%B8%8D%E5%80%92%E7%9A%84%E9%87%91%E5%92%AA%2F%E8%91%A1%E8%90%84%E9%85%92%E6%9D%AF.png?alt=media&token=305a28b6-889e-4a98-ad79-6af9df7823f1"
      }
    ],
    "quantity": 6
  },
  {
    "name": "星際牛仔",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E5%8F%B2%E6%B4%BE%E5%85%8B.png?alt=media&token=9d18b19a-e867-4411-87a0-77284185520b",
        "name": "史派克.png"
      },
      {
        "name": "傑特.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E5%82%91%E7%89%B9.png?alt=media&token=f6f00425-42aa-4ba5-90b5-b258308f1925"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E8%8F%B2.png?alt=media&token=05fa6db1-e39f-4b60-8d29-11af2f8655ed",
        "name": "菲.png"
      },
      {
        "name": "愛因.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E6%84%9B%E5%9B%A0.png?alt=media&token=1fd2d40b-e5b2-4582-acee-9ebcbe5f572e"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E5%A8%81%E5%A4%8F%E6%96%AF.png?alt=media&token=47989db2-80fc-4bda-9236-b70c27794dc9",
        "name": "威夏斯.png"
      },
      {
        "name": "茱莉亞.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%98%9F%E9%9A%9B%E7%89%9B%E4%BB%94%2F%E8%8C%B1%E8%8E%89%E4%BA%9E.png?alt=media&token=f9d11fca-fbe0-4615-9394-e72ae2bb910b"
      }
    ],
    "quantity": 6
  },
  {
    "name": "柏捷頓家族：名門韻事",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E5%AE%89%E6%9D%B1%E5%B0%BC%E6%9F%8F%E6%8D%B7%E9%A0%93.png?alt=media&token=cadef41b-0c3e-4472-905e-d4f460264aeb",
        "name": "安東尼柏捷頓.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E5%87%B1%E8%92%82%C2%B7%E8%8E%8E%E7%91%AA.png?alt=media&token=2f130e05-e29f-4c53-a205-6d2a227ddc36",
        "name": "凱蒂·莎瑪.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E8%89%BE%E6%BA%AB%E5%A8%9C%C2%B7%E8%8E%8E%E7%91%AA.png?alt=media&token=7cfe3476-a106-4737-8b18-6169a135fc82",
        "name": "艾溫娜·莎瑪.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E6%BD%98%E5%A6%AE%E6%B4%9B%E7%A2%A7%E8%B2%BB%E7%91%9F%E6%9E%97%E9%A0%93.png?alt=media&token=d63e5aa7-d102-435c-98dd-750cc0e77a30",
        "name": "潘妮洛碧費瑟林頓.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E8%89%BE%E6%B4%9B%E4%BC%8A%E7%B5%B2%E6%9F%8F%E6%8D%B7%E9%A0%93.png?alt=media&token=6b2a3474-d51f-4daf-8c41-70688844516b",
        "name": "艾洛伊絲柏捷頓.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E9%81%94%E8%8A%99%E5%A6%AE%E6%9F%8F%E6%8D%B7%E9%A0%93.png?alt=media&token=03570280-7238-477e-80e2-cf354f5b88b4",
        "name": "達芙妮柏捷頓.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E8%B3%BD%E9%96%80%E8%B2%9D%E7%91%9F.png?alt=media&token=4c5242a3-7023-490f-9ab3-381166c29625",
        "name": "賽門貝瑟.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E5%A4%8F%E6%B4%9B%E7%89%B9%E5%A5%B3%E7%8E%8B.png?alt=media&token=1ddda5fa-4a5a-45de-b786-a6e85d206b8c",
        "name": "夏洛特女王.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E4%B8%B9%E6%9F%8F%E8%8E%89%E5%A4%AB%E4%BA%BA.png?alt=media&token=0c9690d8-3509-4a15-b387-a802efeebd37",
        "name": "丹柏莉夫人.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%A4%AB%E4%BA%BA.png?alt=media&token=bb345f1b-1867-4fb2-81de-4bd7a293d5a4",
        "name": "柏捷頓夫人.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E7%8F%AD%E5%B0%BC%E8%BF%AA%E7%89%B9%E6%9F%8F%E6%8D%B7%E9%A0%93.png?alt=media&token=de8df83b-426e-47fb-94b4-5375722146e7",
        "name": "班尼迪特柏捷頓.png"
      },
      {
        "name": "柯林柏捷頓.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E6%9F%AF%E6%9E%97%E6%9F%8F%E6%8D%B7%E9%A0%93.png?alt=media&token=9a372ffb-1f40-4be0-a549-66d376d2a1db"
      },
      {
        "name": "費瑟林頓夫人.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%9F%8F%E6%8D%B7%E9%A0%93%E5%AE%B6%E6%97%8F%EF%BC%9A%E5%90%8D%E9%96%80%E9%9F%BB%E4%BA%8B%2F%E8%B2%BB%E7%91%9F%E6%9E%97%E9%A0%93%E5%A4%AB%E4%BA%BA.png?alt=media&token=688dab8e-6c31-4102-8381-155f93d92aa8"
      }
    ],
    "quantity": 13
  },
  {
    "name": "泡泡",
    "files": [
      {
        "name": "泡泡.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E6%B3%A1%E6%B3%A1.png?alt=media&token=ce4fc93a-6a8d-4ab8-b3ce-79e40fd26e2f"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E7%9C%9F%E7%90%B4.png?alt=media&token=659d1fba-421a-4e6c-8a7d-585f26d572e4",
        "name": "真琴.png"
      },
      {
        "name": "慎.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E6%85%8E.png?alt=media&token=080a2c4c-d6cd-4aa1-837e-bb4bc9e02bc3"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E5%85%94.png?alt=media&token=c83a13c8-ed98-41fb-99ed-5d062aa3a137",
        "name": "兔.png"
      },
      {
        "name": "磯崎.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E7%A3%AF%E5%B4%8E.png?alt=media&token=0daff4ca-bb59-40c1-95f6-32e186b07743"
      },
      {
        "name": "大澤.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E5%A4%A7%E6%BE%A4.png?alt=media&token=283f7d33-c7bc-4e86-a96e-51c70c103662"
      },
      {
        "name": "電氣忍者.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E9%9B%BB%E6%B0%A3%E5%BF%8D%E8%80%85.png?alt=media&token=3ef19b74-a8aa-4fcd-b6ca-27705232c0f0"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E9%80%81%E8%91%AC%E4%BA%BA.png?alt=media&token=d3fc13b5-8c36-43d0-b2b1-91566d1a937a",
        "name": "送葬人.png"
      },
      {
        "name": "關東狂怒龍蝦.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E9%97%9C%E6%9D%B1%E7%8B%82%E6%80%92%E9%BE%8D%E8%9D%A6.png?alt=media&token=0334d47d-8762-423c-9263-0885c924cbb5"
      },
      {
        "name": "方格旗.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A1%E6%B3%A1%2F%E6%96%B9%E6%A0%BC%E6%97%97.png?alt=media&token=944a5d86-3556-4039-a414-811172f43b12"
      }
    ],
    "quantity": 11
  },
  {
    "name": "波特萊爾的冒險",
    "files": [
      {
        "name": "歐拉夫伯爵.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E6%AD%90%E6%8B%89%E5%A4%AB%E4%BC%AF%E7%88%B5.png?alt=media&token=27ce713f-48bb-46b7-a8d7-60a42a9d7f6b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E7%B4%AB%E5%85%92.png?alt=media&token=76d79168-b83a-4054-a0ac-560953c31dee",
        "name": "紫兒.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E5%85%8B%E5%8B%9E%E6%96%AF%20(1).png?alt=media&token=0de314a6-d16e-4623-b259-1c3b1ea252bd",
        "name": "克勞斯 (1).png"
      },
      {
        "name": "桑妮.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E6%A1%91%E5%A6%AE.png?alt=media&token=de48792f-edcf-496d-8607-2bbc6b36a1ad"
      },
      {
        "name": "尼蒙利斯.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E5%B0%BC%E8%92%99%E5%88%A9%E6%96%AF.png?alt=media&token=8d80ddc2-e7d8-44ca-8681-153e92624b98"
      },
      {
        "name": "艾絲梅史瓜樂.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E8%89%BE%E7%B5%B2%E6%A2%85%E5%8F%B2%E7%93%9C%E6%A8%82.png?alt=media&token=32de24bc-2c1f-4ed1-a0a0-f67f390e60f5"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E5%8D%A1%E9%BA%A5%E9%BA%97%E5%A1%94%E5%8F%B2%E6%B4%BE%E8%8C%B2.png?alt=media&token=7c0ee2f6-a539-42ff-a22f-e0aa3b560775",
        "name": "卡麥麗塔史派茲.png"
      },
      {
        "name": "波先生.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E6%B3%A2%E5%85%88%E7%94%9F.png?alt=media&token=721c0f1e-f376-4180-a569-53e51212e63b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E6%B3%A2%E7%89%B9%E8%90%8A%E7%88%BE%E7%9A%84%E5%86%92%E9%9A%AA%2F%E7%AC%A6%E8%99%9F%20(1).png?alt=media&token=3f630940-a5dd-4f09-814d-685831059922",
        "name": "符號 (1).png"
      }
    ],
    "quantity": 10
  },
  {
    "name": "獵魔士",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%82%91%E6%B4%9B%E7%89%B9.png?alt=media&token=d0170b27-df40-4be7-bfe8-c96782e6f2b3",
        "name": "傑洛特.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%A5%87%E8%8E%89.png?alt=media&token=ffbe0ddc-760d-417e-88bf-0b498e872444",
        "name": "奇莉.png"
      },
      {
        "name": "葉妮芙.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E8%91%89%E5%A6%AE%E8%8A%99.png?alt=media&token=4c40dddd-6e49-4e19-9acb-8474f67a8d2c"
      },
      {
        "name": "亞斯克爾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E4%BA%9E%E6%96%AF%E5%85%8B%E7%88%BE.png?alt=media&token=46364387-0027-486f-b20c-38c8cb4a7abc"
      },
      {
        "name": "小魚兒.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%B0%8F%E9%AD%9A%E5%85%92.png?alt=media&token=5732d823-1e44-4778-9bbd-f271721cd140"
      },
      {
        "name": "開心的劍.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E9%96%8B%E5%BF%83%E7%9A%84%E5%8A%8D.png?alt=media&token=e0dc8b7e-e062-4ba7-b250-bc5e03fb5f21"
      },
      {
        "name": "奇奇魔拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%A5%87%E5%A5%87%E9%AD%94%E6%8B%89.png?alt=media&token=ce33f59b-3b3e-4496-b238-885e1342f38d"
      },
      {
        "name": "林妖.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E6%9E%97%E5%A6%96.png?alt=media&token=ab6405ea-d1e7-47b2-a089-1f1eb95dab6d"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%B0%BC%E7%B6%AD%E5%80%AB.png?alt=media&token=39496602-c986-4a57-ac76-5ea4aeade754",
        "name": "尼維倫.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%E7%9A%84%E6%A8%99%E8%AA%8C.png?alt=media&token=c72ebc9a-cc3a-4425-823a-4d45a5d8d569",
        "name": "獵魔士的標誌.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8D%B5%E9%AD%94%E5%A3%AB%2F%E5%85%A9%E6%8A%8A%E5%8A%8D.png?alt=media&token=fb451956-6f07-4941-bc96-1715a1d21f0c",
        "name": "兩把劍.png"
      }
    ],
    "quantity": 12
  },
  {
    "name": "王冠",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E5%85%8B%E8%90%8A%E5%85%92%E4%BD%9B%E4%BC%8A%E9%A3%BE%E6%BC%94%E7%9A%84%E4%BC%8A%E8%8E%89%E8%8E%8E%E7%99%BD%E5%A5%B3%E7%8E%8B.png?alt=media&token=50a763ef-d221-454c-a960-857866808664",
        "name": "克萊兒佛伊飾演的伊莉莎白女王.png"
      },
      {
        "name": "奧莉薇亞柯爾曼飾演的伊莉莎白女王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E5%A5%A7%E8%8E%89%E8%96%87%E4%BA%9E%E6%9F%AF%E7%88%BE%E6%9B%BC%E9%A3%BE%E6%BC%94%E7%9A%84%E4%BC%8A%E8%8E%89%E8%8E%8E%E7%99%BD%E5%A5%B3%E7%8E%8B.png?alt=media&token=014df014-0782-4574-bbbf-50227ead03fc"
      },
      {
        "name": "馬特史密斯飾演的菲利普親王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E9%A6%AC%E7%89%B9%E5%8F%B2%E5%AF%86%E6%96%AF%E9%A3%BE%E6%BC%94%E7%9A%84%E8%8F%B2%E5%88%A9%E6%99%AE%E8%A6%AA%E7%8E%8B.png?alt=media&token=b7e053a4-6ff1-452e-b6e3-fbd58329cc02"
      },
      {
        "name": "托比亞曼齊司飾演的菲利普親王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E6%89%98%E6%AF%94%E4%BA%9E%E6%9B%BC%E9%BD%8A%E5%8F%B8%E9%A3%BE%E6%BC%94%E7%9A%84%E8%8F%B2%E5%88%A9%E6%99%AE%E8%A6%AA%E7%8E%8B.png?alt=media&token=70bfcba4-9aff-4eb7-a7ea-aa29c01821ea"
      },
      {
        "name": "凡妮莎·柯比飾演的瑪格麗特公主.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E5%87%A1%E5%A6%AE%E8%8E%8E%C2%B7%E6%9F%AF%E6%AF%94%E9%A3%BE%E6%BC%94%E7%9A%84%E7%91%AA%E6%A0%BC%E9%BA%97%E7%89%B9%E5%85%AC%E4%B8%BB.png?alt=media&token=947cad65-531e-43d2-bb11-c77fb23245b0"
      },
      {
        "name": "海倫娜寶漢卡特飾演的瑪格麗特公主.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E6%B5%B7%E5%80%AB%E5%A8%9C%E5%AF%B6%E6%BC%A2%E5%8D%A1%E7%89%B9%E9%A3%BE%E6%BC%94%E7%9A%84%E7%91%AA%E6%A0%BC%E9%BA%97%E7%89%B9%E5%85%AC%E4%B8%BB.png?alt=media&token=44db47b7-9f26-4db5-810a-60097786a461"
      },
      {
        "name": "馬修古迪飾演的東尼阿姆斯壯瓊斯.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E9%A6%AC%E4%BF%AE%E5%8F%A4%E8%BF%AA%E9%A3%BE%E6%BC%94%E7%9A%84%E6%9D%B1%E5%B0%BC%E9%98%BF%E5%A7%86%E6%96%AF%E5%A3%AF%E7%93%8A%E6%96%AF.png?alt=media&token=e005616b-de7e-41f1-8fcb-5a9461ff88e7"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%8E%8B%E5%86%A0%2F%E7%8F%AD%E4%B8%B9%E5%B0%BC%E7%88%BE%E6%96%AF%E9%A3%BE%E6%BC%94%E7%9A%84%E6%9D%B1%E5%B0%BC%E9%98%BF%E5%A7%86%E6%96%AF%E5%A3%AF%E7%93%8A%E6%96%AF.png?alt=media&token=ae06ae99-d2d0-4928-a1b8-a15c8ad5799b",
        "name": "班丹尼爾斯飾演的東尼阿姆斯壯瓊斯.png"
      }
    ],
    "quantity": 9
  },
  {
    "name": "瑪雅與三劍客",
    "files": [
      {
        "name": "瑪雅.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E7%91%AA%E9%9B%85.png?alt=media&token=22075d94-accf-4b7c-a6da-061237a31f94"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E7%91%9E%E5%8F%AF.png?alt=media&token=b580980b-ad4d-4e51-a648-08735c896611",
        "name": "瑞可.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E5%A5%87%E7%BE%8E.png?alt=media&token=90096d42-8ea8-4768-af3e-c6891fa23cc2",
        "name": "奇美.png"
      },
      {
        "name": "比丘.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E6%AF%94%E4%B8%98.png?alt=media&token=1aa76562-c810-49fa-b389-83d599fa62d4"
      },
      {
        "name": "迦霸.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E8%BF%A6%E9%9C%B8.png?alt=media&token=7af6c944-f779-4cb2-8120-b1c496ad0ea0"
      },
      {
        "name": "泰卡大王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E6%B3%B0%E5%8D%A1%E5%A4%A7%E7%8E%8B.png?alt=media&token=ecf76560-f83d-405c-8c74-74c20bcdcd23"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%91%AA%E9%9B%85%E8%88%87%E4%B8%89%E5%8A%8D%E5%AE%A2%2F%E8%96%A9%E8%8C%B2.png?alt=media&token=463c055d-24b4-4e20-a702-daf5380c61c3",
        "name": "薩茲.png"
      }
    ],
    "quantity": 8
  },
  {
    "name": "眼鏡蛇道館",
    "files": [
      {
        "name": "丹尼爾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E4%B8%B9%E5%B0%BC%E7%88%BE.png?alt=media&token=02ea529d-bed3-4597-a7a2-d26e8350e9ee"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E5%BC%B7%E5%B0%BC.png?alt=media&token=be4de888-4f17-488d-9e2e-95ab592fb359",
        "name": "強尼.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E5%85%8B%E9%87%8C%E6%96%AF.png?alt=media&token=4062a4aa-0fbe-4891-8f67-f2f05cdcaa75",
        "name": "克里斯.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E9%A6%AC%E5%90%89%E7%88%BE.png?alt=media&token=900f2a31-df17-4d9e-8f8e-36831f3a4c51",
        "name": "馬吉爾.png"
      },
      {
        "name": "羅比.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E7%BE%85%E6%AF%94.png?alt=media&token=c5830083-61b0-45ce-a130-d5ad39d9ef99"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E8%8E%8E%E6%9B%BC%E7%8F%8A.png?alt=media&token=5235e5ab-7067-4776-a766-900765c68ecc",
        "name": "莎曼珊.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E6%9C%B5%E5%88%A9.png?alt=media&token=18e88c53-0bc7-4b1b-b247-a2f82c0b3c8f",
        "name": "朵利.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E8%80%81%E9%B7%B9.png?alt=media&token=5f78a3d7-f99b-483b-b6d9-9480fb0bc06c",
        "name": "老鷹.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E8%BF%AA%E7%B1%B3%E5%B4%94.png?alt=media&token=895a877e-c5a8-40cc-b76f-f29ee1668a9a",
        "name": "迪米崔.png"
      },
      {
        "name": "泰瑞·希維爾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E6%B3%B0%E7%91%9E%C2%B7%E5%B8%8C%E7%B6%AD%E7%88%BE.png?alt=media&token=41316603-c270-4ef2-a459-c8ae00ca2282"
      },
      {
        "name": "亞曼達.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E4%BA%9E%E6%9B%BC%E9%81%94.png?alt=media&token=36bee804-1d55-4c99-bbf1-a51ce2cfef4b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E5%8D%A1%E9%96%80.png?alt=media&token=84be961c-0d13-4831-92f3-4f3f792dbce5",
        "name": "卡門.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%9C%BC%E9%8F%A1%E8%9B%87%E9%81%93%E9%A4%A8%2F%E5%AE%AE%E5%9F%8E%E5%85%88%E7%94%9F.png?alt=media&token=0a242690-0276-4147-93f6-79fa3dab7911",
        "name": "宮城先生.png"
      }
    ],
    "quantity": 13
  },
  {
    "name": "紙房子",
    "files": [
      {
        "name": "面具.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E9%9D%A2%E5%85%B7.png?alt=media&token=2fbedd2c-7fd9-44f4-9144-6edd9c052128"
      },
      {
        "name": "教授.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E6%95%99%E6%8E%88.png?alt=media&token=af8d573c-9394-4e2c-b7ad-b0719551afb9"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E6%9D%B1%E4%BA%AC.png?alt=media&token=c57ed8a8-92cb-4410-b20f-0042dbb2a3cd",
        "name": "東京.png"
      },
      {
        "name": "奈洛比.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E5%A5%88%E6%B4%9B%E6%AF%94.png?alt=media&token=567d48c3-8a15-4162-94e3-ec16c1d3314d"
      },
      {
        "name": "席耶拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E5%B8%AD%E8%80%B6%E6%8B%89.png?alt=media&token=48ff991d-b2fd-4e46-be58-bf5722fa777b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E9%87%8C%E7%B4%84.png?alt=media&token=dc847a08-d481-4580-a375-3d5db93eae59",
        "name": "里約.png"
      },
      {
        "name": "丹佛.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E4%B8%B9%E4%BD%9B.png?alt=media&token=9a51a8ca-1bac-4ff7-9704-910d8a7392d9"
      },
      {
        "name": "里斯本.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E9%87%8C%E6%96%AF%E6%9C%AC.png?alt=media&token=a76184dd-b89d-437a-a301-7da64801de30"
      },
      {
        "name": "柏林.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E6%9F%8F%E6%9E%97.png?alt=media&token=1712fb08-a4e0-47d4-80fb-b45da358491b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B4%99%E6%88%BF%E5%AD%90%2F%E5%B7%B4%E5%8B%92%E8%8E%AB%E7%9C%81.png?alt=media&token=ef37f84e-3280-478f-8137-b8aacdec04d9",
        "name": "巴勒莫省.png"
      }
    ],
    "quantity": 11
  },
  {
    "name": "維沃的精彩生活",
    "files": [
      {
        "name": "維沃.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E7%B6%AD%E6%B2%83.png?alt=media&token=bb8bba38-fb4a-4448-86e7-2311ae299e96"
      },
      {
        "name": "嘉比.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E5%98%89%E6%AF%94.png?alt=media&token=f4df2b9b-0e93-4657-befa-ae19d5b1874c"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E5%AE%89%E5%BE%B7%E7%83%88.png?alt=media&token=7c6b6322-b8fa-42bd-b37d-7039ccd97bfe",
        "name": "安德烈.png"
      },
      {
        "name": "蘿莎.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E8%98%BF%E8%8E%8E.png?alt=media&token=72c7898e-204e-4563-81ff-a72ca5479939"
      },
      {
        "name": "瑪塔.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E7%91%AA%E5%A1%94.png?alt=media&token=96d897d2-4236-4760-8565-b9f308f99620"
      },
      {
        "name": "貝琪.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E8%B2%9D%E7%90%AA.png?alt=media&token=4312f2e2-36a2-4877-b110-ed4cefddd260"
      },
      {
        "name": "莎拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E8%8E%8E%E6%8B%89.png?alt=media&token=75ac2426-85a4-4779-84f0-3da9ab3401a2"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E4%BC%8A%E5%A8%83.png?alt=media&token=5f2f61f9-2335-42c6-a86c-862ff9cebc1a",
        "name": "伊娃.png"
      },
      {
        "name": "丹卡里諾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E4%B8%B9%E5%8D%A1%E9%87%8C%E8%AB%BE.png?alt=media&token=30e206fa-8310-4ce7-a5b0-a9819701d65b"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%AD%E6%B2%83%E7%9A%84%E7%B2%BE%E5%BD%A9%E7%94%9F%E6%B4%BB%2F%E7%9B%A7%E5%A1%94%E5%A4%9A.png?alt=media&token=957e3c3f-c10f-4474-bec6-33037ab67576",
        "name": "盧塔多.png"
      }
    ],
    "quantity": 11
  },
  {
    "name": "菁英殺機",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%8D%A1%E8%8F%88.png?alt=media&token=270495a2-aa4e-4b08-a252-056eba55ab32",
        "name": "卡菈.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%B1%B1%E8%AC%AC.png?alt=media&token=45cddfb4-6457-4e1d-ab56-891edc040bf0",
        "name": "山謬.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%B0%8F%E9%9C%B2.png?alt=media&token=25b113b1-3901-4016-a682-9669893e50e7",
        "name": "小露.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%8F%A4%E8%8C%B2%E6%9B%BC.png?alt=media&token=c71231be-3fe7-4212-afb9-1a7aa012bcf1",
        "name": "古茲曼.png"
      },
      {
        "name": "娜迪雅.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%A8%9C%E8%BF%AA%E9%9B%85.png?alt=media&token=3bf810aa-c579-4ebb-a2e5-ba3b80cc6664"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E6%B3%A2%E6%B4%9B.png?alt=media&token=51f33d4e-b395-4365-ac4b-318918f53e8e",
        "name": "波洛.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E9%BA%97%E8%B2%9D%E5%8D%A1.png?alt=media&token=afefed2b-3bc4-4e07-b407-101cf831865d",
        "name": "麗貝卡.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%AE%89%E5%BE%B7.png?alt=media&token=fc5b6bc2-46c7-4ad6-894e-9b13425933aa",
        "name": "安德.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E5%8D%A1%E8%80%B6%E5%A1%94%E5%A8%9C.png?alt=media&token=ac7abfdc-ece8-4d1a-8a5f-1d0906b4ad81",
        "name": "卡耶塔娜.png"
      },
      {
        "name": "瓦勒里奧.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E7%93%A6%E5%8B%92%E9%87%8C%E5%A5%A7.png?alt=media&token=2187f0ab-44a1-4e7e-86a8-641d1b4d59bb"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%8F%81%E8%8B%B1%E6%AE%BA%E6%A9%9F%2F%E6%AD%90%E7%91%AA.png?alt=media&token=40453107-8bc7-406d-a936-226072adbb62",
        "name": "歐瑪.png"
      }
    ],
    "quantity": 12
  },
  {
    "name": "衝吧烈子",
    "files": [
      {
        "name": "死亡金屬烈子.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E6%AD%BB%E4%BA%A1%E9%87%91%E5%B1%AC%E7%83%88%E5%AD%90.png?alt=media&token=8b197c6a-49e4-4907-b496-41d5b11c77dc"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E7%83%88%E5%AD%90.png?alt=media&token=e4f221fc-f326-48b9-90bc-1b45d0bf1aa3",
        "name": "烈子.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E7%81%B0%E7%94%B0.png?alt=media&token=f0b39d00-ca7e-4c87-86f4-c08202a9d2a4",
        "name": "灰田.png"
      },
      {
        "name": "笛音子.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E7%AC%9B%E9%9F%B3%E5%AD%90.png?alt=media&token=32f70911-85fe-4079-99a7-ba2566834ead"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E9%B7%B2%E7%BE%8E.png?alt=media&token=0e807626-425e-433e-b623-ac2e2b4c2ed8",
        "name": "鷲美.png"
      },
      {
        "name": "五里.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E4%BA%94%E9%87%8C.png?alt=media&token=c81383f9-e0b7-4b72-ae8d-7616aec416dc"
      },
      {
        "name": "只野.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E5%8F%AA%E9%87%8E.png?alt=media&token=93d7a17a-6e0d-4c76-96f4-583301556692"
      },
      {
        "name": "蒲惠.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E8%92%B2%E6%83%A0.png?alt=media&token=719af860-5f24-4128-9377-22715190d123"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E7%A9%B4%E4%BA%95.png?alt=media&token=84998852-c2c8-4dc0-bb65-a78662e07c06",
        "name": "穴井.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E8%A7%92%E7%94%B0.png?alt=media&token=cef1f7df-c604-4500-a030-80a14c550d19",
        "name": "角田.png"
      },
      {
        "name": "坪根.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E5%9D%AA%E6%A0%B9.png?alt=media&token=c67482d4-3e48-4368-a491-abe21b10aa83"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E6%95%A6.png?alt=media&token=0a870b81-fa9e-4436-8e83-87a369806a1a",
        "name": "敦.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A1%9D%E5%90%A7%E7%83%88%E5%AD%90%2F%E5%B0%8F%E5%AE%AE.png?alt=media&token=bb38a0af-019d-4565-b44d-c241556fa98f",
        "name": "小宮.png"
      }
    ],
    "quantity": 13
  },
  {
    "name": "親愛的白人",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E8%8E%8E%E6%9B%BC%E7%8F%8A%20(1).png?alt=media&token=f556f043-c164-4e7f-b9ba-2319ff6597a4",
        "name": "莎曼珊 (1).png"
      },
      {
        "name": "特洛伊.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E7%89%B9%E6%B4%9B%E4%BC%8A.png?alt=media&token=3081bc43-f409-40fd-b0e1-3fd6f5d68b90"
      },
      {
        "name": "萊諾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E8%90%8A%E8%AB%BE.png?alt=media&token=2253df2e-267f-4cca-8cfa-033f2dd10b6c"
      },
      {
        "name": "科可.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E7%A7%91%E5%8F%AF.png?alt=media&token=f2575132-b208-4314-9413-c077fd6af571"
      },
      {
        "name": "雷吉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E9%9B%B7%E5%90%89.png?alt=media&token=71c1f9e4-de43-4713-a6af-46db37c5b6c3"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E5%8A%A0%E5%B8%83.png?alt=media&token=c53d05e2-f0a1-4e08-8534-b23f94592b74",
        "name": "加布.png"
      },
      {
        "name": "喬艾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E5%96%AC%E8%89%BE.png?alt=media&token=50e24554-902d-4b62-b3cd-97a840f4d866"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E6%93%B4%E9%9F%B3%E5%99%A8.png?alt=media&token=8d5f2516-8672-4aaa-8021-88e00923930e",
        "name": "擴音器.png"
      },
      {
        "name": "莎曼珊 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E8%A6%AA%E6%84%9B%E7%9A%84%E7%99%BD%E4%BA%BA%2F%E8%8E%8E%E6%9B%BC%E7%8F%8A%20(1).png?alt=media&token=8dde87a4-3c4e-419e-8e9f-a2962a4b8b97"
      }
    ],
    "quantity": 9
  },
  {
    "name": "酷男的異想世界",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%85%B7%E7%94%B7%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C%2F%E5%8D%A1%E6%8B%89%E8%8E%AB.png?alt=media&token=29876e73-4705-4c98-93dd-bcc9aebf598a",
        "name": "卡拉莫.png"
      },
      {
        "name": "譚.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%85%B7%E7%94%B7%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C%2F%E8%AD%9A.png?alt=media&token=a64b1762-7bc0-4200-bb65-55cf8951fdbb"
      },
      {
        "name": "安東尼.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%85%B7%E7%94%B7%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C%2F%E5%AE%89%E6%9D%B1%E5%B0%BC.png?alt=media&token=fcadd508-bf1a-4b7d-809a-4932aa9cbe53"
      },
      {
        "name": "鮑比.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%85%B7%E7%94%B7%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C%2F%E9%AE%91%E6%AF%94.png?alt=media&token=b85de82f-4db8-4eb8-85b5-8dbbcc9f68d1"
      },
      {
        "name": "強納森 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%85%B7%E7%94%B7%E7%9A%84%E7%95%B0%E6%83%B3%E4%B8%96%E7%95%8C%2F%E5%BC%B7%E7%B4%8D%E6%A3%AE%20(1).png?alt=media&token=69ef21bd-e2aa-4cb0-a16a-4d1bbd152623"
      }
    ],
    "quantity": 5
  },
  {
    "name": "闇",
    "files": [
      {
        "name": "年輕的約拿.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%B9%B4%E8%BC%95%E7%9A%84%E7%B4%84%E6%8B%BF.png?alt=media&token=1bdd487c-95cf-4bb9-85cc-5326e477d909"
      },
      {
        "name": "年輕的瑪莎.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%B9%B4%E8%BC%95%E7%9A%84%E7%91%AA%E8%8E%8E.png?alt=media&token=1e6d2f8c-e5fc-45d2-b99c-77ab60d6b1d7"
      },
      {
        "name": "年老的約拿.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%B9%B4%E8%80%81%E7%9A%84%E7%B4%84%E6%8B%BF.png?alt=media&token=b7bdae76-8a98-4fab-95f4-c5cf123c39f9"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%B9%B4%E8%80%81%E7%9A%84%E7%91%AA%E8%8E%8E.png?alt=media&token=33351abc-133b-451d-8d33-7130756fa285",
        "name": "年老的瑪莎.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E8%AB%BE%E4%BA%9E.png?alt=media&token=2da7128f-a9a1-4651-885f-9c03a3d01100",
        "name": "諾亞.png"
      },
      {
        "name": "克勞迪婭.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%85%8B%E5%8B%9E%E8%BF%AA%E5%A9%AD.png?alt=media&token=32e8014f-57a8-4f08-a329-c6476609b4a7"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E7%B1%B3%E5%87%B1%E7%88%BE.png?alt=media&token=09c66493-a940-43f1-b817-2acc9afdf936",
        "name": "米凱爾.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E5%9D%A6%E6%B5%A9%E6%96%AF.png?alt=media&token=387cde8c-3cf7-49af-8a7e-1ad78882e590",
        "name": "坦浩斯.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E4%B8%89%E4%B8%80%E7%B5%90.png?alt=media&token=4eda668b-a166-4908-8d2b-202425c9f259",
        "name": "三一結.png"
      },
      {
        "name": "時光機.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%97%87%2F%E6%99%82%E5%85%89%E6%A9%9F.png?alt=media&token=510d9d2f-998d-4286-bba0-088fa09c6175"
      }
    ],
    "quantity": 12
  },
  {
    "name": "雨傘學院",
    "files": [
      {
        "name": "波哥.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E6%B3%A2%E5%93%A5.png?alt=media&token=9cb90656-b657-41e6-9722-5cf8ef4e8449"
      },
      {
        "name": "維克多.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E7%B6%AD%E5%85%8B%E5%A4%9A.png?alt=media&token=d5fc91fa-ce2c-4cad-afac-e2e409712ceb"
      },
      {
        "name": "班.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E7%8F%AD.png?alt=media&token=21c45e08-8d04-41e7-9da8-562d0259ca2a"
      },
      {
        "name": "五號.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E4%BA%94%E8%99%9F.png?alt=media&token=1f9f1722-0511-42d6-9737-ba773bfef1f8"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E5%85%8B%E5%8B%9E%E6%96%AF.png?alt=media&token=cee4a539-2ec4-471b-80c4-7022dee02050",
        "name": "克勞斯.png"
      },
      {
        "name": "愛莉森.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E6%84%9B%E8%8E%89%E6%A3%AE.png?alt=media&token=acc93baa-549f-4011-97d0-c2cb2f2086e4"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E8%BF%AA%E4%BA%9E%E5%93%A5.png?alt=media&token=a44f2d50-adfb-4f87-8ff8-45a3ba153d2a",
        "name": "迪亞哥.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9B%A8%E5%82%98%E5%AD%B8%E9%99%A2%2F%E8%B7%AF%E5%BE%B7.png?alt=media&token=4896ee16-14e6-4b6c-8fb8-5e8b77cc918a",
        "name": "路德.png"
      }
    ],
    "quantity": 9
  },
  {
    "name": "青春無密語",
    "files": [
      {
        "name": "安德魯.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E5%AE%89%E5%BE%B7%E9%AD%AF.png?alt=media&token=381bbab4-5b48-44fe-856b-6f75509bcc58"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E5%BA%B7%E5%A6%AE.png?alt=media&token=5ec8ea4d-b681-42cb-8499-9e2341e742f9",
        "name": "康妮.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E5%B0%8F%E8%8E%AB.png?alt=media&token=38b37208-7fa2-4ea8-b565-f409a7bfb981",
        "name": "小莫.png"
      },
      {
        "name": "尼克.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E5%B0%BC%E5%85%8B.png?alt=media&token=fd05f6c5-87e2-44d4-9dc6-ba5087839d59"
      },
      {
        "name": "米希.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E7%B1%B3%E5%B8%8C.png?alt=media&token=b3c7010c-1355-4dcc-88f5-96f50c1a83a3"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E5%8F%B2%E6%8F%90%E5%A4%AB%E6%95%99%E7%B7%B4.png?alt=media&token=f9beb586-8391-4c61-8b00-ae23222f9c6e",
        "name": "史提夫教練.png"
      },
      {
        "name": "潔西.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E6%BD%94%E8%A5%BF.png?alt=media&token=542357ec-959a-4ba5-bc50-b5b7453c6a13"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E6%9D%B0.png?alt=media&token=8bdf3dd4-8d94-48e0-bca2-d1c1635565fa",
        "name": "杰.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%9D%92%E6%98%A5%E7%84%A1%E5%AF%86%E8%AA%9E%2F%E6%9E%95%E9%A0%AD.png?alt=media&token=d3e677e0-2578-4ace-9b08-14395c3c6497",
        "name": "枕頭.png"
      }
    ],
    "quantity": 10
  },
  {
    "name": "飛奔去月球",
    "files": [
      {
        "name": "菲菲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E8%8F%B2%E8%8F%B2.png?alt=media&token=d2074e55-6162-4eb7-ba63-d2f371c847fd"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E6%AC%BD%E9%82%A6.png?alt=media&token=20aa1ae7-d250-493b-b9aa-b4405c746f41",
        "name": "欽邦.png"
      },
      {
        "name": "嫦娥.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E5%AB%A6%E5%A8%A5.png?alt=media&token=cd5f6c3e-8dbc-4c03-9588-fd7b8521a268"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E7%8E%89%E5%85%94.png?alt=media&token=79d0364b-4c5c-4e78-93a3-f3dc3aafe19b",
        "name": "玉兔.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E6%9E%9C%E5%87%8D.png?alt=media&token=7477c402-ca7c-4629-b599-16de77b2f5e1",
        "name": "果凍.png"
      },
      {
        "name": "會飛的獅子.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E6%9C%83%E9%A3%9B%E7%9A%84%E7%8D%85%E5%AD%90.png?alt=media&token=51424475-120f-448c-ba2d-d0ac0d7bc6b5"
      },
      {
        "name": "幻月侍女.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A3%9B%E5%A5%94%E5%8E%BB%E6%9C%88%E7%90%83%2F%E5%B9%BB%E6%9C%88%E4%BE%8D%E5%A5%B3.png?alt=media&token=2fe31fb8-6698-4352-984a-9d11bec4d724"
      }
    ],
    "quantity": 8
  },
  {
    "name": "馬男波傑克",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A6%AC%E7%94%B7%E6%B3%A2%E5%82%91%E5%85%8B%2F%E6%B3%A2%E5%82%91%E5%85%8B.png?alt=media&token=2f2b856b-892b-4ea2-8a2e-bf37f0c437b0",
        "name": "波傑克.png"
      },
      {
        "name": "戴安.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A6%AC%E7%94%B7%E6%B3%A2%E5%82%91%E5%85%8B%2F%E6%88%B4%E5%AE%89.png?alt=media&token=87acf343-a353-4968-a66f-15c62131f120"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A6%AC%E7%94%B7%E6%B3%A2%E5%82%91%E5%85%8B%2F%E8%8A%B1%E7%94%9F%E9%86%AC%E5%85%88%E7%94%9F.png?alt=media&token=acd1ac65-6eb2-45f6-8faf-1634bd0ac9da",
        "name": "花生醬先生.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A6%AC%E7%94%B7%E6%B3%A2%E5%82%91%E5%85%8B%2F%E5%87%B1%E6%B4%9B%E7%90%B3%E5%85%AC%E4%B8%BB.png?alt=media&token=997df7c5-283c-4cfa-a26f-a6cb6e3a849a",
        "name": "凱洛琳公主.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%A6%AC%E7%94%B7%E6%B3%A2%E5%82%91%E5%85%8B%2F%E9%99%B6%E5%BE%B7.png?alt=media&token=59e3d557-dba3-4e39-9744-592d8d107cee",
        "name": "陶德.png"
      }
    ],
    "quantity": 5
  },
  {
    "name": "魔水晶：抗爭時代",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E8%BF%AA%E7%89%B9.png?alt=media&token=d4bda86c-62a7-436b-81fb-f08e80e31fa8",
        "name": "迪特.png"
      },
      {
        "name": "哈普 (1).png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E5%93%88%E6%99%AE%20(1).png?alt=media&token=9dfa862a-4805-4eda-b920-f147c81b34f0"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E5%B8%83%E9%BA%97.png?alt=media&token=74623676-935c-4322-823e-312bb957c29d",
        "name": "布麗.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E7%91%9E%E6%98%82.png?alt=media&token=441be013-cc1a-4487-9540-38fbf3c97c2d",
        "name": "瑞昂.png"
      },
      {
        "name": "大王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E5%A4%A7%E7%8E%8B.png?alt=media&token=2c6b361f-9f08-474d-bd80-9ce1d9dfdb25"
      },
      {
        "name": "將軍.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E5%B0%87%E8%BB%8D.png?alt=media&token=2e1f4b75-e2b3-4c7c-acee-351c7901f412"
      },
      {
        "name": "聖母奧古拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E8%81%96%E6%AF%8D%E5%A5%A7%E5%8F%A4%E6%8B%89.png?alt=media&token=122b04ff-27bb-4d2d-b5ae-958326cd8a3b"
      },
      {
        "name": "毛怪.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E6%AF%9B%E6%80%AA.png?alt=media&token=326f03db-fc40-4d3d-ab72-170e69c5f9ce"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E6%B0%B4%E6%99%B6%EF%BC%9A%E6%8A%97%E7%88%AD%E6%99%82%E4%BB%A3%2F%E6%B0%B4%E6%99%B6.png?alt=media&token=70f4edfd-d421-47d8-a5a0-e6a240d586a8",
        "name": "水晶.png"
      }
    ],
    "quantity": 10
  },
  {
    "name": "魔鬼神探",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E8%B7%AF%E8%A5%BF%E6%B3%95.png?alt=media&token=f35945a4-6cb5-4606-9040-f56b1c862b69",
        "name": "路西法.png"
      },
      {
        "name": "皓兒.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E7%9A%93%E5%85%92.png?alt=media&token=aac03669-cc99-4aa2-8843-e261e5023930"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E9%BA%A5%E8%8C%B2.png?alt=media&token=08766722-7ff0-4095-8eb2-b519a85b3870",
        "name": "麥茲.png"
      },
      {
        "name": "阿曼納迪爾.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E9%98%BF%E6%9B%BC%E7%B4%8D%E8%BF%AA%E7%88%BE.png?alt=media&token=378e7fef-3da6-475e-9435-4ff859d35b29"
      },
      {
        "name": "琳達.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E7%90%B3%E9%81%94.png?alt=media&token=9fa2e1b6-203f-4dd5-82f6-63c2fcd023c3"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E4%B8%B9.png?alt=media&token=c430a2e2-5e2c-486b-b3fc-9828d2d004d0",
        "name": "丹.png"
      },
      {
        "name": "艾拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2F%E8%89%BE%E6%8B%89.png?alt=media&token=58b0d316-c6c1-4c1a-9799-c974ddebb5fd"
      },
      {
        "name": "null.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%94%E9%AC%BC%E7%A5%9E%E6%8E%A2%2Fnull.png?alt=media&token=f7ebf4bc-b6d0-420a-a6b0-2e417be2c3c6"
      }
    ],
    "quantity": 9
  },
  {
    "name": "魷魚遊戲",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E4%BB%A3%E8%A1%A8%E4%BA%BA%E7%89%A9.png?alt=media&token=210b3143-bd8b-47f5-9ae2-743f087d12b7",
        "name": "代表人物.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E9%9D%A2%E5%85%B7%E7%AE%A1%E7%90%86%E5%93%A1.png?alt=media&token=46d7cc99-04cb-4eff-aba3-594e36193a98",
        "name": "面具管理員.png"
      },
      {
        "name": "面具士兵.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E9%9D%A2%E5%85%B7%E5%A3%AB%E5%85%B5.png?alt=media&token=a94d6c46-9cb9-4663-9a23-24b3d3c8e42f"
      },
      {
        "name": "面具勞工.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E9%9D%A2%E5%85%B7%E5%8B%9E%E5%B7%A5.png?alt=media&token=78feb83c-3e39-4086-8b3d-06c2cbc6b2cd"
      },
      {
        "name": "英熙.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E8%8B%B1%E7%86%99.png?alt=media&token=7ec41a58-f9da-4722-802b-3e0d1edbd43a"
      },
      {
        "name": "椪糖.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E6%A4%AA%E7%B3%96.png?alt=media&token=17a4c09c-4a1c-47c5-a7ce-1259d7318f38"
      },
      {
        "name": "奇勳.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E5%A5%87%E5%8B%B3.png?alt=media&token=18bf3d44-09f3-4cbf-9921-877abd0f8245"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E5%B0%9A%E4%BD%91.png?alt=media&token=4ecf516e-5c28-4f5a-8585-ab9e1c81a1e1",
        "name": "尚佑.png"
      },
      {
        "name": "俊昊.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E4%BF%8A%E6%98%8A.png?alt=media&token=013d1b0e-503a-47d8-9519-a9b21eb04a99"
      },
      {
        "name": "一男.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E4%B8%80%E7%94%B7.png?alt=media&token=81bb446f-3034-42f1-945c-70cb5e5bde25"
      },
      {
        "name": "德秀.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E5%BE%B7%E7%A7%80.png?alt=media&token=e4dd0a1b-ed0a-406d-b7e1-715f30741b75"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E7%BE%8E%E5%A5%B3.png?alt=media&token=39639385-398a-44eb-90bb-581673ec897c",
        "name": "美女.png"
      },
      {
        "name": "阿里.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%AD%B7%E9%AD%9A%E9%81%8A%E6%88%B2%2F%E9%98%BF%E9%87%8C.png?alt=media&token=21c753e0-9969-4c18-91b6-b85f4b779e5b"
      }
    ],
    "quantity": 13
  },
  {
    "name": "黑鏡",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E8%BC%89%E5%85%A5%E4%B8%AD%E7%9A%84%E5%9C%96%E7%A4%BA.png?alt=media&token=2a839af1-8006-4552-86ae-542ef413e86c",
        "name": "載入中的圖示.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E6%BD%98%E9%81%94%E6%96%AF%E5%A5%88%E5%9F%BA.png?alt=media&token=0e2bd6a5-4a0b-4f6b-8b7a-11f4154ccfd2",
        "name": "潘達斯奈基.png"
      },
      {
        "name": "破碎的笑臉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E7%A0%B4%E7%A2%8E%E7%9A%84%E7%AC%91%E8%87%89.png?alt=media&token=8220ac43-1773-468c-b007-0f862b921cce"
      },
      {
        "name": "符號.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E7%AC%A6%E8%99%9F.png?alt=media&token=9a48c52d-8fad-4cdc-9727-7d152cee45f9"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E5%A8%83%E5%A8%83.png?alt=media&token=28128b4d-c6b4-4c42-806e-e759334ce4f9",
        "name": "娃娃.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BB%91%E9%8F%A1%2F%E7%8C%B4%E5%AD%90%E5%A1%AB%E5%85%85%E7%8E%A9%E5%81%B6.png?alt=media&token=464fc060-f20c-44fe-aeca-cfb264107d79",
        "name": "猴子填充玩偶.png"
      }
    ],
    "quantity": 8
  },
  {
    "name": "龍的王子",
    "files": [
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E5%B0%8F%E9%A4%8C.png?alt=media&token=6dbe9bba-bc5d-4d74-8faa-70047f636607",
        "name": "小餌.png"
      },
      {
        "name": "阿茲.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E9%98%BF%E8%8C%B2.png?alt=media&token=499d1ce8-8b2c-47b6-8c0a-13833df8c18a"
      },
      {
        "name": "艾斯蘭.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E8%89%BE%E6%96%AF%E8%98%AD.png?alt=media&token=ed647ef8-b44d-4cec-9721-4ceee2fd79dd"
      },
      {
        "name": "瑞拉.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E7%91%9E%E6%8B%89.png?alt=media&token=ca2ad83c-7c14-4c60-97fb-79df635119d1"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E5%8D%A1%E5%8B%92%E5%A7%86.png?alt=media&token=c8334484-ecd9-4350-b7d6-7b428649d95b",
        "name": "卡勒姆.png"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E5%85%8B%E5%8B%9E%E8%BF%AA%E5%A9%AD%20(1).png?alt=media&token=8f0f3ae5-22c7-4b45-8616-996446a0db2f",
        "name": "克勞迪婭 (1).png"
      },
      {
        "name": "索倫.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E7%B4%A2%E5%80%AB.png?alt=media&token=c068a1f9-4d76-4adf-8dea-acc58a154bc8"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E9%98%BF%E7%91%AA%E9%9B%85%E5%B0%87%E8%BB%8D.png?alt=media&token=a560cec6-2b3a-4947-a61b-2b816368998f",
        "name": "阿瑪雅將軍.png"
      },
      {
        "name": "雷霆.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E9%9B%B7%E9%9C%86.png?alt=media&token=794a50b4-26b8-4989-ae78-c75c93d42890"
      },
      {
        "name": "威倫.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E5%A8%81%E5%80%AB.png?alt=media&token=6ebc8f36-632f-4333-b127-41b8690b2858"
      },
      {
        "name": "哈羅國王.png",
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E5%93%88%E7%BE%85%E5%9C%8B%E7%8E%8B.png?alt=media&token=3e1b2e82-2912-4617-8833-0ace19816015"
      },
      {
        "url": "https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E9%BE%8D%E7%9A%84%E7%8E%8B%E5%AD%90%2F%E8%B7%AF%E7%B4%8D%E5%AE%89.png?alt=media&token=56b6691c-1fdb-45b3-ae31-6c4246c60dfb",
        "name": "路納安.png"
      }
    ],
    "quantity": 13
  }
]

function Modal({ isOpen, setIsOpen, modalContent }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, modalContent: JSX.Element }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} as="div" className="fixed z-10 inset-0 overflow-y-auto" >
        {/* BackBlur */}
        <Transition.Child as={Fragment}
          enter="transition duration-75 ease-out"
          leave="transition duration-75 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* MenuContainer */}
        <Transition.Child as={Fragment}
          enter="transition duration-100 ease-out"
          leave="transition duration-75 ease-out"
          enterFrom="transform scale-75 opacity-50"
          enterTo="transform scale-100 opacity-100"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-75 opacity-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 min-h-screen">
            <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white">
              <div className="inline-block align-bottom text-center bg-white rounded-md px-4 pt-5 pb-4 overflow-hidden shadow-sm transform transition-all sm:align-middle sm:max-w-sm sm:w-full">
                {modalContent}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

function LinkedSignUp({ profile, setModalOpen, setModalContent }: { profile: Users, setModalOpen: Dispatch<SetStateAction<boolean>>, setModalContent: Dispatch<SetStateAction<JSX.Element>> }) {
  const [profileAvatar, setProfileAvatar] = useState(profile.avatar)
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [netflixImg, setnetflixImg] = useState("https://firebasestorage.googleapis.com/v0/b/instagram-clone-927a2.appspot.com/o/avatar%2F%E7%B6%93%E5%85%B8%2F%E7%BE%85%E8%B3%93%C2%B7%E5%A5%87%E5%88%A9%E8%8C%B2.png?alt=media&token=889df9c1-f6b3-430a-bb32-095af6e62ffc")
  const [confirm, setConfirm] = useState(false);
  const [checkForm, setCheckForm] = useState(0)
  const inputWarn = {
    name: useState(""),
    username: useState(""),
    password: useState("")
  }
  useEffect(() => {
    setModalContent(<SelectMenu />)
  }, [profileAvatar])

  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            setProfileAvatar(renderEvent.target.result)
            setConfirm(true)
          }
        }
      }
    }
  }

  const NetflixMenu = () => {
    const netflix = (url: string) => {
      setProfileAvatar(url)
      setModalOpen(false)
    }
    return (
      <div className='h-[640px] w-96 overflow-y-auto scrollbar-default'>
        {NetflixAvatars.map((col) => (
          <div className='mb-4 flex flex-col'>
            <p className='text-left text-gray-600 text-xl font-bold mb-1'>{col.name}</p>
            <div className='flex flex-row w-max overflow-y-hidden overflow-x-auto'>
              {col.files.map((file) => (
                <div className='mr-2 hover:scale-110 cursor-pointer' onClick={(e) => netflix(file.url)}>
                  <Image src={file.url} height={64} width={64} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  const SelectMenu = () => (
    <div className='px-4'>
      <Dialog.Title className={"text-xl font-semibold text-gray-800"}>選取您的大頭貼</Dialog.Title>
      <div className='mt-6 flex flex-row justify-around'>
        <div className='flex flex-col justify-center items-center'>
          <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden group cursor-pointer" onClick={() => filePickerRef.current!.click()}>
            <Image width={88} height={88} src={profileAvatar} objectFit="contain" alt="你的大大大頭貼！" />
            <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
          </div>
          <p className='text-sm text-gray-70 w-max my-2'>自行上傳頭貼</p>
        </div>
        {!confirm &&
          <div className='flex flex-col justify-center items-center'>
            <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden group cursor-pointer" onClick={() => setModalContent(<NetflixMenu />)}>
              <Image width={88} height={88} src={netflixImg} objectFit="contain" alt="你的大大大頭貼！" />
              <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
            </div>
            <p className='text-sm text-gray-700 w-max my-2'>使用 Netflix 頭貼</p>
          </div>

        }
      </div>
      <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
      <div className='mt-4 flex w-full justify-between space-x-8'>
        <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-12 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" onClick={() => setModalOpen(false)}>取消</button>
        <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-12 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:bg-green-50 disabled:text-green-300" disabled={!confirm} onClick={() => setModalOpen(false)}>確認</button>
      </div>
    </div>
  )
  const modalController = () => {
    setModalContent(<SelectMenu />)
    setModalOpen(true)
  }
  const submit = async (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault()
    const data = {
      name: e.target.name.value,
      username: e.target.username.value,
      password: e.target.password.value
    }
    const JSONdata = JSON.stringify(data)
    const endpoint = '/api/form'
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    alert(`Is this your full name: ${result.data}`)
  }
  const check = (e: ChangeEvent<HTMLInputElement>, label: "name" | "username" | "password") => {
    if(label == 'name'){
      if(e.target.value.length <= 0){
        inputWarn.name[1]("請輸入全名")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }else{
        inputWarn.name[1]("")
        if(checkForm == 0) setCheckForm(1)
        if(checkForm == 1) setCheckForm(2)
        if(checkForm == 2) setCheckForm(3)
      }
    }else if(label == 'username'){
      const reg = new RegExp('^(?=.{1,42}$)(?![_.])(?!.*([.]{2}|[_]{2}))[a-zA-Z0-9._]+(?<![_.])$');
      if(e.target.value.match(reg)){
        if(checkForm == 0) setCheckForm(1)
        if(checkForm == 1) setCheckForm(2)
        if(checkForm == 2) setCheckForm(3)
        inputWarn.username[1]("")
      }
      else if(e.target.value.match(/^\_/)){
        inputWarn.username[1]("開頭無法使用'_'")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }
      else if(e.target.value.match(/^\./)){
        inputWarn.username[1]("開頭無法使用'.'")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }else if(e.target.value.match(/\.$/)){
        inputWarn.username[1]("結尾無法使用'.'")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }else if(e.target.value.match(/\_$/)){
        inputWarn.username[1]("結尾無法使用'_'")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }
      else{
        inputWarn.username[1]("只能使用大小寫英文字母、下底線或是句點")
        if(checkForm == 1) setCheckForm(0)
        if(checkForm == 2) setCheckForm(1)
        if(checkForm == 3) setCheckForm(2)
      }
    }else if(label == "password"){
      // Wrong
      setCheckForm(3)
      // Right
      if(checkForm == 1 || checkForm == 2) setCheckForm(3)
      inputWarn.password[1]("And your son")
    }

  }
  return (
    <div className="flex flex-col w-full sm:w-[350px] items-center bg-white sm:border border-gray-200 py-2">
      <div className="w-44 h-auto mt-8 mb-3">
        <Image width={176} height={63} src="/InsL.svg" objectFit="contain" alt="山寨 IG" />
      </div>
      <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden group cursor-pointer" onClick={modalController}>
        <Image width={88} height={88} src={profileAvatar} objectFit="contain" alt="你的大大大頭貼！" />
        <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
      </div>
      <div className="my-5">
        <form className="space-y-2 w-[256px]" onSubmit={submit} autoComplete="off">
          <div className="relative w-[256px] ">
            <input type="text" id="name" name="name" onChange={(e) => check(e, "name")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.name} />
            <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">全名</label>
            { inputWarn.name[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.name[0]}</p>}
          </div>
          <div className="relative w-[256px]">
            <input type="text" id="username" name="username" onChange={(e) => check(e, "username")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
            <label htmlFor="username" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">用戶名稱</label>
            { inputWarn.username[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.username[0]}</p>}
          </div>
          <div className="relative w-[256px]">
            <input type="password" id="password" name="password" onChange={(e) => check(e, "password")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
            <label htmlFor="password" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">密碼</label>
            { inputWarn.password[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.password[0]}</p>}
          </div>
          <p className="!mt-4 text-xs text-center text-gray-400"><span>使用我們服務的用戶可能上傳了您的聯絡資料到 Insta山寨。</span><Link href={'https://www.facebook.com/help/instagram/261704639352628'}><a className="text-gray-500 opacity-80 font-semibold">瞭解詳情</a></Link></p>
          <p className="!mt-4 text-xs text-center text-gray-400"><span>註冊即表示你同意我們的 </span><Link href={'https://help.instagram.com/581066165581870'}><a className="text-gray-500 opacity-80 font-semibold">服務條款</a></Link><span> 、 </span><Link href={'https://help.instagram.com/581066165581870'}><a className="text-gray-500 opacity-80 font-semibold">《隱私政策》</a></Link><span> 和 </span><Link href={'https://help.instagram.com/581066165581870'}><a className="text-gray-500 opacity-80 font-semibold">《Cookie 政策》</a></Link></p>
          <button disabled={checkForm != 3} className="w-[268px] h-8 bg-blue-500 disabled:bg-blue-200 text-sm text-white rounded-[4px] !mt-4 mb-2">註冊</button>
        </form>
      </div>
    </div>
  );
}

function SignUp() {
  return (
    <div></div>
  );
}


function Signup({ type, user }: { type: 'signup' | 'linkedSignup', user?: string }) {
  const [page, setPage] = useState(<div className='fixed text-4xl left-1/2 top-1/2 translate-x-1/2 translate-y-1/2 animate-pulse'>頁面正在載入中</div>)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(<></>);
  useEffect(() => {
    if (type == 'signup') {
      setPage(<SignUp />)
    }
    if (type == 'linkedSignup' && user) {
      const profile: Users = JSON.parse(user);
      setPage(<LinkedSignUp profile={profile} setModalOpen={setModalOpen} setModalContent={setModalContent} />)
    }
  }, [type])
  return (
    <div className="relative flex justify-center items-center w-full bg-white sm:bg-gray-50 min-h-screen py-24">
      <HeadUni type="other" title="註冊・Instagram" />
      {page}
      <Modal isOpen={modalOpen} setIsOpen={setModalOpen} modalContent={modalContent} />
    </div>
  );
}

export default Signup;

export async function getServerSideProps({ query }: { query: { i: string, c: string, p: 'google' | 'facebook' } }) {
  try {
    if (query.i.length != 32 || (query.p != 'google' && query.p != 'facebook')) {
      return {
        props: {
          type: 'signup',
        },
      };
    }
    const userFinder = await getDocs(queryDB(collection(db, 'users'), where(`linked.${query.p}`, '==', decrypt(query.i, query.c))));
    for (const find of userFinder.docs) {
      return {
        props: {
          type: 'linkedSignup',
          user: JSON.stringify({ id: find.id, ...find.data() }),
        },
      };
    }
    return await setTimeout(2000, {
      props: {
        type: 'signup',
      },
    });
  } catch {
    return {
      props: {
        type: 'signup',
      },
    };
  }
}