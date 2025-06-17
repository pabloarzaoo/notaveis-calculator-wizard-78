
import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgebraicParser } from "@/utils/algebraicParser";

const SymbolicInput = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    try {
      setError("");
      setResult("");
      setSteps([]);

      if (!expression.trim()) {
        setError("Por favor, insira uma expressão");
        return;
      }

      const solution = AlgebraicParser.detectAndSolveNotableProduct(expression);
      
      if (solution) {
        setResult(solution.result);
        setSteps(solution.steps);
      } else {
        setError("Expressão não reconhecida como produto notável. Tente expressões como (x+3)², (a-b)² ou (x+y)(x-y)");
      }
    } catch (err) {
      setError("Erro ao processar a expressão. Verifique a sintaxe.");
      console.error("Erro no parser:", err);
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
    setSteps([]);
    setError("");
  };

  const exampleExpressions = [
    "(x+3)²",
    "(x²+7)²",
    "(xy-8)²",
    "(a+b)(a-b)",
    "(2x+5)²"
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Calculator className="h-6 w-6 text-primary" />
          <span>Calculadora Algébrica Simbólica</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input da expressão */}
        <div className="space-y-2">
          <Label htmlFor="algebraic-expression" className="text-lg font-medium">
            Digite a expressão algébrica:
          </Label>
          <Input
            id="algebraic-expression"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Ex: (x+3)², (a-b)², (x+y)(x-y)"
            className="text-lg font-mono"
            onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
          />
        </div>

        {/* Exemplos */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Exemplos (clique para usar):
          </Label>
          <div className="flex flex-wrap gap-2">
            {exampleExpressions.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setExpression(example)}
                className="font-mono text-sm"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <Button 
            onClick={handleCalculate}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!expression.trim()}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Resolver
          </Button>
          <Button 
            onClick={handleClear}
            variant="outline"
            className="flex-1"
          >
            Limpar
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary mb-2">Resultado Final:</h3>
              <p className="text-xl font-mono font-bold text-foreground">
                {result}
              </p>
            </div>

            {/* Passos */}
            {steps.length > 0 && (
              <div className="bg-muted border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Resolução Passo a Passo:</h3>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-foreground font-mono text-sm leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações sobre produtos notáveis */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Produtos Notáveis Suportados:</h4>
          <div className="space-y-1 text-sm text-muted-foreground font-mono">
            <p>• (a+b)² = a² + 2ab + b²</p>
            <p>• (a-b)² = a² - 2ab + b²</p>
            <p>• (a+b)(a-b) = a² - b²</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolicInput;
