"use server";
import { BreadcrumbServerWrapper } from "@/components/breadcumb/breadcumb-server";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import Link from "next/link";

const content: {
  [x: string]: {
    level: 1 | 2 | 3 | 4 | 5;
    text: string;
    className?: string;
    link?: {
      target: string;
      link: string;
    }[]
  }[]
} = {
  en: [
    {
      level: 1,
      text: `Cookie Policy`
    }, {
      level: 5,
      text: `We use cookies and similar technologies. This Cookie Policy explains how we use cookies in connection with the Platform and your related choices.`
    }, {
      level: 5,
      text: `Capitalized terms used in this Cookie Policy but not defined here will have the meanings given to them in our Privacy Policy.`,
      link: [{ target: "Privacy Policy", link: "/policy/privacy" }]
    }, {
      level: 5,
      text: `You may also contact us at kemagazinetcsh@gmail.com with any additional questions.`,
      link: [{ target: "kemagazinetcsh@gmail.com", link: "mailto:kemagazinetcsh@gmail.com" }]
    }, {
      level: 2,
      text: `What are Cookies, Pixels and Local Storage?`
    }, {
      level: 5,
      text: `Cookies are small files that websites place on your computer as you browse the web. Like many commercial websites, we use cookies. Cookies — and similar technologies — do lots of different jobs, like letting you navigate between pages efficiently, remembering your preferences, and generally improving the user experience. Cookies and other technologies may also be used to measure the effectiveness of marketing and otherwise assist us in making your use of the Platform and its features more relevant and useful to you.`
    }, {
      level: 5,
      text: `Pixel tags (also known as web beacons or pixels) are small blocks of code on a web page or in an email notification. Pixels allow companies to collect information such as an individual's IP address, when the individual viewed the pixel and the type of browser used. We use pixel tags to understand whether you've interacted with content on our Platform, which helps us measure and improve our Platform and personalize your experience.`
    }, {
      level: 5,
      text: `Local storage allows a website to store information locally on your computer or mobile device. Local storage is mainly used to store and retrieve data in HTML pages from the same domain. We use local storage to customize what we show you based on your past interactions with our Platform.`
    }, {
      level: 5,
      text: `It is important to understand that cookies (and the technologies listed above) collect personal information as well as non-identifiable information.`
    }, {
      level: 2,
      text: `How and Why do We Use Cookies?`
    }, {
      level: 5,
      text: `We use both 1st party cookies (which are set by us) and 3rd party cookies (which are set by a server located outside the domain of our Site). Some of the cookies or similar technologies that we use are "strictly necessary" in that they are essential to the Site. Without them, the Site will not work. Other cookies or similar technologies, while not essential, help us improve our Platform or measure audiences. Why we use cookies is describe below in more detail.`
    }, {
      level: 3,
      text: `Strictly Necessary or Essential Cookies: `
    }, {
      level: 5,
      text: `These cookies are necessary for the Site to function and cannot be switched off in our systems. For example, we use cookies to authenticate you. When you log on to our websites, authentication cookies are set which let us know who you are during a browsing session. We have to load essential cookies for legitimate interests pursued by us in delivering our Site's essential functionality to you.`
    }, {
      level: 3,
      text: `Functionality Cookies:`
    }, {
      level: 5,
      text: `These cookies are used to enable certain additional functionality on our Site, such as storing your preferences (e.g. username) and assisting us in providing support or payment services to you so we know your browser or operating system. This functionality improves user experience and enables us to provide better Services and a more efficient Platform.`
    }, {
      level: 3,
      text: `Performance and Analytics Cookies: `
    }, {
      level: 5,
      text: `These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Site. They help us to know which pages are the most and least popular and see how visitors navigate the Site. Performance cookies are used to help us with our analytics, including to compile statistics and analytics about your use of and interaction with the Site, including details about how and where our Site are accessed, how often you visit or use the Site, the date and time of your visits, your actions on the Site, and other similar traffic, usage, and trend data.`
    }, {
      level: 2,
      text: `Your Choices`
    }, {
      level: 5,
      text: `You can learn more about cookies by visiting https://www.allaboutcookies.org/, which includes additional useful information on cookies and how to block cookies using different types of browsers.`,
      link: [{ target: "https://www.allaboutcookies.org/", link: "https://www.allaboutcookies.org/" }]
    }, {
      level: 5,
      text: `If you'd like to remove or disable cookies via your browser, please refer to your browser's configuration documentation. Please note, however, that by blocking or deleting all cookies used on the Site, you may not be able to take full advantage of the Site and you may not be able to properly log on to the Site.`
    }
  ],
  zh: [
    {
      level: 1,
      text: `Cookie 政策`
    }, {
      level: 5,
      text: `本網站使用 Cookie 以及其他相關技術。 在本協議中我們會解釋如何使用您的 Cookie 以及您相關的權益。`
    }, {
      level: 5,
      text: `本協議中使用但未在此處定義的術語，請參閱我們的隱私政策。`,
      link: [{ target: "隱私政策", link: "/policy/privacy" }]
    }, {
      level: 5,
      text: `您也可以透過 kemagazinetcsh@gmail.com 聯繫我們已取得更多未提及的資訊。`,
      link: [{ target: "kemagazinetcsh@gmail.com", link: "mailto:kemagazinetcsh@gmail.com" }]
    }, {
      level: 2,
      text: `什麼是 Cookies、Pixels 和 Local Storage?`
    }, {
      level: 5,
      text: `Cookies 是網站在你瀏覽網頁時存放的一些代碼. 我們就跟眾多商業網站一樣使用 Cookies。 Cookies 以及其他相關技術功不可沒，例如：頁面切換更加快速、喜好項目的紀錄，以及提高整體的用戶體驗。Cookies 和相關技術也可以供我們觀測受眾的動向，更可協助我們提升您在瀏覽本網站所使用裝置的相容性。`
    }, {
      level: 5,
      text: `Pixel tags (AKA 網路信標、像素標籤) 是網頁或電子郵件通知中的雜湊。Pixel 允許公司收集信息，例如個人的 IP 地址、查看 Pixel 的時間和使用的瀏覽器類型。 我們使用像素標籤來了解您是否與我們平台上的內容互動，這有助於我們衡量和改進我們的平台並個性化您的體驗。`
    }, {
      level: 5,
      text: `Local storage 提供我們存放一些資訊在您的手機或是電腦上。基本上 Local storage 會儲存您在網站中留下的個人喜好設定或是儲存訊息。`
    }, {
      level: 5,
      text: `了解上面列出的技術會收集個人信息以及非個人信息非常重要。`
    }, {
      level: 2,
      text: `本網站將為什麼以及如何使用 Cookies`
    }, {
      level: 5,
      text: `本網站同時使用第一方（我們）設置的 Cookie 和第三方設置的 Cookie。某些相關技術或 Cookie 為「絕對必要」，它們對網站至關緊要。少了他們，網站將無法正常運作。其餘雖然非必需，但可以幫助我們改進我們的平台或衡量受眾。我們使用 Cookie 的原因在下文有更詳細的描述。.`
    }, {
      level: 3,
      text: `絕對必要或是必要的 Cookies: `
    }, {
      level: 5,
      text: `這些 Cookie 是維持網頁正常運行必須使用的。例如，用來驗證身份的 Cookie。當您登錄我們的網站時，為了能讓我們能辨識您的身份，我們會設置身份驗證的 Cookie。在向您提供我們網站的基本功能時所追求的合法利益，您必須加載必要的 Cookie，且不能關閉！`
    }, {
      level: 3,
      text: `功能性 Cookies:`
    }, {
      level: 5,
      text: `這些 Cookie 是在啟用某些附加功能所需的，例如存儲您的偏好（例如：用戶名）並協助我們為您提供支持或支付服務，以便我們了解您的瀏覽器或操作系統。此功能改善了用戶體驗，使我們能夠提供更好的服務和更高效的平台。`
    }, {
      level: 3,
      text: `效能以及分析 Cookies: `
    }, {
      level: 5,
      text: `這些 Cookie 使我們能夠計算訪問量和流量來源，以便我們衡量和改進我們網站的性能。它們幫助我們了解哪些頁面最受歡迎和最不受歡迎，並了解訪問者如何瀏覽網站。 效能 Cookie 用於幫助我們進行分析，包括編譯有關您使用本網站和與本網站互動的統計數據和分析，包括有關訪問我們網站的方式和地點、您訪問或使用本網站的頻率、日期和您訪問網站的時間、您在網站上的操作以及其他類似的流量、使用情況和趨勢數據。`
    }, {
      level: 2,
      text: `您的選擇`
    }, {
      level: 5,
      text: `您可以在 https://www.allaboutcookies.org/ 了解更多有關 Cookie 的資訊。其中包含 Cookie 中格外有用的資訊，還有不同瀏覽器要怎麼停用或阻止 Cookies。`,
      link: [{ target: "https://www.allaboutcookies.org/", link: "https://www.allaboutcookies.org/" }]
    }, {
      level: 5,
      text: `如果您想要移除本網頁在您瀏覽器儲存的 Cookie，請至您瀏覽器的設定檔文獻確認。但請注意，如果您阻止或刪除所有網站的 Cookies，您可能無法享受所有網站的利益也許還會導致登入的錯誤！`
    }
  ],
}

export default async function Page({ params }: { params: { locale: LangCode } }) {
  const locale = params.locale;
  return (
    <>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.policy.title(locale) as string, href: webInfo.webMap.policy.href, icon: webInfo.webMap.policy.nav.icon }, { title: webInfo.webMap.policy.child.cookie.title(locale) as string, href: webInfo.webMap.policy.child.cookie.href, icon: webInfo.webMap.policy.child.cookie.nav.icon }]} />
      <div className="relative flex flex-col text-main mt-6 prose-h1:font-black prose-h1:text-4xl prose-h1:mb-4 prose-h2:font-bold prose-h2:text-xl prose-h2:mb-2 prose-h3:font-semibold prose-h3:text-base prose-h4:ml-4 prose-h4:font-normal prose-h4:text-base prose-h5:indent-4 prose-h5:ml-4 prose-h5:mb-3 prose-h5:font-normal prose-h5:text-base prose-a:text-main2">
        <span className="absolute top-0 right-0 text-xs text-main/40 mt-4">This webpage only provided in Mandarin and English.</span>
        {content[params.locale === "zh" ? "zh" : "en"].map((content, key) => {
          const render: any[] = [];
          if (content.link) {
            for (const link of content.link) {
              const splited = content.text.split(link.target);
              render.push({ type: 0, text: splited[0] });
              render.push({ type: 1, text: link.target, link: link.link });
              render.push({ type: 0, text: splited[1] });
            }
          } else render.push({ type: 0, text: content.text });
          if (content.level === 1) {
            return (
              <h1 key={key}>{render.map((text, key) => {
                if (text.type === 0) {
                  return (<span key={key}>{text.text}</span>);
                } else if (text.type === 1) {
                  return (<Link key={key} href={text.link}>{text.text}</Link>)
                }
              })}</h1>
            )
          } else if (content.level === 2) {
            return (
              <h2 key={key}>{render.map((text, key) => {
                if (text.type === 0) {
                  return (<span key={key}>{text.text}</span>);
                } else if (text.type === 1) {
                  return (<Link key={key} href={text.link}>{text.text}</Link>)
                }
              })}</h2>
            )
          } else if (content.level === 3) {
            return (
              <h3 key={key}>{render.map((text, key) => {
                if (text.type === 0) {
                  return (<span key={key}>{text.text}</span>);
                } else if (text.type === 1) {
                  return (<Link key={key} href={text.link}>{text.text}</Link>)
                }
              })}</h3>
            )
          } else if (content.level === 4) {
            return (
              <h4 key={key}>{render.map((text, key) => {
                if (text.type === 0) {
                  return (<span key={key}>{text.text}</span>);
                } else if (text.type === 1) {
                  return (<Link key={key} href={text.link}>{text.text}</Link>)
                }
              })}</h4>
            )
          } else if (content.level === 5) {
            return (
              <h5 key={key}>{render.map((text, key) => {
                if (text.type === 0) {
                  return (<span key={key}>{text.text}</span>);
                } else if (text.type === 1) {
                  return (<Link key={key} href={text.link}>{text.text}</Link>)
                }
              })}</h5>
            )
          }
        })}
      </div>
    </>
  )
}