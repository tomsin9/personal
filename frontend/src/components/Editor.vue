
<script setup>
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import { Markdown } from 'tiptap-markdown'
  import { watch } from 'vue'
  import { Button } from '@/components/ui/button'
  import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    Minus,
    Undo2,
    Redo2,
  } from 'lucide-vue-next'

  const props = defineProps({
    modelValue: String
  })
  const emit = defineEmits(['update:modelValue'])

  const isActive = (name, attrs = {}) =>
    editor.value?.isActive(name, attrs) ? 'secondary' : 'ghost'

  const editor = useEditor({
    extensions: [
        StarterKit,
        Markdown.configure({
            html: false,
            bulletListMarker: '-',
            orderedListMarker: '.',
        }),
    ],
    content: props.modelValue,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[250px] focus:outline-none text-foreground'
      }
    },
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.storage.markdown.getMarkdown())
    }
  })

  watch(() => props.modelValue, (value) => {
    if (editor.value?.storage.markdown.getMarkdown() === value) return
    editor.value?.commands.setContent(value, false)
  })
</script>

<template>
  <div class="rounded-md border bg-background">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1">
      <Button
        type="button"
        size="sm"
        :variant="isActive('bold')"
        @click="editor.chain().focus().toggleBold().run()"
        class="h-8 w-8 p-0"
      >
        <Bold class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('italic')"
        @click="editor.chain().focus().toggleItalic().run()"
        class="h-8 w-8 p-0"
      >
        <Italic class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('strike')"
        @click="editor.chain().focus().toggleStrike().run()"
        class="h-8 w-8 p-0"
      >
        <Strikethrough class="h-4 w-4" />
      </Button>
      <span class="w-px h-5 bg-border mx-0.5" aria-hidden="true" />
      <Button
        type="button"
        size="sm"
        :variant="isActive('heading', { level: 1 })"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('heading', { level: 2 })"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('heading', { level: 3 })"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </Button>
      <span class="w-px h-5 bg-border mx-0.5" aria-hidden="true" />
      <Button
        type="button"
        size="sm"
        :variant="isActive('bulletList')"
        @click="editor.chain().focus().toggleBulletList().run()"
        class="h-8 w-8 p-0"
      >
        <List class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('orderedList')"
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="h-8 w-8 p-0"
      >
        <ListOrdered class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        :variant="isActive('blockquote')"
        @click="editor.chain().focus().toggleBlockquote().run()"
        class="h-8 w-8 p-0"
      >
        <Quote class="h-4 w-4" />
      </Button>
      <span class="w-px h-5 bg-border mx-0.5" aria-hidden="true" />
      <Button
        type="button"
        size="sm"
        :variant="isActive('codeBlock')"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        class="h-8 w-8 p-0"
      >
        <Code class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="h-8 w-8 p-0"
      >
        <Minus class="h-4 w-4" />
      </Button>
      <span class="w-px h-5 bg-border mx-0.5" aria-hidden="true" />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        @click="editor.chain().focus().undo().run()"
        class="h-8 w-8 p-0"
      >
        <Undo2 class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        @click="editor.chain().focus().redo().run()"
        class="h-8 w-8 p-0"
      >
        <Redo2 class="h-4 w-4" />
      </Button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>
  
<style>
  /* 修正 Tiptap 內部的點擊範圍 */
  .ProseMirror {
    min-height: 250px;
  }
</style>