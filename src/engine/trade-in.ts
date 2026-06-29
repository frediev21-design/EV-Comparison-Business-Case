import type { CurrentVehicle, TradeInInput, TradeInResult, ReplacementVehicle } from "./types";

export function calculateTradeIn(
  current: CurrentVehicle,
  tradeIn: TradeInInput,
  replacement?: ReplacementVehicle,
  overrides?: { tradeValue?: number; outstandingFinance?: number }
): TradeInResult {
  const currentVehicleValue =
    overrides?.tradeValue ?? current.tradeInValue ?? current.currentValue;
  const outstandingFinance = overrides?.outstandingFinance ?? current.outstandingFinance;
  const tradeEquity = currentVehicleValue - outstandingFinance;
  const additionalCash = tradeIn.additionalCashDeposit;
  const totalDeposit = tradeEquity + additionalCash;
  const vehiclePrice = replacement?.price ?? 0;
  const amountFinanced = Math.max(0, vehiclePrice - totalDeposit);

  return {
    currentVehicleValue,
    outstandingFinance,
    tradeEquity,
    additionalCash,
    totalDeposit,
    vehiclePrice,
    amountFinanced,
  };
}
