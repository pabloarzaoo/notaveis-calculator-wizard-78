
import { useState } from "react";
import { Calculator, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [valueA, setValueA] = useState<string>("");
  const [valueB, setValueB] = useState<string>("");
  const [valueX, setValueX] = useState<string>("");
  const [valueY, setValueY] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const products = [
    {
      id: "quadrado-soma",
      title: "Quadrado da Soma",
      formula: "(a + b)²",
      description: "Expande o quadrado de uma soma",
      example: "(x + 3)² = x² + 6x + 9",
      icon: <Plus className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      type: "produto-notavel"
    },
    {
      id: "quadrado-diferenca",
      title: "Quadrado da Diferença",
      formula: "(a - b)²",
      description: "Expande o quadrado de uma diferença",
      example: "(x - 3)² = x² - 6x + 9",
      icon: <Minus className="h-6 w-6" />,
      color: "from-red-500 to-red-600",
      type: "produto-notavel"
    },
    {
      id: "produto-soma-diferenca",
      title: "Produto da Soma pela Diferença",
      formula: "(a + b)(a - b)",
      description: "Produto de soma e diferença",
      example: "(x + 3)(x - 3) = x² - 9",
      icon: <X className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      type: "produto-notavel"
    },
    {
      id: "cubo-soma",
      title: "Cubo da Soma",
      formula: "(a + b)³",
      description: "Expande o cubo de uma soma",
      example: "(x + 2)³ = x³ + 6x² + 12x + 8",
      icon: <Plus className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      type: "produto-notavel"
    },
    {
      id: "cubo-diferenca",
      title: "Cubo da Diferença",
      formula: "(a - b)³",
      description: "Expande o cubo de uma diferença",
      example: "(x - 2)³ = x³ - 6x² + 12x - 8",
      icon: <Minus className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600",
      type: "produto-notavel"
    },
    {
      id: "x-quadrado-mais-constante",
      title: "x² + constante",
      formula: "x² + c",
      description: "Calcula x² mais uma constante",
      example: "x² + 5",
      icon: <Plus className="h-6 w-6" />,
      color: "from-indigo-500 to-indigo-600",
      type: "funcao-algebrica"
    },
    {
      id: "xy-quadrado-mais-constante",
      title: "xy² + constante",
      formula: "xy² + c",
      description: "Calcula xy² mais uma constante",
      example: "xy² + 8",
      icon: <X className="h-6 w-6" />,
      color: "from-teal-500 to-teal-600",
      type: "funcao-algebrica"
    },
    {
      id: "constante-mais-xy-quadrado",
      title: "constante + xy²",
      formula: "c + xy²",
      description: "Calcula uma constante mais xy²",
      example: "25 + xy²",
      icon: <Plus className="h-6 w-6" />,
      color: "from-pink-500 to-pink-600",
      type: "funcao-algebrica"
    },
    {
      id: "x-quadrado-menos-y",
      title: "x² - y",
      formula: "x² - y",
      description: "Calcula x² menos y",
      example: "x² - y",
      icon: <Minus className="h-6 w-6" />,
      color: "from-cyan-500 to-cyan-600",
      type: "funcao-algebrica"
    }
  ];

  const calculateResult = () => {
    const selectedProductData = products.find(p => p.id === selectedProduct);
    
    if (selectedProductData?.type === "produto-notavel") {
      const a = parseFloat(valueA);
      const b = parseFloat(valueB);
      
      if (isNaN(a) || isNaN(b)) {
        setResult("Por favor, insira valores numéricos válidos para a e b");
        return;
      }

      let calculation = "";
      let steps = "";

      switch (selectedProduct) {
        case "quadrado-soma":
          const somaSquared = (a + b) ** 2;
          const somaExpanded = a**2 + 2*a*b + b**2;
          calculation = `(${a} + ${b})²`;
          steps = `= ${a}² + 2·${a}·${b} + ${b}²\n= ${a**2} + ${2*a*b} + ${b**2}\n= ${somaExpanded}`;
          break;
        case "quadrado-diferenca":
          const difSquared = (a - b) ** 2;
          const difExpanded = a**2 - 2*a*b + b**2;
          calculation = `(${a} - ${b})²`;
          steps = `= ${a}² - 2·${a}·${b} + ${b}²\n= ${a**2} - ${2*a*b} + ${b**2}\n= ${difExpanded}`;
          break;
        case "produto-soma-diferenca":
          const produto = (a + b) * (a - b);
          const produtoExpanded = a**2 - b**2;
          calculation = `(${a} + ${b})(${a} - ${b})`;
          steps = `= ${a}² - ${b}²\n= ${a**2} - ${b**2}\n= ${produtoExpanded}`;
          break;
        case "cubo-soma":
          const cuboSoma = (a + b) ** 3;
          const cuboSomaExpanded = a**3 + 3*a**2*b + 3*a*b**2 + b**3;
          calculation = `(${a} + ${b})³`;
          steps = `= ${a}³ + 3·${a}²·${b} + 3·${a}·${b}² + ${b}³\n= ${a**3} + ${3*a**2*b} + ${3*a*b**2} + ${b**3}\n= ${cuboSomaExpanded}`;
          break;
        case "cubo-diferenca":
          const cuboDif = (a - b) ** 3;
          const cuboDifExpanded = a**3 - 3*a**2*b + 3*a*b**2 - b**3;
          calculation = `(${a} - ${b})³`;
          steps = `= ${a}³ - 3·${a}²·${b} + 3·${a}·${b}² - ${b}³\n= ${a**3} - ${3*a**2*b} + ${3*a*b**2} - ${b**3}\n= ${cuboDifExpanded}`;
          break;
      }
      
      setResult(`${calculation}\n${steps}`);
    } else {
      // Funções algébricas
      const x = parseFloat(valueX);
      const y = parseFloat(valueY);
      
      if (isNaN(x)) {
        setResult("Por favor, insira um valor numérico válido para x");
        return;
      }

      if ((selectedProduct === "xy-quadrado-mais-constante" || selectedProduct === "constante-mais-xy-quadrado" || selectedProduct === "x-quadrado-menos-y") && isNaN(y)) {
        setResult("Por favor, insira um valor numérico válido para y");
        return;
      }

      let calculation = "";
      let numericResult = 0;

      switch (selectedProduct) {
        case "x-quadrado-mais-constante":
          const constant1 = 5;
          numericResult = x**2 + constant1;
          calculation = `x² + ${constant1} = ${x}² + ${constant1} = ${x**2} + ${constant1} = ${numericResult}`;
          break;
        case "xy-quadrado-mais-constante":
          const constant2 = 8;
          numericResult = x * (y**2) + constant2;
          calculation = `xy² + ${constant2} = ${x} × ${y}² + ${constant2} = ${x} × ${y**2} + ${constant2} = ${x * (y**2)} + ${constant2} = ${numericResult}`;
          break;
        case "constante-mais-xy-quadrado":
          const constant3 = 25;
          numericResult = constant3 + x * (y**2);
          calculation = `${constant3} + xy² = ${constant3} + ${x} × ${y}² = ${constant3} + ${x} × ${y**2} = ${constant3} + ${x * (y**2)} = ${numericResult}`;
          break;
        case "x-quadrado-menos-y":
          numericResult = x**2 - y;
          calculation = `x² - y = ${x}² - ${y} = ${x**2} - ${y} = ${numericResult}`;
          break;
      }
      
      setResult(calculation);
    }
  };

  const resetCalculation = () => {
    setValueA("");
    setValueB("");
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
            Produtos Notáveis e Funções Algébricas
          </p>
        </div>

        {/* Produtos Notáveis Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Produtos Notáveis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.filter(p => p.type === "produto-notavel").map((product) => (
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
        </div>

        {/* Funções Algébricas Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Funções Algébricas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {products.filter(p => p.type === "funcao-algebrica").map((product) => (
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
                {selectedProductData?.type === "produto-notavel" ? (
                  <>
                    <div>
                      <Label htmlFor="valueA" className="text-foreground">
                        Valor de a:
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
                        Valor de b:
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
                  </>
                ) : (
                  <>
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
                    
                    {(selectedProduct === "xy-quadrado-mais-constante" || selectedProduct === "constante-mais-xy-quadrado" || selectedProduct === "x-quadrado-menos-y") && (
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
                  </>
                )}
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateResult}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                disabled={
                  selectedProductData?.type === "produto-notavel" 
                    ? (!valueA || !valueB)
                    : (!valueX || ((selectedProduct === "xy-quadrado-mais-constante" || selectedProduct === "constante-mais-xy-quadrado" || selectedProduct === "x-quadrado-menos-y") && !valueY))
                }
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calcular
              </Button>

              {/* Result Display */}
              {result && (
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-primary mb-2">Resultado:</h3>
                  <p className="text-foreground font-mono text-sm leading-relaxed whitespace-pre-line">
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
