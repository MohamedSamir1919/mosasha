import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
const Orders = () => {
    const [orders,setOrders] = useState();
    const [income,setIncome] = useState();
   
          const [users,setUsers] = useState();
            const [products, setProducts] = useState([]);
            const [slugs, setSlugs] = useState([]);
     const getProducts = async () => {
              const res = await axios.get(`${import.meta.env.VITE_SERVER}/products`);
              if (res.status == 200 ) {
                setProducts(res.data);
                
              } else {
          
              }
            };
            const getSlugs = async () => {
              const res = await axios.get(`${import.meta.env.VITE_SERVER}/slug`);
              if (res.status == 200 ) {
                setSlugs(res.data);
                
              } else {
          
              }
            };
  const getUsers = async()=>{
           const res = await axios.post(`${import.meta.env.VITE_SERVER}/user/get-users`,
             {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
           if(res.status == 200){
             setUsers(res.data)
           }
         }
const getOrders = async()=>{
        const res = await axios.post(`${import.meta.env.VITE_SERVER}/order/get-orders`,
          {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
        if(res.status == 200){
          setOrders(res.data)
        }
      }
         const getIncome = async()=>{
            const res = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/get`,
              {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
            if(res.status == 200){
              setIncome(res.data)
            }
          }
      useEffect(()=>{
        getOrders();
        getIncome();
        getUsers();
        getProducts();
        getSlugs();
      },[])
  return (<div className="p-6 bg-gray-50 ml-[150px] md:ml-0 min-h-screen">
      <div className="max-w-6xl ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent orders</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Short ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">item</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Visitor</th>
                <th className="p-4 text-sm font-semibold text-gray-600">details</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Created At</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">slug</th>
              </tr>
            </thead>
            <tbody>
              {orders?.sort((a,b)=> {return new Date(b.createdAt) - new Date(a.createdAt)}).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  {/* Last 4 chars of ID */}
                  <td className="p-4 text-sm font-mono text-indigo-600">
                    #{income?.filter((i)=>{
                      return i._id == order.invoice
                    })[0]._id.toString().slice(-4)}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {products?.filter((p)=> {return p.slug == order.slug})[0]?.title}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{users?.filter((u)=> {return income?.filter((i)=>i.visitor == u.visitor && i._id == order.invoice)})[0]?.firstName}</td>
                  
                  <td className="p-4">
                    <div className="px-2 py-1 flex flex-col text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {order.details.map((a)=>{
                                          {
                                           return Object.entries(a).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
                {key}:
              </span>
              <span className="text-gray-600 font-mono">
                {value}
              </span>
            </div>
          ))
                                            
                                          }
                                        })}
            <div  className="flex items-center gap-2">

              <span className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
                
                quantity:
                </span>
                                        <span className="text-gray-600 font-mono">
                 {order.quantity}
              </span>
                    </div>
                    </div>
                  </td>
                  
                  {/* Formatted Date: Jan 22, 2026 */}
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
  <td className="p-4 text-sm text-gray-500">
                    {slugs?.filter((s)=> s._id == order.slug)[0]?.code}
                  </td>
                   
  


                  {/* Frozen Button Logic */}
                  {/* <td className="p-4 text-right">
                    <button
                      onClick={() => handleProcess(order._id)}
                      disabled={loadingId === order._id}
                      className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                        loadingId === order._id 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {loadingId === order._id ? 'Processing...' : 'Run Equation'}
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders
