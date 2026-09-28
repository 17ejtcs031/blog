import { Suspense } from 'react'
import EditorPage from './editor-page'

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading editor...</div>}>
      <EditorPage />
    </Suspense>
  )
}
