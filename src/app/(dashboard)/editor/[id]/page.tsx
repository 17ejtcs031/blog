'use client'
import React, { Suspense } from 'react'
import EditorPage from '../editor-page'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading editor...</div>}>
      <EditorPage postId={resolvedParams.id} />
    </Suspense>
  )
}
