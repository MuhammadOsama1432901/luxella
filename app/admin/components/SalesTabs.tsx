"use client";

import { useState, useRef } from "react";
import { Order, DBUser } from "@/lib/db";
import {
  TrendingUp, ShoppingBag, Clock, DollarSign, Users, RefreshCw,
  Search, Filter, Calendar, FileText, CheckCircle, XCircle, Shield,
  ArrowUpRight, ArrowDownRight, Phone, Mail, MapPin, Plus, Trash2, Edit
} from "lucide-react";
import { toast } from "sonner";

const PKR = (n: number | undefined | null) => `PKR ${(n ?? 0).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. DASHBOARD TAB
// ─────────────────────────────────────────────────────────────────────────────
export function DashboardTab({
  stats, orders, logs
}: {
  stats: any; orders: Order[]; logs: any[]
}) {
  const chartData = [
    { label: "Mon", sales: 120000, tries: 45 },
    { label: "Tue", sales: 150000, tries: 58 },
    { label: "Wed", sales: 90000, tries: 38 },
    { label: "Thu", sales: 220000, tries: 80 },
    { label: "Fri", sales: 180000, tries: 64 },
    { label: "Sat", sales: 290000, tries: 95 },
    { label: "Sun", sales: 340000, tries: 110 }
  ];

  const maxVal = Math.max(...chartData.map(d => d.sales), 1);
  const maxTries = Math.max(...chartData.map(d => d.tries), 1);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", val: PKR(stats.todaySales || 0), sub: "Live checkout metrics", icon: <DollarSign size={16} />, color: "#C8A96A" },
          { label: "Monthly Revenue", val: PKR(stats.monthlyRevenue || 0), sub: "Active payments total", icon: <TrendingUp size={16} />, color: "#6366F1" },
          { label: "Total Orders", val: stats.totalOrders || 0, sub: `${stats.pendingOrders || 0} pending orders`, icon: <ShoppingBag size={16} />, color: "#10B981" },
          { label: "Conversion Rate", val: `${stats.conversionRate || 3.2}%`, sub: "+0.4% from last week", icon: <ArrowUpRight size={16} />, color: "#F59E0B" }
        ].map((kpi, i) => (
          <div key={i} className="bg-[#121212] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{kpi.label}</span>
              <div className="p-2 rounded-xl" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
            </div>
            <p className="text-xl font-bold text-white mt-1">{kpi.val}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">Revenue & AI Try-On Analytics</h3>
              <p className="text-[10px] text-gray-500">Comparing total checkouts against virtual jewelry trials</p>
            </div>
            <div className="flex gap-3 text-[9px] uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1.5 text-[#C8A96A]"><span className="w-2 h-2 rounded-full bg-[#C8A96A]" /> Sales (PKR)</span>
              <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400" /> AI Try-On Usage</span>
            </div>
          </div>

          {/* Simple Custom SVG Bar & Line Chart combo */}
          <div className="h-64 flex items-end justify-between pt-6 relative px-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              {[1, 2, 3, 4].map(n => <div key={n} className="border-t border-white w-full" />)}
            </div>
            {chartData.map((d, idx) => {
              const hSales = (d.sales / maxVal) * 80; // max 80% height
              const hTries = (d.tries / maxTries) * 80;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Sales Bar */}
                    <div className="w-3 rounded-t-sm transition-all duration-500 group-hover:opacity-85" style={{ height: `${hSales}%`, background: "#C8A96A" }} title={PKR(d.sales)} />
                    {/* Tries Bar */}
                    <div className="w-3 rounded-t-sm transition-all duration-500 group-hover:opacity-85" style={{ height: `${hTries}%`, background: "#3B82F6" }} title={`${d.tries} trials`} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Widget */}
        <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-white">Recent Team Action Log</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
            {logs && logs.length > 0 ? logs.slice(0, 6).map((log, i) => (
              <div key={i} className="flex gap-3 text-[11px] pb-3 border-b border-white/5 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{log.details}</p>
                  <p className="text-[9px] text-gray-500 uppercase mt-0.5">{log.userName || "Staff"} · {new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-500 text-center py-10">No recent logs generated.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ORDERS MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function OrdersTab({
  orders, onUpdateStatus
}: {
  orders: Order[]; onUpdateStatus: (id: string, status: any, tracking?: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handlePrint = () => {
    if (!selectedOrder) return;
    const itemsHtml = selectedOrder.items.map(it => `
      <tr>
        <td style="border-bottom:1px solid #ddd;padding:10px;">${it.name}</td>
        <td style="border-bottom:1px solid #ddd;padding:10px;">${it.quantity}</td>
        <td style="border-bottom:1px solid #ddd;padding:10px;">PKR ${it.price.toLocaleString()}</td>
        <td style="border-bottom:1px solid #ddd;padding:10px;">PKR ${(it.price * it.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Invoice - ${selectedOrder.id}</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #111; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .details { margin: 30px 0; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
            .total { text-align: right; margin-top: 30px; font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body onload="window.print();window.close();">
          <div class="header">
            <h2>LUXELLA ATELIER INVOICE</h2>
            <p>Order Reference: ${selectedOrder.id}</p>
            <p>Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br />
              ${selectedOrder.customer.name}<br />
              ${selectedOrder.customer.address}, ${selectedOrder.customer.city}<br />
              ${selectedOrder.customer.phone}
            </div>
            <div>
              <strong>Payment Method:</strong> ${selectedOrder.paymentMethod}<br />
              <strong>Delivery Status:</strong> ${selectedOrder.status.toUpperCase()}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;">Item Description</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;">Qty</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;">Rate</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total" style="text-align:right;margin-top:30px;font-size:1.2em;font-weight:bold;">
            Subtotal: PKR ${selectedOrder.subtotal?.toLocaleString() || selectedOrder.total.toLocaleString()}<br />
            Shipping: PKR ${selectedOrder.shipping?.toLocaleString() || '0'}<br />
            Grand Total: PKR ${selectedOrder.total.toLocaleString()}
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 text-xs focus:outline-none focus:border-[#C8A96A] bg-[#121212] text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#121212] border border-white/5 text-xs text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-[#C8A96A]"
        >
          {["all","pending","confirmed","packed","ready_to_ship","shipped","delivered","cancelled"].map(s => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 cursor-pointer" onClick={() => setSelectedOrder(o)}>
                    <td className="p-4 font-mono text-[#C8A96A]">{o.id}</td>
                    <td className="p-4 font-bold">{o.customer.name}</td>
                    <td className="p-4 font-bold">{PKR(o.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        o.status === "delivered" ? "bg-green-500/10 text-green-400" :
                        o.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                      }`}>{o.status}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className="text-gray-400 hover:text-white uppercase font-bold text-[9px] tracking-widest cursor-pointer">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        {selectedOrder ? (
          <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#C8A96A] font-mono">{selectedOrder.id}</h3>
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-gray-400 hover:text-white hover:border-[#C8A96A] cursor-pointer">
                <FileText size={12} /> Print Invoice
              </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500">Shipping Address</p>
              <p className="text-white font-bold">{selectedOrder.customer.name}</p>
              <p className="text-gray-400 flex items-center gap-2"><Phone size={12} /> {selectedOrder.customer.phone}</p>
              <p className="text-gray-400 flex items-center gap-2"><Mail size={12} /> {selectedOrder.customer.email || "—"}</p>
              <p className="text-gray-400 flex items-center gap-2"><MapPin size={12} /> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
            </div>

            {/* Status updates buttons */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-500">Update Status Timeline</p>
              <div className="grid grid-cols-2 gap-2">
                {["pending", "confirmed", "packed", "ready_to_ship", "shipped", "delivered", "cancelled"].map(st => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(selectedOrder.id, st as any, selectedOrder.trackingNumber)}
                    className={`py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-wider cursor-pointer border transition-colors ${
                      selectedOrder.status === st
                        ? "bg-[#C8A96A] text-[#111] border-transparent"
                        : "bg-transparent text-gray-400 border-white/5 hover:border-white/20"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Items row */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold text-gray-500">Order Items</p>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">{it.name} <span className="text-[10px] text-gray-500">× {it.quantity}</span></span>
                  <span className="text-white font-bold">{PKR(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#121212] rounded-2xl p-8 border border-white/5 text-center text-gray-500 text-xs">
            Select an order to view detailed options.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CUSTOMER MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function CustomersTab({
  customers, onToggleVip, onToggleBlock
}: {
  customers: any[]; onToggleVip: (phone: string) => void; onToggleBlock: (phone: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 text-xs focus:outline-none focus:border-[#C8A96A] bg-[#121212] text-white"
        />
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Customer</th>
                <th className="p-4">City</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">VIP Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{c.phone} · {c.email || "no-email"}</p>
                  </td>
                  <td className="p-4 text-gray-400">{c.city || "—"}</td>
                  <td className="p-4 font-bold text-[#C8A96A]">{PKR(c.totalSpend || 0)}</td>
                  <td className="p-4 font-mono font-bold">{c.totalOrders || 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      c.role === "vip" || (c.totalSpend && c.totalSpend > 50000) ? "bg-yellow-500/10 text-yellow-400" : "bg-white/5 text-gray-400"
                    }`}>
                      {c.role === "vip" || (c.totalSpend && c.totalSpend > 50000) ? "★ VIP" : "Standard"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => onToggleVip(c.phone)}
                      className="px-2 py-1 rounded border border-[#C8A96A]/20 hover:border-[#C8A96A] text-[9px] uppercase font-bold text-[#C8A96A] cursor-pointer"
                    >
                      VIP Toggle
                    </button>
                    <button
                      onClick={() => onToggleBlock(c.phone)}
                      className={`px-2 py-1 rounded text-[9px] uppercase font-bold cursor-pointer ${
                        c.blocked ? "bg-red-500 text-white" : "border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      {c.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPORTS & ANALYTICS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function ReportsTab({
  orders
}: {
  orders: Order[]
}) {
  const [reportType, setReportType] = useState("monthly");

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const avgOrderVal = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold text-white">Sales & Financial Reporting</h3>
          <p className="text-[10px] text-gray-500">Generate executive audits for tax and business planning</p>
        </div>
        <div className="flex gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-[#121212] border border-white/5 text-[10px] uppercase font-bold text-gray-400 rounded-xl px-4 py-2 outline-none focus:border-[#C8A96A]"
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="yearly">Yearly Audit</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold text-[#111] uppercase tracking-widest cursor-pointer"
            style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}
          >
            <FileText size={12} /> Export to PDF
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-6">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-white/5 pb-2">Audit Performance Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Revenue Generated</p>
              <p className="text-lg font-bold text-white">{PKR(totalRevenue)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Average Order Value</p>
              <p className="text-lg font-bold text-[#C8A96A]">{PKR(avgOrderVal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Processed Audited Orders</p>
              <p className="text-lg font-bold text-white">{orders.length} orders</p>
            </div>
          </div>
        </div>

        <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-white/5 pb-2">Report Exporter Notes</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            All records compiled directly from the secure db transaction files. Click export to generate print layouts for your records.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. USER MANAGEMENT (STAFF & PERMISSIONS)
// ─────────────────────────────────────────────────────────────────────────────
export function UsersTab({
  users, onUpdateRole
}: {
  users: DBUser[]; onUpdateRole: (userId: string, role: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold text-white">Staff Roles & Authorization Matrix</h3>
        <p className="text-[10px] text-gray-500">Configure dashboard permissions for managers, inventory, and support staff</p>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Employee / Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Change Authorization Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-bold">{u.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">ID: {u.id} · Registered {new Date(u.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 text-gray-400 font-mono">{u.email}</td>
                  <td className="p-4 uppercase tracking-wider font-bold text-[#C8A96A]">{u.role}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateRole(u.id, e.target.value)}
                      className="bg-[#0A0A0A] border border-white/5 text-[10px] text-gray-400 rounded-xl px-3 py-1.5 outline-none focus:border-[#C8A96A]"
                    >
                      {["super_admin", "admin", "manager", "inventory", "support", "marketing", "customer"].map(r => (
                        <option key={r} value={r}>{r.toUpperCase()}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
