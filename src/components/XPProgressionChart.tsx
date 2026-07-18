import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { WeeklyModule, UserProgressData } from "../types";
import { Trophy, CheckCircle, HelpCircle } from "lucide-react";

interface XPProgressionChartProps {
  roadmap: WeeklyModule[];
  progressData: UserProgressData;
  activityProgress: Record<string, boolean>;
}

interface ChartDataPoint {
  week: number;
  label: string;
  title: string;
  xp: number;
  isCompleted: boolean;
  completedTasks: number;
  totalTasks: number;
}

export default function XPProgressionChart({
  roadmap,
  progressData,
  activityProgress,
}: XPProgressionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 220 });
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 1. Calculate dynamic, deterministic data points for the 4-week roadmap
  const chartData: ChartDataPoint[] = roadmap.map((module, idx) => {
    const w = module.week;
    
    // Count activities checked off in this week
    let completedCount = 0;
    module.activities.forEach((_, aIdx) => {
      if (activityProgress[`${w}-${aIdx}`]) {
        completedCount++;
      }
    });

    // Base XP scaling across weeks to look progressive
    const baseWeekXP = [50, 120, 210, 320, 450, 600];
    const base = baseWeekXP[idx] || (w * 100);

    // Dynamic XP earned in this week
    const activityXP = completedCount * 50;

    // Bonus XP from completed projects & interviews allocated proportionally
    const projectBonus = Math.min(progressData.completedProjectsCount, idx) * 150;
    const totalXPForWeek = base + activityXP + projectBonus;

    // Milestone status
    const milestone = progressData.milestones.find((m) => m.week === w);
    const isCompleted = milestone ? milestone.isCompleted : false;

    return {
      week: w,
      label: `Week ${w}`,
      title: module.title,
      xp: totalXPForWeek,
      isCompleted,
      completedTasks: completedCount,
      totalTasks: module.activities.length,
    };
  });

  // 2. Setup ResizeObserver for responsive resizing of the D3 canvas
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Maintain aspect ratio, min height 200, max height 260
      const calculatedHeight = Math.max(200, Math.min(260, width * 0.35));
      setDimensions({
        width: width || 600,
        height: calculatedHeight,
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 3. Render and animate the D3.js line chart
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    // Clear previous drawing
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 25, right: 35, bottom: 35, left: 45 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create main grouping element
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define X & Y Scales
    const xScale = d3
      .scalePoint<number>()
      .domain(chartData.map((d) => d.week))
      .range([0, chartWidth])
      .padding(0.2);

    const xValues = chartData.map((d) => d.xp);
    const maxXP = d3.max(xValues) || 500;
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(500, maxXP + 100)])
      .range([chartHeight, 0])
      .nice();

    // Definitions for gradients & drop-shadows
    const defs = svg.append("defs");

    // Line Gradient
    const lineGradient = defs
      .append("linearGradient")
      .attr("id", "chart-line-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    lineGradient.append("stop").attr("offset", "0%").attr("stop-color", "#D4AF37");
    lineGradient.append("stop").attr("offset", "100%").attr("stop-color", "#F59E0B");

    // Area Gradient under the line
    const areaGradient = defs
      .append("linearGradient")
      .attr("id", "chart-area-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    areaGradient.append("stop").attr("offset", "0%").attr("stop-color", "#D4AF37").attr("stop-opacity", 0.25);
    areaGradient.append("stop").attr("offset", "100%").attr("stop-color", "#D4AF37").attr("stop-opacity", 0);

    // Horizontal Grid Lines
    const yTicks = yScale.ticks(4);
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1);

    // Draw the X Axis
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `W${d}`))
      .call((gAxis) => gAxis.select(".domain").remove()) // Remove axis line
      .call((gAxis) => gAxis.selectAll(".tick line").remove()) // Remove ticks
      .selectAll("text")
      .attr("fill", "rgba(255, 255, 255, 0.4)")
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-sans), sans-serif")
      .attr("dy", "12px");

    // Draw the Y Axis
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickFormat((d) => `${d} XP`)
      )
      .call((gAxis) => gAxis.select(".domain").remove()) // Remove axis line
      .call((gAxis) => gAxis.selectAll(".tick line").remove()) // Remove ticks
      .selectAll("text")
      .attr("fill", "rgba(255, 255, 255, 0.4)")
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono), monospace");

    // Area Generator
    const areaGenerator = d3
      .area<ChartDataPoint>()
      .x((d) => xScale(d.week) || 0)
      .y0(chartHeight)
      .y1((d) => yScale(d.xp))
      .curve(d3.curveMonotoneX);

    // Draw Area under line
    const areaPath = g
      .append("path")
      .datum(chartData)
      .attr("d", areaGenerator)
      .attr("fill", "url(#chart-area-grad)")
      .attr("opacity", 0);

    // Animate Area entry
    areaPath.transition().duration(800).attr("opacity", 1);

    // Line Generator
    const lineGenerator = d3
      .line<ChartDataPoint>()
      .x((d) => xScale(d.week) || 0)
      .y((d) => yScale(d.xp))
      .curve(d3.curveMonotoneX);

    // Draw Line
    const path = g
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "url(#chart-line-grad)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("d", lineGenerator);

    // Animate Line drawing path
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Interactive Circles for points
    const points = g
      .selectAll(".point-group")
      .data(chartData)
      .enter()
      .append("g")
      .attr("class", "point-group")
      .attr("transform", (d) => `translate(${xScale(d.week) || 0}, ${yScale(d.xp)})`);

    // Outer aura ring for milestone completion
    points
      .append("circle")
      .attr("r", 7)
      .attr("fill", (d) => (d.isCompleted ? "#10B981" : "transparent"))
      .attr("opacity", 0.15)
      .attr("stroke", (d) => (d.isCompleted ? "#10B981" : "transparent"))
      .attr("stroke-width", 1.5);

    // Core point circles
    points
      .append("circle")
      .attr("r", 4.5)
      .attr("fill", (d) => (d.isCompleted ? "#10B981" : "#0A0A0A"))
      .attr("stroke", (d) => (d.isCompleted ? "#047857" : "#D4AF37"))
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        // Enlarge point
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 7)
          .attr("stroke-width", 3.5);

        // Calculate tooltip position
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx, y: my });
        setHoveredPoint(d);
      })
      .on("mousemove", function (event) {
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx, y: my });
      })
      .on("mouseout", function () {
        // Shrink back
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 4.5)
          .attr("stroke-width", 2);

        setHoveredPoint(null);
      });

  }, [dimensions, chartData]);

  return (
    <div
      ref={containerRef}
      className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 relative overflow-visible w-full select-none"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Weekly XP & Milestone Progression
            </h3>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">
            Real-time D3 tracker mapping roadmap velocity and syllabus milestones
          </p>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-white/50">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] block" />
            <span>Cumulative XP</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] block" />
            <span>Milestone Verified</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-visible">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />

        {/* Hover Interactive Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-50 pointer-events-none bg-[#0F0F0F] border border-white/15 rounded-xl p-3 shadow-2xl max-w-xs transition-all duration-100 ease-out flex flex-col gap-1.5"
            style={{
              left: `${tooltipPos.x + 15}px`,
              top: `${tooltipPos.y - 45}px`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                {hoveredPoint.label}
              </span>
              <div className="flex items-center gap-1">
                {hoveredPoint.isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <CheckCircle className="w-2 h-2 fill-emerald-400 text-[#0F0F0F]" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase bg-white/5 text-white/40 border border-white/5 px-1.5 py-0.5 rounded">
                    <HelpCircle className="w-2 h-2 text-white/40" /> In Progress
                  </span>
                )}
              </div>
            </div>

            <h4 className="text-xs font-bold text-white font-serif leading-tight">
              {hoveredPoint.title}
            </h4>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 mt-1">
              <div>
                <span className="text-[8px] uppercase text-white/40 block">Cumulative Score</span>
                <span className="text-[11px] font-mono font-bold text-white">
                  {hoveredPoint.xp} XP
                </span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-white/40 block">Syllabus Status</span>
                <span className="text-[11px] font-mono font-bold text-[#D4AF37]">
                  {hoveredPoint.completedTasks}/{hoveredPoint.totalTasks} Done
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
