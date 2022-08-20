import { useEffect, useState } from 'react';
import { RiArrowUpCircleFill } from 'react-icons/ri';

function ScrollToTop() {
    const [top, setTop] = useState("hidden")
    useEffect(() => {
        window.onscroll = function () {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                setTop('block')
            } else {
                setTop('hidden')
            }
        };
    })
    function backTop(e: any) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <button type="button" onClick={(e) => backTop(e)} className={`${top} group inline-block fixed p-3 m-4 bg-background2 text-blue font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-background2 hover:shadow-lg focus:bg-background2 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-background2 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5`}>
            <RiArrowUpCircleFill className="w-8 h-8 group-hover:animate-spin text-main2" />
        </button>
    )
}

export default ScrollToTop;