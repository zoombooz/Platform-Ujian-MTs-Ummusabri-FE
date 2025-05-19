"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
// import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface EquationInputProps {
  onInsert: (equation: string) => void
}

const EquationInput: React.FC<EquationInputProps> = ({ onInsert }) => {
  const [equation, setEquation] = useState("")
  const [preview, setPreview] = useState("")

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEquation(value)

    // Create a preview with superscripts and subscripts
    const formattedEquation = value
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³")
      .replace(/\^n/g, "ⁿ")
      .replace(/sqrt\(/g, "√(")
      .replace(/pi/g, "π")
      .replace(/alpha/g, "α")
      .replace(/beta/g, "β")
      .replace(/gamma/g, "γ")
      .replace(/delta/g, "δ")
      .replace(/theta/g, "θ")
      .replace(/sigma/g, "σ")
      .replace(/omega/g, "ω")

    setPreview(formattedEquation)
  }

  const handleInsert = () => {
    onInsert(preview || equation)
    setEquation("")
    setPreview("")
  }

  const commonSymbols = [
    { symbol: "±", name: "Plus-Minus" },
    { symbol: "×", name: "Multiply" },
    { symbol: "÷", name: "Divide" },
    { symbol: "−", name: "Minus" },
    { symbol: "√", name: "Square Root" },
    { symbol: "∑", name: "Sum" },
    { symbol: "∫", name: "Integral" },
    { symbol: "π", name: "Pi" },
    { symbol: "∞", name: "Infinity" },
    { symbol: "≈", name: "Approximately" },
    { symbol: "≠", name: "Not Equal" },
    { symbol: "≤", name: "Less Than or Equal" },
    { symbol: "≥", name: "Greater Than or Equal" },
  ]

  const insertSymbol = (symbol: string) => {
    setEquation(equation + symbol)
    handleEquationChange({ target: { value: equation + symbol } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="equation">Enter Equation</Label>
        <div className="flex space-x-2">
          <Input
            id="equation"
            value={equation}
            onChange={handleEquationChange}
            placeholder="Enter equation (e.g., E = mc^2)"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Symbols</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Tabs defaultValue="common">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="common">Common</TabsTrigger>
                  <TabsTrigger value="greek">Greek</TabsTrigger>
                </TabsList>
                <TabsContent value="common" className="mt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {commonSymbols.map((item) => (
                      <Button
                        key={item.symbol}
                        variant="outline"
                        size="sm"
                        title={item.name}
                        onClick={() => insertSymbol(item.symbol)}
                      >
                        {item.symbol}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="greek" className="mt-2">
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("α")}>
                      α (alpha)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("β")}>
                      β (beta)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("γ")}>
                      γ (gamma)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("δ")}>
                      δ (delta)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("ε")}>
                      ε (epsilon)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("θ")}>
                      θ (theta)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("λ")}>
                      λ (lambda)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("μ")}>
                      μ (mu)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("π")}>
                      π (pi)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("σ")}>
                      σ (sigma)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("φ")}>
                      φ (phi)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => insertSymbol("ω")}>
                      ω (omega)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {preview && (
        <div className="p-3 border rounded-md bg-gray-50">
          <Label className="text-sm text-gray-500 mb-1 block">Preview:</Label>
          <div className="font-serif text-lg">{preview}</div>
        </div>
      )}

      <Button onClick={handleInsert} disabled={!equation}>
        Insert Equation
      </Button>
    </div>
  )
}

export default EquationInput
