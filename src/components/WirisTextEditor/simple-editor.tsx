"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react"

interface SimpleEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  height?: number | string
  className?: string
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Start typing...",
  height = "300px",
  className = "",
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerHTML
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
  }

  return (
    <Card className={className}>
      <CardHeader className="p-2 border-b">
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="icon" onClick={() => applyFormat("bold")} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("italic")} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("insertUnorderedList")} title="Bullet List">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("insertOrderedList")} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="border-l mx-1"></div>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("undo")} title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat("redo")} title="Redo">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          contentEditable
          className="p-4 outline-none w-full overflow-auto"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleChange}
          placeholder={placeholder}
        />
      </CardContent>
    </Card>
  )
}

export default SimpleEditor
