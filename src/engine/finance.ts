import type { AmortisationRow, FinanceResult, ReplacementVehicle, TradeInResult } from "./types";

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (principal <= 0) return 0;
  if (termMonths <= 0) return principal;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function buildAmortisationSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): AmortisationRow[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRatePercent, termMonths);
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = principal;
  const schedule: AmortisationRow[] = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const capital = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - capital);
    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      capital,
      balance,
    });
  }

  return schedule;
}

export function calculateFinanceForVehicle(
  vehicle: ReplacementVehicle,
  tradeIn: TradeInResult,
  overrides?: { interestRate?: number }
): FinanceResult {
  const interestRate = overrides?.interestRate ?? vehicle.interestRate;
  const totalDeposit = tradeIn.totalDeposit + vehicle.deposit;
  const amountFinanced = Math.max(0, vehicle.price - totalDeposit);
  const schedule = buildAmortisationSchedule(
    amountFinanced,
    interestRate,
    vehicle.financeTermMonths
  );
  const monthlyInstalment = schedule[0]?.payment ?? 0;
  const totalPayments = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    amountFinanced,
    monthlyInstalment,
    totalInterest,
    totalPayments,
    schedule,
  };
}

export function calculateFinance(
  vehicles: ReplacementVehicle[],
  tradeIn: TradeInResult,
  overrides?: { interestRate?: number }
): FinanceResult[] {
  return vehicles.map((vehicle) =>
    calculateFinanceForVehicle(vehicle, tradeIn, overrides)
  );
}
