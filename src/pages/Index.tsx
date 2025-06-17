
import { useState } from "react";
import { Calculator, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [valueX, setValueX] = useState<string>("");
  const [valueY, setValueY] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const products = [
    {
      id: "x-quadrado-mais-constante",
      title: "x² + constante",
      formula: "x² + c",
      description: "Calcula x² mais uma constante",
      example: "x² + 5",
      icon: <Plus className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      needsY: false
    },
    {
      id: "xy-quadrado-mais-constante",
      title: "xy² + constante",
      formula: "xy² + c",
      description: "Calcula xy² mais uma constante",
      example: "xy² + 8",
      icon: <X className="h-6 w-6" />,
      color: "from-purple-600 to-purple-700",
      needsY: true
    },
    {
      id: "constante-mais-xy-quadrado",
      title: "constante + xy²",
      formula: "c + xy²",
      description: "Calcula uma constante mais xy²",
      example: "25 + xy²",
      icon: <Plus className="h-6 w-6" />,
      color: "from-purple-400 to-purple-500",
      needsY: true
    },
    {
      id: "x-quadrado-menos-y",
      title: "x² - y",
      formula: "x² - y",
      description: "Calcula x² menos y",
      example: "x² - y",
      icon: <Minus className="h-6 w-6" />,
      color: "from-purple-700 to-purple-800",
      needsY: true
    }
  ];

  const calculateResult = () => {
    const x = parseFloat(valueX);
    const y = parseFloat(valueY);
    
    if (isNaN(x)) {
      setResult("Por favor, insira um valor numérico válido para x");
      return;
    }

    const selectedProductData = products.find(p => p.id === selectedProduct);
    if (selectedProductData?.needsY && isNaN(y)) {
      setResult("Por favor, insira um valor numérico válido para y");
      return;
    }

    let calculation = "";
    let numericResult = 0;

    switch (selectedProduct) {
      case "x-quadrado-mais-constante":
        const constant1 = 5; // Exemplo: x² + 5
        numericResult = x**2 + constant1;
        calculation = `x² + ${constant1} = ${x}² + ${constant1} = ${x**2} + ${constant1} = ${numericResult}`;
        break;
      case "xy-quadrado-mais-constante":
        const constant2 = 8; // Exemplo: xy² + 8
        numericResult = x * (y**2) + constant2;
        calculation = `xy² + ${constant2} = ${x} × ${y}² + ${constant2} = ${x} × ${y**2} + ${constant2} = ${x * (y**2)} + ${constant2} = ${numericResult}`;
        break;
      case "constante-mais-xy-quadrado":
        const constant3 = 25; // Exemplo: 25 + xy²
        numericResult = constant3 + x * (y**2);
        calculation = `${constant3} + xy² = ${constant3} + ${x} × ${y}² = ${constant3} + ${x} × ${y**2} = ${constant3} + ${x * (y**2)} = ${numericResult}`;
        break;
      case "x-quadrado-menos-y":
        numericResult = x**2 - y;
        calculation = `x² - y = ${x}² - ${y} = ${x**2} - ${y} = ${numericResult}`;
        break;
    }
    
    setResult(calculation);
  };

  const resetCalculation = () => {
    setValueX("");
    setValueY("");
    setResult("");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    resetCalculation();
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-foreground">
              Calculadora Algébrica
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calcule expressões algébricas com variáveis x e y
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                  <CardTitle className="text-foreground text-lg">
                    {product.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="bg-muted p-4 rounded-lg border border-border mb-2">
                  <code className="text-primary text-lg font-mono font-medium">
                    {product.formula}
                  </code>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Exemplo: {product.example}
                </div>
                <Button 
                  className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90 text-white font-semibold`}
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

        {/* Calculator Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={closeModal}>
          <DialogContent className="bg-card border-border text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-primary">
                {selectedProductData?.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Formula Display */}
              <div className="bg-muted p-4 rounded-lg border border-border text-center">
                <code className="text-primary text-lg font-mono font-medium">
                  {selectedProductData?.example}
                </code>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="valueX" className="text-foreground">
                    Valor de x:
                  </Label>
                  <Input
                    id="valueX"
                    type="number"
                    value={valueX}
                    onChange={(e) => setValueX(e.target.value)}
                    placeholder="Digite o valor de x"
                    className="bg-background border-border text-foreground mt-2"
                  />
                </div>
                
                {selectedProductData?.needsY && (
                  <div>
                    <Label htmlFor="valueY" className="text-foreground">
                      Valor de y:
                    </Label>
                    <Input
                      id="valueY"
                      type="number"
                      value={valueY}
                      onChange={(e) => setValueY(e.target.value)}
                      placeholder="Digite o valor de y"
                      className="bg-background border-border text-foreground mt-2"
                    />
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateResult}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                disabled={!valueX || (selectedProductData?.needsY && !valueY)}
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
