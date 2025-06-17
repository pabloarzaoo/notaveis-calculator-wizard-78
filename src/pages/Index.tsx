
import { useState } from "react";
import { Calculator, Plus, Minus, X, Superscript } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [valueA, setValueA] = useState<string>("");
  const [valueB, setValueB] = useState<string>("");
  const [exponentA, setExponentA] = useState<string>("1");
  const [exponentB, setExponentB] = useState<string>("1");
  const [result, setResult] = useState<string>("");

  const products = [
    {
      id: "quadrado-soma",
      title: "Quadrado da Soma",
      formula: "(a + b)²",
      description: "Expande o quadrado de uma soma",
      example: "(x + 3)² = x² + 6x + 9",
      icon: <Plus className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "quadrado-diferenca",
      title: "Quadrado da Diferença",
      formula: "(a - b)²",
      description: "Expande o quadrado de uma diferença",
      example: "(x - 3)² = x² - 6x + 9",
      icon: <Minus className="h-6 w-6" />,
      color: "from-red-500 to-red-600"
    },
    {
      id: "produto-soma-diferenca",
      title: "Produto da Soma pela Diferença",
      formula: "(a + b)(a - b)",
      description: "Produto de soma e diferença",
      example: "(x + 3)(x - 3) = x² - 9",
      icon: <X className="h-6 w-6" />,
      color: "from-green-500 to-green-600"
    }
  ];

  const formatTerm = (value: string, exponent: string) => {
    const exp = parseInt(exponent) || 1;
    if (exp === 1) return value;
    return `${value}^${exp}`;
  };

  const calculateResult = () => {
    const selectedProductData = products.find(p => p.id === selectedProduct);
    
    if (!selectedProductData) return;

    // Verifica se são valores numéricos
    const aIsNumeric = !isNaN(parseFloat(valueA)) && isFinite(parseFloat(valueA));
    const bIsNumeric = !isNaN(parseFloat(valueB)) && isFinite(parseFloat(valueB));

    if (aIsNumeric && bIsNumeric) {
      // Cálculo numérico
      const a = parseFloat(valueA);
      const b = parseFloat(valueB);
      const expA = parseInt(exponentA) || 1;
      const expB = parseInt(exponentB) || 1;

      let calculation = "";
      let steps = "";

      switch (selectedProduct) {
        case "quadrado-soma":
          const aWithExp = Math.pow(a, expA);
          const bWithExp = Math.pow(b, expB);
          const somaResult = Math.pow(aWithExp + bWithExp, 2);
          calculation = `(${formatTerm(valueA, exponentA)} + ${formatTerm(valueB, exponentB)})²`;
          steps = `= (${aWithExp} + ${bWithExp})²\n= ${Math.pow(aWithExp + bWithExp, 2)}`;
          break;
        case "quadrado-diferenca":
          const aWithExpDif = Math.pow(a, expA);
          const bWithExpDif = Math.pow(b, expB);
          calculation = `(${formatTerm(valueA, exponentA)} - ${formatTerm(valueB, exponentB)})²`;
          steps = `= (${aWithExpDif} - ${bWithExpDif})²\n= ${Math.pow(aWithExpDif - bWithExpDif, 2)}`;
          break;
        case "produto-soma-diferenca":
          const aWithExpProd = Math.pow(a, expA);
          const bWithExpProd = Math.pow(b, expB);
          calculation = `(${formatTerm(valueA, exponentA)} + ${formatTerm(valueB, exponentB)})(${formatTerm(valueA, exponentA)} - ${formatTerm(valueB, exponentB)})`;
          steps = `= (${aWithExpProd} + ${bWithExpProd})(${aWithExpProd} - ${bWithExpProd})\n= ${Math.pow(aWithExpProd, 2) - Math.pow(bWithExpProd, 2)}`;
          break;
      }
      
      setResult(`${calculation}\n${steps}`);
    } else {
      // Cálculo algébrico
      const termA = formatTerm(valueA, exponentA);
      const termB = formatTerm(valueB, exponentB);

      let calculation = "";
      let steps = "";

      switch (selectedProduct) {
        case "quadrado-soma":
          calculation = `(${termA} + ${termB})²`;
          if (exponentA === "1" && exponentB === "1") {
            steps = `= ${termA}² + 2·${termA}·${termB} + ${termB}²`;
          } else {
            steps = `= (${termA})² + 2·(${termA})·(${termB}) + (${termB})²`;
          }
          break;
        case "quadrado-diferenca":
          calculation = `(${termA} - ${termB})²`;
          if (exponentA === "1" && exponentB === "1") {
            steps = `= ${termA}² - 2·${termA}·${termB} + ${termB}²`;
          } else {
            steps = `= (${termA})² - 2·(${termA})·(${termB}) + (${termB})²`;
          }
          break;
        case "produto-soma-diferenca":
          calculation = `(${termA} + ${termB})(${termA} - ${termB})`;
          if (exponentA === "1" && exponentB === "1") {
            steps = `= ${termA}² - ${termB}²`;
          } else {
            steps = `= (${termA})² - (${termB})²`;
          }
          break;
      }
      
      setResult(`${calculation}\n${steps}`);
    }
  };

  const resetCalculation = () => {
    setValueA("");
    setValueB("");
    setExponentA("1");
    setExponentB("1");
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
            Produtos Notáveis com Suporte a Variáveis e Expoentes
          </p>
        </div>

        {/* Produtos Notáveis Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Produtos Notáveis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
        </div>

        {/* Calculator Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={closeModal}>
          <DialogContent className="bg-card border-border text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-primary">
                {selectedProductData?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                Digite números ou variáveis (letras). Use expoentes para potências.
              </DialogDescription>
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
                  <Label htmlFor="valueA" className="text-foreground">
                    Valor de a (números ou letras):
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="valueA"
                      type="text"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      placeholder="Ex: x, 5, -3, y"
                      className="bg-background border-border text-foreground flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Superscript className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={exponentA}
                        onChange={(e) => setExponentA(e.target.value)}
                        placeholder="1"
                        className="bg-background border-border text-foreground w-16"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="valueB" className="text-foreground">
                    Valor de b (números ou letras):
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="valueB"
                      type="text"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      placeholder="Ex: 3, -2, z, y"
                      className="bg-background border-border text-foreground flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Superscript className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={exponentB}
                        onChange={(e) => setExponentB(e.target.value)}
                        placeholder="1"
                        className="bg-background border-border text-foreground w-16"
                        min="1"
                      />
                    </div>
                  </div>
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
