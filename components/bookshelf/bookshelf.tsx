'use client';
import i18nDefault2 from "@/translation/ebook/zh.json";
import i18nDefault from "@/translation/recommend/zh.json";
import { Account, EBooks } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import i18n from "@/utils/i18n";
import Link from "next/link";
import { useRef, useState } from "react";
import { EbookBookCover } from "../ebook/ebook-book-cover";
import { checkOwnedBook } from "../ebook/ebook-current-book";
import { EbookModalWrapper } from "../ebook/ebook-modal-wrapper";

const BookshelfElement = ({ className = "", books, account, lang }: { className?: string; books: EBooks[]; account: Account | undefined; lang: LangCode }) => {
  const t = new i18n<typeof i18nDefault>(lang, "recommend");
  const t2 = new i18n<typeof i18nDefault2>(lang, "ebook");
  return (
    <div className={`${className} `}>
      <div className="text-main mb-4 md:mb-9 flex flex-row items-baseline justify-between">
        <span className="text-lg md:text-3xl font-medium">電子書庫</span>
        <Link href={webInfo.webMap.posts.href} className="cursor-pointer hover:scale-105 hover:-translate-x-1 transition-all">
          <span className="text-main2 text-xs md:text-base font-light">{t._("recommend_more")}</span>
        </Link>
      </div>
      <div className="flex flex-row no-scrollbar overflow-x-scroll px-4 md:px-12 md:pt-[-2em] border-2 space-x-24 border-main ">
        {books.map((book, key) => (
          <EbookModalWrapper lang={lang} book={book} account={account} EbookBookCoverComponent={
            <div className={`${book.published ? "cursor-pointer" : "cursor-not-allowed"} relative flex flex-col items-center px-6 py-4 space-y-2 rounded-lg hover:bg-background/60 transition-all duration-500 group`}>
              {!book.published && <span className="absolute top-[40%] z-30 text-main bg-background/90 px-3 py-2 rounded-lg font-bold">{t2._("unpublished_waiting")}</span>}
              <div className={`${book.published ? "" : "blur-sm"}`}>
                <EbookBookCover thumbnail={book.thumbnail} thumbnail_blur={(book as any).thumbnail_blur} title={book.title} size="small" key={key} />
              </div>
              <p className='text-main font-medium group-hover:text-main2 group-hover:font-bold transition-all duration-500'>{book.title}</p>
              <p className='text-main text-xs !-mt-0.5 group-hover:text-main2 transition-all duration-500'>{!book.published ? t2._("unpublished") : (checkOwnedBook(account!, book.files.bookId) ? t2._("immediate_download") : (book.locked && book.price ? `${t2._("buy_periodical")} NTD ${book.price}` : t2._("free_download")))}</p>
            </div>
          } key={key} />
        ))
        }
      </div>
    </div>
  )
}

export { BookshelfElement };
