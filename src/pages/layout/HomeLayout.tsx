
// @ts-nocheck
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Outlet ,useSearchParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'


type Props = {}

const HomeLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [makeVisitor,setMakeVisitor]  = useState(0)
    const[isMounted,setIsMounted] = useState(true)
const [lang, setLang] = useState();
  useEffect(()=>{
    setLang(localStorage.getItem("lang"))},[])
 const sendHeartbeat = async()=>{

  const interval = setInterval(async() => {
    const tres = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/create-action`,{name:"status",description:"online"},{headers:
      {vToken: `Bearer ${localStorage?.getItem("vt")?.toString()}`}
    })
  }, 20000); // Send a heartbeat every 20 seconds

  return async() => {
    await axios.post(`${import.meta.env.VITE_SERVER}/visitor/create-action`,{name:"status",description:"offline"},{headers:
      {vToken: `Bearer ${localStorage.getItem("vt")}`}
    })
    clearInterval(interval);
  };

 }
 useEffect(()=>{
  sendHeartbeat()
 },[])
  const getDeactive = async()=>{
    const tres = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/deactive`,{isActive:true},{headers:
      {vToken: `Bearer ${localStorage.getItem("vt")}`}
    })
    
  }

  const visit = async() =>{
    const vt = localStorage.getItem("vt")

    if(vt){
      const tres = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/active`,{isActive:true,online:true},{headers:
        {headers:{vToken: `Bearer ${vt}`}}
      })
      

        const tress = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/create-action`,{name:"status",description:"open website"},{headers:
          {vToken: `Bearer ${localStorage.getItem("vt")}`}
        })
  
    }
    else{
      const channel = searchParams.get("channel")
      

        const tress = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/visit`,{channel:channel ? channel : "website",isActive:true,online:true})
        if(tress.status == 200 )
          {

            localStorage.setItem("vt",tress.data)
            const res1 = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/active`,{isActive:true,online:true},{headers:
              {vToken: `Bearer ${tress.data}`}
            })
            const res2 = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/get-user`,{},{headers:
              {vToken: `Bearer ${tress.data}`, Authorization:`Bearer ${Cookies.get('token')}`}
            })
          }
        
    }
    
  }


  useEffect(()=>{
    if(isMounted){

      visit()
      setIsMounted(false)
    }


  },[])
  return (
    <div className='w-full relative flex flex-col justify-center items-center'>
        <Navbar/>
        {/* THE PAGE */}
        <div className='w-full'>
       <Outlet lang={lang} />

        </div>
    </div>
  )
}

export default HomeLayout;