import BestSell from '../components/BestSell'
import CategoriesShow from '../components/CategoriesShow'
import Footer from '../components/Footer'

import ShopScene from '../components/Shop'
type Props = {}

const Home = (props: Props) => {

  return (
    <div className='w-full overflow-hidden'>
      {/* <Intro/> */}
      <div className='w-screen h-[50vh] overflow-hidden'>

        <ShopScene />
      </div>
      <CategoriesShow />
      <BestSell />
      <div className=" m-2 flex justify-center">

        {/* <Subscribe/> */}
      </div>
      <Footer />
    </div>
  )
}

export default Home