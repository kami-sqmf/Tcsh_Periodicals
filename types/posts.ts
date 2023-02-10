export const PostType: PostTypeObject = {
  1: {
    type: 1,
    title: "散文投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      mandarinTeacher: "國文老師",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  2: {
    type: 2,
    title: "短篇小說投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      mandarinTeacher: "國文老師",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  3: {
    type: 3,
    title: "新詩投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      mandarinTeacher: "國文老師",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  4: {
    type: 4,
    title: "書籍、影視評論與心得",
    description: "本類投稿需包括作者介紹(200字以上) 、內容簡介(200字以上)、心得與評論(350以上)、議題討論(至少一個問題)",
    requiredTextCount: 750,
    requiredInformation: {
      commentObjectName: "書籍/影視名稱",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  5: {
    type: 5,
    title: "社論投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      relatedArticle: "相關社會議題或新聞時事",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  6: {
    type: 6,
    title: "科普文章投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      relatedSubject: "相關科目",
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  },
  7: {
    type: 7,
    title: "慈中大小事",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      bio: "個人簡介(20字以上，可為筆名含意或個人興趣等,內容不限)",
    }
  }
  ,
  8: {
    type: 8,
    title: "特別徵文投稿",
    description: null,
    requiredTextCount: null,
    requiredInformation: {
      mandarinTeacher: "國文老師",
    }
  }
}

export type PostTypeObject = {
  [x: number]: {
    type: number;
    title: string;
    description: string | null;
    requiredTextCount: number | null;
    requiredInformation: {
      [y: string]: string;
    },
  }
}