import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const LineAreaChart = ({ tokenAddress }) => {
    const chartContainerRef = useRef(null);
    const toolTipRef = useRef(null);
    const [chartData, setChartData] = useState([]);

    // Fetch and format token price data
    const fetchTokenPriceData = async (tokenAddress) => {
        try {
            const response = await fetch(`https://memhome-server-iota.vercel.app/api/price/${tokenAddress}`);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();

            // Process data to remove duplicates by averaging prices for the same timestamp
            const priceMap = new Map();
            data.forEach((item) => {
                const time = new Date(item.date).getTime() / 1000; // Convert to Unix timestamp
                if (!priceMap.has(time)) {
                    priceMap.set(time, []);
                }
                priceMap.get(time).push(item.price);
            });

            // Average prices for each timestamp
            const formattedData = Array.from(priceMap.entries()).map(([time, prices]) => ({
                time,
                value: prices.reduce((sum, price) => sum + price, 0) / prices.length, // Average price
            }));

            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching token price data:", error);
        }
    };

    useEffect(() => {
        if (tokenAddress) {
            fetchTokenPriceData(tokenAddress);
        }
    }, [tokenAddress]);

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        // Initialize chart
        const chart = createChart(container, {
            layout: {
                textColor: "white",
                background: { type: "solid", color: "black" },
            },
            crosshair: {
                horzLine: {
                    visible: true,
                    labelVisible: false,
                },
                vertLine: {
                    labelVisible: true,
                },
            },
            grid: {
                vertLines: {
                    visible: false,
                },
                horzLines: {
                    visible: false,
                },
            },
        });

        // Initialize series
        const series = chart.addLineSeries({
            color: "#2962FF",
            lineWidth: 2,
            priceFormat: {
                type: "price",
                precision: 8,
                minMove: 0.00000001,
            },
        });

        series.priceScale().applyOptions({
            scaleMargins: {
                top: 0.3,
                bottom: 0.25,
            },
        });

        // Update series data
        const updateSeriesData = () => {
            if (chartData.length > 0) {
                series.setData(chartData);
            }
        };

        updateSeriesData();

        // Initialize tooltip
        const toolTip = document.createElement("div");
        toolTip.style = `width: 10vw; height: 10vh; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);`;
        toolTip.style.color = "white";
        toolTip.style.borderColor = "rgba(255, 255, 255, 0.2)";

        container.appendChild(toolTip);
        toolTipRef.current = toolTip;

        const updateTooltip = (param) => {
            if (!param.time || !param.seriesData || param.point === undefined) {
                toolTip.style.display = "none";
                return;
            }

            const data = param.seriesData.get(series);
            const price = data ? data.value : 'N/A';
            const dateStr = new Date(param.time * 1000).toLocaleDateString();

            toolTip.style.display = "block";
            toolTip.innerHTML = `
                <div style="font-size: 15px; margin: 0; color: white">${price} $</div>
                <div style="color: white; font-size: 10px">${dateStr}</div>
            `;

            const coordinate = series.priceToCoordinate(price);
            if (coordinate === null) return;

            const tooltipX = Math.max(
                0,
                Math.min(container.clientWidth - toolTip.offsetWidth, param.point.x - (toolTip.offsetWidth / 2))
            );
            const tooltipY = Math.max(
                0,
                Math.min(container.clientHeight - toolTip.offsetHeight, coordinate - toolTip.offsetHeight - 10)
            );

            toolTip.style.left = `${tooltipX}px`;
            toolTip.style.top = `${tooltipY}px`;
        };

        chart.subscribeCrosshairMove(updateTooltip);

        return () => {
            if (toolTipRef.current) {
                container.removeChild(toolTipRef.current);
            }
            if (chart) {
                chart.remove();
            }
        };
    }, [chartData]);

    return (
        <div
            ref={chartContainerRef}
            className="w-full h-[80vh] sm:h-[50vh] max-w-4xl mx-auto relative lg:w-[70vw] lg:h-[60vh] mt-2"
        />
    );
};

export default LineAreaChart;
