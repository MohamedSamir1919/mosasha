import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

interface IBannerItem {
    name: string;
    title: string;
    img: string;
    // Add other properties if they exist in your banner data
}

type Props = {}
const CategoriesShow = (props: Props) => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const [banners, setBanners] = useState<IBannerItem[]>([]);
    const getBanners = async () => {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/setting/get-banner`)
        if (res.status == 200) {
            console.log("res", res.data)
            setBanners(res.data)
        }
    }
    useEffect(() => {
        if (!banners || banners.length === 0) {

            getBanners()
        }
    }, [banners])
    // useEffect(() => { console.log(banners) }, [banners])
    let [lastMenBanner, setLastMenBanner] = useState<IBannerItem | null>(null);
    let [lastWomenBanner, setLastWomenBanner] = useState<IBannerItem | null>(null);
    useEffect(() => {

        const menBanners = banners?.length > 0 ? banners?.filter((i) => i.name == "men banner") : []
        setLastMenBanner(menBanners[menBanners.length - 1])

        const womenBanners = banners?.length > 0 ? banners?.filter((i) => i.name == "women banner") : [];
        const lastWomenBanner = womenBanners[womenBanners.length - 1];
        setLastWomenBanner(lastWomenBanner);
    }, [banners])

    return (
        <div className="w-full grid grid-cols-2 relative">
            <div className="col-span-1 relative z-[1] max-h-[90vh] overflow-hidden">
                <div className="absolute z-[10] flex justify-center items-center top-0
             hover:bg-[rgba(0,0,0,.4)] md:opacity-0 opacity-100 hover:opacity-100 left-0 w-full h-full">
                    {lastMenBanner && (
                        <div
                            onClick={() => { navigate(`/shopping?cat=${lastMenBanner.title}`) }}

                            onMouseOver={(e) => {
                                const btn = e.currentTarget; // Use currentTarget for the specific div
                                const ripple = document.createElement("span");

                                // Add ripple class to span
                                ripple.classList.add("ripple");

                                // Add span to the div
                                btn?.appendChild(ripple);

                                // Get position of X
                                const x = e.clientX - btn.getBoundingClientRect().left;

                                // Get position of Y
                                const y = e.clientY - btn.getBoundingClientRect().top;

                                // Position the span element
                                ripple.style.left = `${x}px`;
                                ripple.style.top = `${y}px`;

                                // Remove span after 0.3s
                                setTimeout(() => {
                                    ripple.remove();
                                }, 300);

                            }}
                            className="font-black men px-8  cursor-pointer bg-gradient-to-r text-gray-400 from-gray-700  to-black rounded-lg text-[32px]">
                            {lastMenBanner.title}
                        </div>
                    )}
                </div>

                {lastMenBanner && (
                    <img className="min-w-full w-auto h-full"
                        alt="loading"
                        src={`${lastMenBanner.img}`} />
                )}
            </div>
            <div className="col-span-1 relative women max-h-[90vh] overflow-hidden">
                {lastWomenBanner && (
                    <div

                        className="absolute flex z-10 justify-center items-center top-0
         hover:bg-[rgba(0,0,0,.4)] md:opacity-0 
         hover:md:opacity-100 opacity-100 left-0 w-full h-full">

                        <div
                            onClick={() => { navigate(`/shopping?cat=${lastWomenBanner.title}`) }}

                            onMouseOver={(e) => {
                                const btn = e.currentTarget; // Use currentTarget for the specific div
                                const ripple = document.createElement("span");

                                // Add ripple class to span
                                ripple.classList.add("ripple");

                                // Add span to the div
                                btn?.appendChild(ripple);

                                // Get position of X
                                const x = e.clientX - btn.getBoundingClientRect().left;

                                // Get position of Y
                                const y = e.clientY - btn.getBoundingClientRect().top;

                                // Position the span element
                                ripple.style.left = `${x}px`;
                                ripple.style.top = `${y}px`;

                                // Remove span after 0.3s
                                setTimeout(() => {
                                    ripple.remove();
                                }, 300);

                            }}
                            className="font-black women-btn cursor-pointer px-8 bg-gradient-to-r from-black to-gray-700 text-gray-400 rounded-lg text-[32px]">
                            {lastWomenBanner?.title}
                        </div>
                    </div>
                )}
                {lastWomenBanner && (
                    <img className="w-full"
                        alt="loading"
                        src={lastWomenBanner?.img} />
                )}
            </div>
            <div className="col-span-2 relative z-[1] max-h-[90vh] overflow-hidden">
                <div className="absolute z-[10] flex justify-center items-center top-0
             hover:bg-[rgba(0,0,0,.4)] md:opacity-0 opacity-100 hover:opacity-100 left-0 w-full h-full">
                    <div
                        onClick={() => { navigate('/about') }}
                        onMouseOver={(e) => {
                            const btn = e.currentTarget; // Use currentTarget for the specific div
                            const ripple = document.createElement("span");

                            // Add ripple class to span
                            ripple.classList.add("ripple");

                            // Add span to the div
                            btn?.appendChild(ripple);

                            // Get position of X
                            const x = e.clientX - btn.getBoundingClientRect().left;

                            // Get position of Y
                            const y = e.clientY - btn.getBoundingClientRect().top;

                            // Position the span element
                            ripple.style.left = `${x}px`;
                            ripple.style.top = `${y}px`;

                            // Remove span after 0.3s
                            setTimeout(() => {
                                ripple.remove();
                            }, 300);

                        }}
                        className="font-black men px-8  cursor-pointer bg-gradient-to-r text-gray-400 from-gray-700  to-black rounded-lg text-[32px]">{t("who are we ?")}</div>
                </div>
                <img className="w-full" src='/mosasha/pngwing.com.png' />
            </div>
        </div>
    )
}

export default CategoriesShow