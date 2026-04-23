import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from "motion/react";

interface PayPalButtonProps {
  amount: string;
  currency?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
}

export default function PayPalButton({ amount, currency = "EUR", onSuccess, onError }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <div className="w-full relative min-h-[150px]">
      <AnimatePresence>
        {isPending && (
          <motion.div 
            key="paypal-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-highest/50 rounded-2xl backdrop-blur-sm z-10"
          >
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs font-bold text-white uppercase tracking-widest opacity-70">A carregar PayPal...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "pill",
            label: "pay",
            height: 48
          }}
          disabled={isPending}
          forceReRender={[amount, currency]}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: currency as any,
                    value: amount,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              if (onSuccess) onSuccess(details);
            }
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            if (onError) onError(err);
          }}
        />
      </div>
    </div>
  );
}
