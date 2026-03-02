import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalculatorIcon, X, Delete, Divide, Minus, Plus, Equal, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inline calculator logic for the floating modal
export function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteLast = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => setDisplay(String(-parseFloat(display)));
  const inputPercent = () => setDisplay(String(parseFloat(display) / 100));

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calc(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;
    const result = calc(previousValue, parseFloat(display), operation);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const calc = (a: number, b: number, op: string) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const NumBtn = ({ v }: { v: string }) => (
    <Button
      variant="outline"
      className="h-12 text-lg font-semibold bg-secondary/50 hover:bg-secondary border-border touch-manipulation"
      onClick={() => inputDigit(v)}
    >
      {v}
    </Button>
  );

  const OpBtn = ({ op, icon: Icon }: { op: string; icon: React.ElementType }) => (
    <Button
      variant={operation === op ? "default" : "outline"}
      className={`h-12 touch-manipulation ${
        operation === op
          ? "bg-primary text-primary-foreground"
          : "bg-accent/20 hover:bg-accent/40 text-accent-foreground border-border"
      }`}
      onClick={() => performOperation(op)}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <>
      {/* Floating Calculator Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center touch-manipulation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <CalculatorIcon className="w-6 h-6" />}
      </motion.button>

      {/* Calculator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[300px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                <span className="font-semibold">Calculator</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Display */}
            <div className="p-3">
              <div className="bg-muted/50 rounded-xl p-3 border border-border mb-3">
                <div className="text-right">
                  {previousValue !== null && operation && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {previousValue} {operation}
                    </div>
                  )}
                  <div className="text-2xl font-mono font-bold text-foreground truncate">
                    {display}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                <Button variant="outline" className="h-12 text-sm font-semibold bg-destructive/10 hover:bg-destructive/20 text-destructive border-border touch-manipulation" onClick={clear}>AC</Button>
                <Button variant="outline" className="h-12 bg-secondary/50 hover:bg-secondary border-border touch-manipulation" onClick={toggleSign}>+/-</Button>
                <Button variant="outline" className="h-12 bg-secondary/50 hover:bg-secondary border-border touch-manipulation" onClick={inputPercent}><Percent className="w-4 h-4" /></Button>
                <OpBtn op="/" icon={Divide} />

                <NumBtn v="7" /><NumBtn v="8" /><NumBtn v="9" />
                <OpBtn op="*" icon={X} />

                <NumBtn v="4" /><NumBtn v="5" /><NumBtn v="6" />
                <OpBtn op="-" icon={Minus} />

                <NumBtn v="1" /><NumBtn v="2" /><NumBtn v="3" />
                <OpBtn op="+" icon={Plus} />

                <Button variant="outline" className="col-span-2 h-12 text-lg font-semibold bg-secondary/50 hover:bg-secondary border-border touch-manipulation" onClick={() => inputDigit("0")}>0</Button>
                <Button variant="outline" className="h-12 text-lg font-semibold bg-secondary/50 hover:bg-secondary border-border touch-manipulation" onClick={inputDecimal}>.</Button>
                <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation" onClick={calculate}><Equal className="w-4 h-4" /></Button>
              </div>

              <Button variant="outline" className="w-full h-10 gap-2 bg-muted/50 hover:bg-muted border-border mt-2 touch-manipulation" onClick={deleteLast}>
                <Delete className="w-4 h-4" /> Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
