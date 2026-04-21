'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMenuLinksAction } from '@/lib/features/menu/actions'
import { useEffect, useState } from 'react'
import DraggableLink from './draggable-link'

export default function DraggableLinksWrapper() {
  const [linkData, setLinkData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMenuLinksAction()
      setLinkData(data)
      console.log('234 data:', data)
    }
    fetchData()
  }, [])

  return (
    <Tabs defaultValue="pages" className=" rtl relative min-h-screen">
      <TabsList className="sticky top-0 w-full z-10">
        <TabsTrigger value="pages">Pages</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="pages" className="p-2">
        {linkData?.pages.map((page) => (
          <DraggableLink
            type="page"
            label={page.title}
            id={page.id}
            key={page.id}
          />
        ))}
      </TabsContent>
      <TabsContent value="tags">Tags</TabsContent>
      <TabsContent value="categories">Categories</TabsContent>
      <TabsContent value="posts">posts</TabsContent>
    </Tabs>
  )
}
