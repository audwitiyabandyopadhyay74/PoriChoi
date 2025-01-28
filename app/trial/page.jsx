"use client"
import React,{useRef} from 'react'
import Form from '../Components/Form'

const page = () => {
  const tab1contentref = useRef(null)
  const tab2contentref = useRef(null)
  
  const handleTab1 = () => {
    tab1contentref.current.classList.remove('hidden')
    tab1contentref.current.classList.add('block')
    tab2contentref.current.classList.add('hidden')
  }

  const handleTab2 = () => {
    tab2contentref.current.classList.remove('hidden')
    tab2contentref.current.classList.add('block')
    tab1contentref.current.classList.add('hidden')
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100 flex-col'> 
        <Form/>
    Make Tabs
<div className="w-[80%]  h-96 bg-white rounded-lg">
  <div className="tabs bg-gray-200 h-24 w-full">
    <button className='h-24 w-[30%] text-2xl' onClick={handleTab1}>tab 1</button>
    <button className='h-24 w-[30%] text-2xl' onClick={handleTab2}>tab 2</button>
  </div>
<div className="tab1-content" ref={tab1contentref}>
  Hi There
</div>
<div className='tab2 content hidden' ref={tab2contentref}>
Hello
</div>

</div>

    </div>
  )
}

export default page