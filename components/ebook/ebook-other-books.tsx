import i18nDefault from '@/translation/ebook/zh.json';
import { AccountsUni, EBooks } from "@/types/firestore";
import { LangCode } from '@/types/i18n';
import i18n from '@/utils/i18n';
import { EbookBookCover } from './ebook-book-cover';
import { checkOwnedBook } from './ebook-current-book';
import { EbookModalWrapper } from './ebook-modal-wrapper';

const EbookOtherBooks = ({ lang, className = "", otherBooks, account }: { lang: LangCode; className?: string; otherBooks: EBooks[]; account: AccountsUni | undefined }) => {
  const t = new i18n<typeof i18nDefault>(lang, "ebook");
  return (
    <div className={`${className} grid ${otherBooks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"} gap-6 justify-items-center my-4 px-8 py-12 bg-background2 rounded`}>
      {otherBooks.map((book, key) => (
        <EbookModalWrapper lang={lang} book={book} account={account} EbookBookCoverComponent={
          <div className={`${book.published ? "cursor-pointer" : "cursor-not-allowed"} relative flex flex-col items-center px-6 py-4 space-y-2 rounded-lg hover:bg-background/60 transition-all duration-500 group`}>
            {!book.published && <span className="absolute top-[40%] z-30 text-main bg-background/90 px-3 py-2 rounded-lg font-bold">{t._("unpublished_waiting")}</span>}
            <div className={`${book.published ? "" : "blur-sm"}`}>
              {/* @ts-expect-error Server Component */}
              <EbookBookCover thumbnail={book.thumbnail} title={book.title} size="small" key={key} />
            </div>
            <p className='text-main font-medium group-hover:text-main2 group-hover:font-bold transition-all duration-500'>{book.title}</p>
            <p className='text-main text-xs !-mt-0.5 group-hover:text-main2 transition-all duration-500'>{!book.published ? t._("unpublished") : (checkOwnedBook(account!, book.files.bookId) ? t._("immediate_download") : (book.locked && book.price ? `${t._("buy_periodical")} NTD ${book.price}` : t._("free_download")))}</p>
          </div>
        } key={key} />
      ))}
    </div>
  )
}

export { EbookOtherBooks };
