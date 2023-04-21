import { BreadcrumbServerWrapper } from "@/components/breadcumb/breadcumb-server";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import Link from "next/link";

export default function PolicyPrivacy({ params }: { params: { locale: LangCode } }) {
  return (
    <>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.policy.title(params.locale) as string, href: webInfo.webMap.policy.href, icon: webInfo.webMap.policy.nav.icon }, { title: webInfo.webMap.policy.child.privacy.title(params.locale) as string, href: webInfo.webMap.policy.child.privacy.href, icon: webInfo.webMap.policy.child.privacy.nav.icon }]} />
      <div className="flex flex-col text-main mt-6 prose-h1:font-black prose-h1:text-4xl prose-h1:mb-4 prose-h2:font-bold prose-h2:text-xl prose-h2:mb-2 prose-h3:mb-4 prose-h3:font-medium prose-h3:text-base prose-h4:ml-4 prose-h4:font-normal prose-h4:text-base prose-h5:indent-4 prose-h5:ml-4 prose-h5:mb-3 prose-h5:font-normal prose-h5:text-base">
        <div className="flex flex-row w-full justify-between items-baseline">
          <h1>隱私條款</h1>
          <span className="text-xs text-main/40">This webpage does not and will not provide any other language except Mandarin.</span>
        </div>
        <h5>您的駕到是「慈中後生」（以下簡稱本網站 ）的榮幸，為了讓您能夠安心的使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益。</h5>
        <h2>一、隱私權保護政策的適用範圍</h2>
        <h5>隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。</h5>
        <h2>二、個人資料的蒐集、處理及利用方式</h2>
        <h3>1. 當您造訪本網站或使用本網站所提供之功能服務時，我們將視該服務功能性質，請您提供必要的個人資料（參見本條目第二點），並在該特定目的範圍內處理及利用您的個人資料；非經您書面同意，本網站不會將個人資料用於其他用途。</h3>
        <h3>2. 本網站蒐集之個人資料，包含以下兩種情況：
          <h4>- a. 當您未在本網站註冊帳號</h4>
          <h4>- b. 當您已在本網站註冊帳號</h4>
        </h3>
        <h4>- 以下內容適用於情況 a. 以及 b.
          <h5>當您瀏覽本網站時，伺服器會讀取客戶端相關資訊，包含IP 位址、使用時間以及瀏覽器類別等。此行為將不會紀錄至本網站，但本網站使用第三方分析套件 “Vercel Analytics”，請參見條目五。當您使用本網站聊天室功能時，將會要求您提供您的電子郵件，將在客服人員回應時使用，另外本網站也會紀錄所傳送之訊息內容、時間和IP位置。</h5>
        </h4>
        <h4>- 以下內容只適用於情況 b.
          <h5>當您在本網站註冊帳號時即代表同意此服務條款。另外，本網站使用 Google第三方登入授權，即代表將會從 Google 獲取您的電子郵件、大頭貼以及用戶名稱等，同時本網站也會要求您提供以下基本資料：用戶名稱、自我介紹、Instagram 帳號、以及班級（假使電子信箱位置為慈中）。以上資料預設不公開，也不強制您提供，註冊後可在個人帳號頁面刪除，假使您投稿成功並發布時，資料才會公開。</h5>
        </h4>
        <h4>* 為提供精確的服務，我們會將收集的問卷調查內容進行統計與分析，分析結果之統計數據或說明文字呈現，除供內部研究外，我們會視需要公佈統計數據及說明文字，但不涉及特定個人之資料。</h4>
        <h4>* 您可以隨時向我們提出請求，以更正或刪除本網站所蒐集您錯誤或不完整的個人資料。</h4>
        <h2 className="space-y-2">三、資料之保護
          <h4>* 本網站架設於 Vercel日本服務器（網站代管服務），其資料庫使用 Google 旗下 Firebase，均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，加以保護網站及您的個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。</h4>
          <h4>* 如因業務需要有必要委託其他單位提供服務時，本網站亦會嚴格要求其遵守保密義務，並且採取必要檢查程序以確定其將確實遵守。</h4>
        </h2>
        <h2>四、網站對外的相關連結</h2>
        <h5>本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。</h5>
        <h2>五、第三方套件 “Vercel Analytics”</h2>
        <h5>但如果我們或我們的第三方分析服務提供商將匯總信息與您的個人數據結合或連接，以便它可以直接或間接識別您的身份，我們會將結合後的數據視為個人數據，並根據本隱私政策進行處理，請參閱我們的<Link href={webInfo.webMap.policy.child.cookie.href} className="text-main2">Cookie 政策</Link>了解更多。</h5>
        <h2>六、與第三人共用個人資料之政策
          <h5>本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。前項但書之情形包括不限於：</h5>
          <h4>- 經由您書面同意。</h4>
          <h4>- 法律明文規定。</h4>
          <h4>- 為免除您生命、身體、自由或財產上之危險。</h4>
          <h4>- 與公務機關或學術研究機構合作，基於公共利益為統計或學術研究而有必要，且資料經過提供者處理或蒐集者依其揭露方式無從識別特定之當事人。</h4>
          <h4>- 當您在網站的行為，違反服務條款或可能損害或妨礙網站與其他使用者權益或導致任何人遭受損害時，經網站管理單位研析揭露您的個人資料是為了辨識、聯絡或採取法律行動所必要者。</h4>
          <h4>- 本網站委託廠商協助蒐集、處理或利用您的個人資料時，將對委外廠商或個人善盡監督管理之責。</h4>
        </h2>
        <h2>八、隱私權保護政策之修正</h2>
        <h5>本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上以及在註冊帳號之郵件寄送。</h5>
      </div>
    </>
  )
}