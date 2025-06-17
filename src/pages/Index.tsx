import { useState } from "react";
import { Calculator, Plus, Minus, X, FunctionSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolicInput from "@/components/SymbolicInput";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [valueA, setValueA] = useState<string>("");
  const [valueB, setValueB] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const products = [
    {
      id: "quadrado-soma",
      title: "Quadrado da Soma",
      formula: "(a+b)² = a² + 2ab + b²",
      description: "Expande o quadrado de uma soma",
      icon: <Plus className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "quadrado-diferenca",
      title: "Quadrado da Diferença",
      formula: "(a-b)² = a² - 2ab + b²",
      description: "Expande o quadrado de uma diferença",
      icon: <Minus className="h-6 w-6" />,
      color: "from-purple-600 to-purple-700"
    },
    {
      id: "produto-soma-diferenca",
      title: "Produto da Soma pela Diferença",
      formula: "(a+b)(a-b) = a² - b²",
      description: "Produto de soma por diferença",
      icon: <X className="h-6 w-6" />,
      color: "from-purple-400 to-purple-500"
    }
  ];

  const calculateResult = () => {
    const a = parseFloat(valueA);
    const b = parseFloat(valueB);
    
    if (isNaN(a) || isNaN(b)) {
      setResult("Por favor, insira valores numéricos válidos");
      return;
    }

    let calculation = "";
    let numericResult = 0;

    switch (selectedProduct) {
      case "quadrado-soma":
        numericResult = (a + b) ** 2;
        calculation = `(${a}+${b})² = ${a}² + 2(${a})(${b}) + ${b}² = ${a**2} + ${2*a*b} + ${b**2} = ${numericResult}`;
        break;
      case "quadrado-diferenca":
        numericResult = (a - b) ** 2;
        calculation = `(${a}-${b})² = ${a}² - 2(${a})(${b}) + ${b}² = ${a**2} - ${2*a*b} + ${b**2} = ${numericResult}`;
        break;
      case "produto-soma-diferenca":
        numericResult = a**2 - b**2;
        calculation = `(${a}+${b})(${a}-${b}) = ${a}² - ${b}² = ${a**2} - ${b**2} = ${numericResult}`;
        break;
    }
    
    setResult(calculation);
  };

  const resetCalculation = () => {
    setValueA("");
    setValueB("");
    setResult("");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    resetCalculation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">
              Produtos Notáveis
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calcule e visualize os principais produtos notáveis da álgebra com valores numéricos ou expressões simbólicas
          </p>
        </div>

        {/* Tabs para diferentes modos */}
        <Tabs defaultValue="numeric" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="numeric" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Calculadora Numérica</span>
            </TabsTrigger>
            <TabsTrigger value="symbolic" className="flex items-center space-x-2">
              <FunctionSquare className="h-4 w-4" />
              <span>Calculadora Simbólica</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculadora Numérica */}
          <TabsContent value="numeric">
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  className="relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg"
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <CardHeader className="relative">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${product.color} text-white`}>
                        {product.icon}
                      </div>
                      <CardTitle className="text-foreground text-xl">
                        {product.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="bg-muted p-4 rounded-lg border border-border">
                      <code className="text-primary text-lg font-mono font-medium">
                        {product.formula}
                      </code>
                    </div>
                    <Button 
                      className={`w-full mt-4 bg-gradient-to-r ${product.color} hover:opacity-90 text-white font-semibold`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product.id);
                      }}
                    >
                      Calcular
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calculadora Simbólica */}
          <TabsContent value="symbolic">
            <SymbolicInput />
          </TabsContent>
        </Tabs>

        {/* Calculator Modal - apenas para modo numérico */}
        <Dialog open={!!selectedProduct} onOpenChange={closeModal}>
          <DialogContent className="bg-card border-border text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-primary">
                {products.find(p => p.id === selectedProduct)?.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Formula Display */}
              <div className="bg-muted p-4 rounded-lg border border-border text-center">
                <code className="text-primary text-lg font-mono font-medium">
                  {products.find(p => p.id === selectedProduct)?.formula}
                </code>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="valueA" className="text-foreground">
                    Escolha o valor de a:
                  </Label>
                  <Input
                    id="valueA"
                    type="number"
                    value={valueA}
                    onChange={(e) => setValueA(e.target.value)}
                    placeholder="Digite o valor de a"
                    className="bg-background border-border text-foreground mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="valueB" className="text-foreground">
                    Escolha o valor de b:
                  </Label>
                  <Input
                    id="valueB"
                    type="number"
                    value={valueB}
                    onChange={(e) => setValueB(e.target.value)}
                    placeholder="Digite o valor de b"
                    className="bg-background border-border text-foreground mt-2"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateResult}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                disabled={!valueA || !valueB}
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calcular
              </Button>

              {/* Result Display */}
              {result && (
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-primary mb-2">Resultado:</h3>
                  <p className="text-foreground font-mono text-sm leading-relaxed break-all">
                    {result}
                  </p>
                </div>
              )}

              {/* Reset Button */}
              <Button 
                onClick={resetCalculation}
                variant="outline"
                className="w-full border-border text-muted-foreground hover:bg-muted"
              >
                Limpar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
