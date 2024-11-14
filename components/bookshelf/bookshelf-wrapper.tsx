import { accountDecoding, auth } from "@/app/api/auth/[...nextauth]/auth";
import { LangCode } from "@/types/i18n";
import { getEbooks } from "../ebook/ebook-content-wrapper";
import { BookshelfElement } from "./bookshelf";


const BookshelfWrapper = async ({ className, lang }: { className?: string; lang: LangCode }) => {
  const books = await getEbooks();
  const session = await auth();
  const account = accountDecoding(session.account);
  return (
    <div className={`${className} space-y-4`}>
      <BookshelfElement books={books} account={account} lang={lang} />
    </div>
  )
}

export const revalidate = 300;
export { BookshelfWrapper };
