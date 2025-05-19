"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  ActivityIcon as Function,
  Superscript,
  Subscript,
} from "lucide-react"

interface MathTextEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  height?: number | string
  className?: string
}

const MathTextEditor: React.FC<MathTextEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Start typing...",
  height = "300px",
  className = "",
}) => {
  const [value, setValue] = useState(initialValue)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue)
      if (editorRef.current) {
        editorRef.current.innerHTML = initialValue
      }
    }
  }, [initialValue, value])

  const handleChange = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      setValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    }
  }

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    handleChange()
    editorRef.current?.focus()
  }

  const insertSymbol = (symbol: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const textNode = document.createTextNode(symbol)
      range.deleteContents()
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)
    } else if (editorRef.current) {
      editorRef.current.innerHTML += symbol
    }
    handleChange()
    editorRef.current?.focus()
  }

  const insertMathEquation = (equation: string) => {
    // Insert equation with special styling
    const equationSpan = `<span class="math-equation" style="font-family: 'Times New Roman', serif; background-color: #f0f8ff; padding: 0 4px; border-radius: 2px;">${equation}</span>`
    document.execCommand("insertHTML", false, equationSpan)
    handleChange()
    editorRef.current?.focus()
  }

  // Common math symbols
  const basicSymbols = ["±", "×", "÷", "−", "∑", "∏", "√", "∛", "∜", "∞", "≈", "≠", "≤", "≥"]
  const greekLetters = ["α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "π", "σ", "φ", "ω", "Δ", "Π", "Σ", "Ω"]
  const commonEquations = [
    { name: "Quadratic Formula", equation: "x = (-b ± √(b² - 4ac)) / 2a" },
    { name: "Pythagorean Theorem", equation: "a² + b² = c²" },
    { name: "Area of Circle", equation: "A = πr²" },
    { name: "E = mc²", equation: "E = mc²" },
  ]

  return (
    <div className={`math-text-editor border rounded-md ${className}`}>
      <div className="toolbar flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button variant="ghost" size="icon" onClick={() => applyFormat("bold")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("italic")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("underline")} title="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("insertUnorderedList")} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("insertOrderedList")} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("justifyLeft")} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("justifyCenter")} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("justifyRight")} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("superscript")} title="Superscript">
          <Superscript className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("subscript")} title="Subscript">
          <Subscript className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1"></div>

        {/* Math Symbols Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Math Symbols">
              <Function className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Tabs defaultValue="symbols">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="symbols">Symbols</TabsTrigger>
                <TabsTrigger value="greek">Greek</TabsTrigger>
                <TabsTrigger value="equations">Equations</TabsTrigger>
              </TabsList>
              <TabsContent value="symbols" className="mt-2">
                <div className="grid grid-cols-7 gap-1">
                  {basicSymbols.map((symbol) => (
                    <Button
                      key={symbol}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="greek" className="mt-2">
                <div className="grid grid-cols-7 gap-1">
                  {greekLetters.map((symbol) => (
                    <Button
                      key={symbol}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="equations" className="mt-2">
                <div className="flex flex-col gap-2">
                  {commonEquations.map((eq) => (
                    <Button
                      key={eq.name}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => insertMathEquation(eq.equation)}
                    >
                      {eq.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <div className="border-l mx-1"></div>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("undo")} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => applyFormat("redo")} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-4 outline-none w-full overflow-auto"
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          minHeight: "200px",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleChange}
        onBlur={handleChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default MathTextEditor
