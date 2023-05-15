const _ = require('lodash');
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EBooks } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { getDocsFromCacheOrServer } from "@/utils/get-firestore";
import { getServerSession } from "next-auth";
import { getPlaiceholder } from "plaiceholder";
import { Language } from "../global/language";
import { EbookCurrentBook } from "./ebook-current-book";
import { EbookOtherBooks } from "./ebook-other-books";

const getThumbnailsBlurData = async (imageUrl: string) => {
  try {
    if (imageUrl.startsWith("/assests/ebook")) return "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;";
    const { base64 } = await getPlaiceholder(imageUrl);
    return base64;
  } catch (error) {
    return "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;";
  }
}

async function getEbooks() {
  let books = await getDocsFromCacheOrServer<EBooks[]>("books", "timestamp", false);
  for (let i = 0; i < books.length; i++) {
    const book = books.at(i);
    if (!book) continue;
    books[i] = {
      ...book,
      thumbnail_blur: await getThumbnailsBlurData(book.thumbnail)
    } as any
  }
  return books;
}

const EbookContentWrapper = async ({ lang, className = "" }: { lang: LangCode; className?: string }) => {
  const books = await getEbooks();
  const account = await getServerSession(authOptions);
  if (_.isObject(account?.firestore.data.memberRef)) if (account?.firestore.data.memberRef.path) account!.firestore.data.memberRef = account?.firestore.data.memberRef.path as any;
  const currentBook = books.filter(b => !b.locked)[0];
  return (
    <>
      <div className={`flex flex-col ${className}`}>
        <EbookCurrentBook lang={lang} currentBook={currentBook} account={account?.firestore} />
        <EbookOtherBooks className="mt-28 md:mt-18" lang={lang} otherBooks={books.filter(b => b.name != currentBook.name).sort((a: EBooks, b: EBooks) => a.timestamp - b.timestamp)} account={account?.firestore} />
      </div>
      <div className="my-8 flex justify-end">
        <Language lang={lang} />
      </div>
    </>
  )
}

export const revalidate = 300;
export { EbookContentWrapper };
