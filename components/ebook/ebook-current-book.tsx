import i18nDefault from '@/translation/ebook/zh.json';
import { AccountsUni, EBooks } from "@/types/firestore";
import { LangCode } from '@/types/i18n';
import i18n from '@/utils/i18n';
import { EbookBookCover } from './ebook-book-cover';
import { EbookModalWrapper } from './ebook-modal-wrapper';
import { EbookShelfHolder } from './ebook-shelf-holder';

const EbookCurrentBook = ({ lang, className = "", currentBook, account }: { lang: LangCode; className?: string; currentBook: EBooks; account: AccountsUni | undefined }) => {
  const t = new i18n<typeof i18nDefault>(lang, "ebook");
  return (
    <div className={`${className} block w-full mt-4`}>
      <div className="relative grid grid-flow-row gap-6 md:grid-cols-2 z-20 items-center justify-items-center">
        <div className="flex flex-col text-main">
          <h1 className="text-lg md:text-xl">{t._("current_periodical")}</h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium md:mt-1">{currentBook.title}</p>
          <p className='text-main/80 text-sm mt-3 md:mt-4'>{currentBook.description}</p>
          <p className='text-main text-sm hidden md:block mt-1'>{!currentBook.published ? t._("unpublished") : (checkOwnedBook(account!, currentBook.files.bookId) ? t._("immediate_download") : (currentBook.locked && currentBook.price ? `${t._("buy_periodical")} NTD ${currentBook.price}` : t._("free_download")))}</p>
        </div>
        <EbookModalWrapper lang={lang} book={currentBook} account={account} EbookBookCoverComponent={<EbookBookCover className='cursor-pointer' thumbnail={currentBook.thumbnail} thumbnail_blur={(currentBook as any).thumbnail_blur} title={currentBook.title} size="big" />} />
        <p className='absolute -bottom-[49px] mr-8 w-full text-right text-main/80 text-xs md:hidden'>{!currentBook.published ? t._("unpublished") : (checkOwnedBook(account!, currentBook.files.bookId) ? t._("immediate_download") : (currentBook.locked && currentBook.price ? `${t._("buy_periodical")} NTD ${currentBook.price}` : t._("free_download")))}</p>
      </div>
      <EbookShelfHolder />
    </div>
  )
}

export const checkOwnedBook = (profile: AccountsUni, bookId: string) => {
  if (profile) {
    if (profile.type === "Member") return true;
    else if (!profile.data.ownedBooks) return false;
    else if (profile.data.ownedBooks.includes(bookId)) return true;
  }
  return false;
}

export { EbookCurrentBook };
