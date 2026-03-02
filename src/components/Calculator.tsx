import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, Delete, Divide, Minus, Plus, X, Equal, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Calculator() {
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
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
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

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "*":
          result = currentValue * inputValue;
          break;
        case "/":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result: number;

    switch (operation) {
      case "+":
        result = previousValue + inputValue;
        break;
      case "-":
        result = previousValue - inputValue;
        break;
      case "*":
        result = previousValue * inputValue;
        break;
      case "/":
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.02 }
  };

  const NumberButton = ({ value }: { value: string }) => (
    <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
      <Button
        variant="outline"
        className="w-full h-14 text-xl font-semibold bg-secondary/50 hover:bg-secondary border-border"
        onClick={() => inputDigit(value)}
      >
        {value}
      </Button>
    </motion.div>
  );

  const OperationButton = ({ op, icon: Icon }: { op: string; icon: React.ElementType }) => (
    <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
      <Button
        variant={operation === op ? "default" : "outline"}
        className={`w-full h-14 text-xl ${
          operation === op 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent/20 hover:bg-accent/40 text-accent-foreground border-border"
        }`}
        onClick={() => performOperation(op)}
      >
        <Icon className="w-5 h-5" />
      </Button>
    </motion.div>
  );

  return (
    <section id="calculator" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <CalculatorIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Quick Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Basic Calculator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Perform quick calculations for your construction planning needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-sm mx-auto"
        >
          <Card className="glass-card border-border/50 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalculatorIcon className="w-5 h-5 text-primary" />
                Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="text-right">
                  {previousValue !== null && operation && (
                    <div className="text-sm text-muted-foreground mb-1">
                      {previousValue} {operation}
                    </div>
                  )}
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground truncate">
                    {display}
                  </div>
                </div>
              </div>

              {/* Buttons Grid */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold bg-destructive/10 hover:bg-destructive/20 text-destructive border-border"
                    onClick={clear}
                  >
                    AC
                  </Button>
                </motion.div>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-secondary/50 hover:bg-secondary border-border"
                    onClick={toggleSign}
                  >
                    +/-
                  </Button>
                </motion.div>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-14 bg-secondary/50 hover:bg-secondary border-border"
                    onClick={inputPercent}
                  >
                    <Percent className="w-5 h-5" />
                  </Button>
                </motion.div>
                <OperationButton op="/" icon={Divide} />

                {/* Row 2 */}
                <NumberButton value="7" />
                <NumberButton value="8" />
                <NumberButton value="9" />
                <OperationButton op="*" icon={X} />

                {/* Row 3 */}
                <NumberButton value="4" />
                <NumberButton value="5" />
                <NumberButton value="6" />
                <OperationButton op="-" icon={Minus} />

                {/* Row 4 */}
                <NumberButton value="1" />
                <NumberButton value="2" />
                <NumberButton value="3" />
                <OperationButton op="+" icon={Plus} />

                {/* Row 5 */}
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants} className="col-span-2">
                  <Button
                    variant="outline"
                    className="w-full h-14 text-xl font-semibold bg-secondary/50 hover:bg-secondary border-border"
                    onClick={() => inputDigit("0")}
                  >
                    0
                  </Button>
                </motion.div>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-14 text-xl font-semibold bg-secondary/50 hover:bg-secondary border-border"
                    onClick={inputDecimal}
                  >
                    .
                  </Button>
                </motion.div>
                <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                  <Button
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={calculate}
                  >
                    <Equal className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Delete button */}
              <motion.div whileTap="tap" whileHover="hover" variants={buttonVariants}>
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2 bg-muted/50 hover:bg-muted border-border"
                  onClick={deleteLast}
                >
                  <Delete className="w-4 h-4" />
                  Delete
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
