import BestSell from '../components/BestSell'
import CategoriesShow from '../components/CategoriesShow'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import React, { useEffect, useState } from 'react'
import Subscribe from '../components/Subscribe'
import { useTranslation } from 'react-i18next';
import ShopScene from '../components/Shop'
import axios from 'axios'
type Props = {}

const Home = (props: Props) => {
    const [openNav, setOpenNav] = useState(true)
    const [categories, setCategories] = useState(
      "spare parts cars"
  
    )
    const [items, setItems] = useState([])
   
    const getItems= async()=>{
      const res = await axios.get("/mosa/api/resource/Item"
        ,
        {
        params: {
      fields: '["item_code", "item_name", "description","image"]' // بلاش تطلب الفيلدز بتاعة الحسابات أو التكلفة
    }}
  
      )
      res.status == 200 ? setItems(res.data):""
       console.log(res.status,res.data)
    }
  useEffect(()=>{
    getItems()
  },[])
  
  return (
    <div className='w-full overflow-hidden'>
        {/* <Intro/> */}
         <div className='w-screen h-[50vh] overflow-hidden'>

        <ShopScene/>
      </div>
        <CategoriesShow/>
        <BestSell/>
        <div className=" m-2 flex justify-center">

        {/* <Subscribe/> */}
        </div>
        <Footer/>
    </div>
  )
}

export default Home