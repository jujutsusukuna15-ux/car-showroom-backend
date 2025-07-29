export interface DailyReport {
  date: string;
  total_purchases: number;
  total_sales: number;
  total_purchase_amount: number;
  total_sales_amount: number;
  profit: number;
  transaction_count: number;
}

export interface WeeklyReport {
  week_start: string;
  week_end: string;
  vehicles_bought: number;
  vehicles_sold: number;
  total_profit: number;
  best_performing_vehicle: string;
  total_repair_costs: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  revenue: number;
  costs: number;
  profit: number;
  vehicles_sold: number;
  customer_acquisition: number;
  mechanic_productivity: number;
}

export interface VehicleProfitability {
  id: number;
  vehicle_code: string;
  brand: string;
  model: string;
  year: number;
  purchase_price: number;
  total_repair_cost: number;
  final_selling_price: number;
  total_cost: number;
  profit: number;
  profit_margin_percentage: number;
  purchased_at: Date;
  sold_at: Date;
  days_to_sell: number;
}

export interface BusinessOverview {
  total_vehicles_in_stock: number;
  total_vehicles_sold: number;
  total_revenue: number;
  total_profit: number;
  average_profit_margin: number;
  pending_repairs: number;
  low_stock_parts: number;
}

export interface TopPerformingModel {
  brand: string;
  model: string;
  vehicles_sold: number;
  total_profit: number;
  average_profit: number;
  average_days_to_sell: number;
}
