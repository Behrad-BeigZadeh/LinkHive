import { Link, useLinkSTore } from "@/stores/linkStore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChartBig } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function LinksAnalytics() {
  const { allLinks } = useLinkSTore();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  const totalClicks = allLinks.reduce(
    (sum: number, link: Link) => sum + link.clicks,
    0
  );

  return (
    <div>
      {allLinks.length > 0 && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-10 space-y-8"
        >
          <div className="flex items-center gap-2 text-white">
            <BarChartBig className="text-cyan-400 w-6 h-6" />
            <h3 className="text-2xl font-bold">Link Analytics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Clicks Card */}
            <div className="bg-gradient-to-br flex flex-col justify-center items-center gap-2 from-cyan-700/30 to-slate-800/60 backdrop-blur rounded-xl p-6 shadow-md">
              <p className=" text-3xl text-slate-300 mb-1 tracking-widest">
                Total Clicks
              </p>
              <p className="text-6xl font-bold text-cyan-300 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
                {totalClicks}
              </p>
            </div>

            {/* Click History List */}
            <div className="bg-slate-800/50 rounded-xl p-6 shadow-md max-h-64 ">
              <p className="text-sm text-slate-300 mb-3 font-medium">
                Click History
              </p>
              <ul className="space-y-2">
                {allLinks.map((link) => (
                  <li
                    key={link.id}
                    className="flex justify-between text-sm text-slate-300 bg-slate-700/40 px-4 py-2 rounded-md hover:bg-slate-600/50 transition"
                  >
                    <span className="truncate">{link.title}</span>
                    <span className="text-cyan-400 font-semibold">
                      {link.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chart Below */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={allLinks}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  tick={{ fill: "#d1d5db", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#d1d5db", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "6px",
                  }}
                  itemStyle={{ color: "#a5f3fc" }}
                  labelStyle={{ color: "#f9fafb" }}
                  cursor={{ stroke: "#0ea5e9", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#22d3ee"
                  fill="url(#colorClicks)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    stroke: "#22d3ee",
                    strokeWidth: 1,
                    fill: "#0f172a",
                  }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
