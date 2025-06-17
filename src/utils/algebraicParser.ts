
// Tipo para representar um termo algébrico
export interface AlgebraicTerm {
  coefficient: number;
  variables: { [key: string]: number }; // variável: expoente
}

// Tipo para representar uma expressão algébrica
export interface AlgebraicExpression {
  terms: AlgebraicTerm[];
}

// Parser para expressões algébricas
export class AlgebraicParser {
  // Parse um termo como "3x²y" ou "xy" ou "5"
  static parseTerm(termStr: string): AlgebraicTerm {
    termStr = termStr.trim().replace(/\s+/g, '');
    
    // Regex para capturar coeficiente e variáveis com expoentes
    const termRegex = /^([+-]?\d*)?([a-zA-Z]*)(\d*)?$/;
    
    let coefficient = 1;
    const variables: { [key: string]: number } = {};
    
    // Se o termo contém variáveis com expoentes explícitos
    if (termStr.includes('²')) {
      termStr = termStr.replace(/²/g, '^2');
    }
    
    // Extrair coeficiente
    const coeffMatch = termStr.match(/^([+-]?\d+)/);
    if (coeffMatch) {
      coefficient = parseInt(coeffMatch[1]);
      termStr = termStr.replace(/^[+-]?\d+/, '');
    } else if (termStr.startsWith('-') && !termStr.match(/^-\d/)) {
      coefficient = -1;
      termStr = termStr.substring(1);
    } else if (termStr.startsWith('+')) {
      termStr = termStr.substring(1);
    }
    
    // Extrair variáveis e expoentes
    const varMatches = termStr.matchAll(/([a-zA-Z]+)(\^?(\d+))?/g);
    for (const match of varMatches) {
      const varName = match[1];
      const exponent = match[3] ? parseInt(match[3]) : 1;
      
      // Se é uma variável composta como "xy", separar
      if (varName.length > 1) {
        for (const char of varName) {
          variables[char] = (variables[char] || 0) + exponent;
        }
      } else {
        variables[varName] = (variables[varName] || 0) + exponent;
      }
    }
    
    return { coefficient, variables };
  }
  
  // Parse uma expressão como "x + 3" ou "x² + 7"
  static parseExpression(exprStr: string): AlgebraicExpression {
    exprStr = exprStr.trim().replace(/\s+/g, '');
    
    // Dividir por + e -, mantendo os sinais
    const terms: string[] = [];
    let current = '';
    
    for (let i = 0; i < exprStr.length; i++) {
      const char = exprStr[i];
      if ((char === '+' || char === '-') && i > 0) {
        if (current) terms.push(current);
        current = char === '-' ? '-' : '';
      } else {
        current += char;
      }
    }
    if (current) terms.push(current);
    
    const parsedTerms = terms.map(term => this.parseTerm(term));
    return { terms: parsedTerms };
  }
  
  // Aplicar produto notável (a+b)²
  static expandSquareSum(a: AlgebraicExpression, b: AlgebraicExpression): AlgebraicExpression {
    // (a+b)² = a² + 2ab + b²
    const a2 = this.multiplyExpressions(a, a);
    const b2 = this.multiplyExpressions(b, b);
    const ab2 = this.multiplyExpressions(a, b);
    
    // Multiplicar 2ab
    ab2.terms = ab2.terms.map(term => ({ ...term, coefficient: term.coefficient * 2 }));
    
    return this.addExpressions(this.addExpressions(a2, ab2), b2);
  }
  
  // Aplicar produto notável (a-b)²
  static expandSquareDifference(a: AlgebraicExpression, b: AlgebraicExpression): AlgebraicExpression {
    // (a-b)² = a² - 2ab + b²
    const a2 = this.multiplyExpressions(a, a);
    const b2 = this.multiplyExpressions(b, b);
    const ab2 = this.multiplyExpressions(a, b);
    
    // Multiplicar -2ab
    ab2.terms = ab2.terms.map(term => ({ ...term, coefficient: term.coefficient * -2 }));
    
    return this.addExpressions(this.addExpressions(a2, ab2), b2);
  }
  
  // Aplicar produto notável (a+b)(a-b)
  static expandDifferenceOfSquares(a: AlgebraicExpression, b: AlgebraicExpression): AlgebraicExpression {
    // (a+b)(a-b) = a² - b²
    const a2 = this.multiplyExpressions(a, a);
    const b2 = this.multiplyExpressions(b, b);
    
    // Subtrair b²
    b2.terms = b2.terms.map(term => ({ ...term, coefficient: -term.coefficient }));
    
    return this.addExpressions(a2, b2);
  }
  
  // Multiplicar duas expressões
  static multiplyExpressions(expr1: AlgebraicExpression, expr2: AlgebraicExpression): AlgebraicExpression {
    const resultTerms: AlgebraicTerm[] = [];
    
    for (const term1 of expr1.terms) {
      for (const term2 of expr2.terms) {
        const newTerm: AlgebraicTerm = {
          coefficient: term1.coefficient * term2.coefficient,
          variables: { ...term1.variables }
        };
        
        // Somar expoentes das variáveis
        for (const [varName, exponent] of Object.entries(term2.variables)) {
          newTerm.variables[varName] = (newTerm.variables[varName] || 0) + exponent;
        }
        
        resultTerms.push(newTerm);
      }
    }
    
    return this.simplifyExpression({ terms: resultTerms });
  }
  
  // Somar duas expressões
  static addExpressions(expr1: AlgebraicExpression, expr2: AlgebraicExpression): AlgebraicExpression {
    const allTerms = [...expr1.terms, ...expr2.terms];
    return this.simplifyExpression({ terms: allTerms });
  }
  
  // Simplificar expressão combinando termos semelhantes
  static simplifyExpression(expr: AlgebraicExpression): AlgebraicExpression {
    const termMap = new Map<string, AlgebraicTerm>();
    
    for (const term of expr.terms) {
      const key = this.getTermKey(term);
      if (termMap.has(key)) {
        const existingTerm = termMap.get(key)!;
        existingTerm.coefficient += term.coefficient;
      } else {
        termMap.set(key, { ...term });
      }
    }
    
    const simplifiedTerms = Array.from(termMap.values()).filter(term => term.coefficient !== 0);
    return { terms: simplifiedTerms };
  }
  
  // Gerar chave única para um termo baseada nas variáveis
  static getTermKey(term: AlgebraicTerm): string {
    const sortedVars = Object.entries(term.variables).sort();
    return sortedVars.map(([varName, exp]) => `${varName}^${exp}`).join('*');
  }
  
  // Converter expressão para string legível
  static expressionToString(expr: AlgebraicExpression): string {
    if (expr.terms.length === 0) return '0';
    
    return expr.terms
      .sort((a, b) => {
        // Ordenar por grau total (soma dos expoentes)
        const degreeA = Object.values(a.variables).reduce((sum, exp) => sum + exp, 0);
        const degreeB = Object.values(b.variables).reduce((sum, exp) => sum + exp, 0);
        return degreeB - degreeA;
      })
      .map((term, index) => {
        let result = '';
        
        // Adicionar sinal
        if (index === 0) {
          if (term.coefficient < 0) result += '-';
        } else {
          result += term.coefficient >= 0 ? '+' : '-';
        }
        
        const absCoeff = Math.abs(term.coefficient);
        const hasVariables = Object.keys(term.variables).length > 0;
        
        // Adicionar coeficiente
        if (absCoeff !== 1 || !hasVariables) {
          result += absCoeff.toString();
        }
        
        // Adicionar variáveis
        const sortedVars = Object.entries(term.variables).sort();
        for (const [varName, exponent] of sortedVars) {
          if (exponent > 0) {
            result += varName;
            if (exponent > 1) {
              if (exponent === 2) {
                result += '²';
              } else {
                result += `^${exponent}`;
              }
            }
          }
        }
        
        return result;
      })
      .join('');
  }
  
  // Detectar e resolver produtos notáveis
  static detectAndSolveNotableProduct(input: string): { result: string; steps: string[] } | null {
    const steps: string[] = [];
    input = input.trim().replace(/\s+/g, '');
    
    // Padrão para (expressão)²
    const squarePattern = /^\(([^)]+)\)²$/;
    const squareMatch = input.match(squarePattern);
    
    if (squareMatch) {
      const innerExpr = squareMatch[1];
      steps.push(`Entrada: (${innerExpr})²`);
      
      // Verificar se é soma ou diferença
      if (innerExpr.includes('+')) {
        const parts = innerExpr.split('+');
        if (parts.length === 2) {
          const a = this.parseExpression(parts[0].trim());
          const b = this.parseExpression(parts[1].trim());
          
          steps.push(`Identificado: (a+b)² onde a = ${this.expressionToString(a)} e b = ${this.expressionToString(b)}`);
          steps.push(`Aplicando fórmula: (a+b)² = a² + 2ab + b²`);
          
          const result = this.expandSquareSum(a, b);
          const resultStr = this.expressionToString(result);
          
          steps.push(`Resultado: ${resultStr}`);
          return { result: resultStr, steps };
        }
      } else if (innerExpr.includes('-')) {
        const parts = innerExpr.split('-');
        if (parts.length === 2) {
          const a = this.parseExpression(parts[0].trim());
          const b = this.parseExpression(parts[1].trim());
          
          steps.push(`Identificado: (a-b)² onde a = ${this.expressionToString(a)} e b = ${this.expressionToString(b)}`);
          steps.push(`Aplicando fórmula: (a-b)² = a² - 2ab + b²`);
          
          const result = this.expandSquareDifference(a, b);
          const resultStr = this.expressionToString(result);
          
          steps.push(`Resultado: ${resultStr}`);
          return { result: resultStr, steps };
        }
      }
    }
    
    // Padrão para (a+b)(a-b)
    const diffSquarePattern = /^\(([^)]+)\)\(([^)]+)\)$/;
    const diffSquareMatch = input.match(diffSquarePattern);
    
    if (diffSquareMatch) {
      const expr1 = diffSquareMatch[1];
      const expr2 = diffSquareMatch[2];
      
      // Verificar se é do tipo (a+b)(a-b)
      if (expr1.includes('+') && expr2.includes('-')) {
        const parts1 = expr1.split('+');
        const parts2 = expr2.split('-');
        
        if (parts1.length === 2 && parts2.length === 2) {
          const a1 = parts1[0].trim();
          const b1 = parts1[1].trim();
          const a2 = parts2[0].trim();
          const b2 = parts2[1].trim();
          
          if (a1 === a2 && b1 === b2) {
            const a = this.parseExpression(a1);
            const b = this.parseExpression(b1);
            
            steps.push(`Entrada: (${expr1})(${expr2})`);
            steps.push(`Identificado: (a+b)(a-b) onde a = ${this.expressionToString(a)} e b = ${this.expressionToString(b)}`);
            steps.push(`Aplicando fórmula: (a+b)(a-b) = a² - b²`);
            
            const result = this.expandDifferenceOfSquares(a, b);
            const resultStr = this.expressionToString(result);
            
            steps.push(`Resultado: ${resultStr}`);
            return { result: resultStr, steps };
          }
        }
      }
    }
    
    return null;
  }
}
