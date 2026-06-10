import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

type Props = {}

const SaleBaner = (props: Props) => {

  const [banners, setBanners] = useState();
  const getBanners = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/setting/get-banner`)
    if (res.status == 200) {
      setBanners(res.data)
    }
  }
  useEffect(() => { getBanners() }, [])
  const { t, i18n } = useTranslation();


  return (
    <div className='w-full '>
      <div className=""></div>
      <div className="w-full flex  justify-center p-4">
        <div className='flex relative items-center mt-[50px] justify-center'>
          <div className='absolute top-0 left-0 
            bg-[rgba(0,0,0,.5)] flex justify-center flex-col items-center w-full h-full'>
            <h1 className='font-bold text-4xl p-2 text-white bg-gradient-to-r from-black to-gray-700'>{
              banners?.length > 0 && banners?.filter((i) => i.name == "shop banner")[banners?.filter((i) => i.name == "shop banner").length - 1]?.title
            }</h1>
          </div>
          {banners?.length > 0 && <img className='h-[300px]'
            src={`${banners?.filter((i) => i.name == "shop banner")[banners?.filter((i) => i.name == "shop banner").length - 1]?.img}`} />
          }

        </div>
      </div>
    </div>
  )
}

export default SaleBaner