import React from 'react'
import ThreeDImage from '@/components/Cards/Card'
const page = () => {
    const image = { img: "/spider.jpg", depth: "/spider-depth.png" }
    const index = 0
  return (
    <div className='h-screen flex items-center justify-center w-full'><ThreeDImage image={image} index={index} /></div>
  )
}

export default page