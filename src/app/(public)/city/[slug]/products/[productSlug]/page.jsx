import React from 'react'

const page = async ({params}) => {
  const { productSlug } = await params;
  return (
    <div className='mt-20'>
      {productSlug}
    </div>
  )
}

export default page
