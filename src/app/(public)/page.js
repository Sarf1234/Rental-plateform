export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import CategoriesSection from '@/components/layout/CategoriesSection'
import FeaturedCategories from '@/components/layout/FeaturedCategories'
import Hero from '@/components/layout/Hero'
import HomePosts from '@/components/layout/HomePosts'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <HomePosts />
      <CategoriesSection />
    </div>
  )
}

export default page
