import { addPropertyControls, Color, ControlType, Frame } from "framer";
import * as React from "react";
import Chart from "react-apexcharts";

enum ChartTypes {
  Line = "line",
  Area = "area",
  Bar = "bar",
  Heatmap = "heatmap",
  Radar = "radar"
}

export interface Props {
  width?: number;
  height?: number;
  points: number;
  seriesCount: number;
  chartType: ChartTypes;
  showToolbar: boolean;
  showLegend: boolean;
  showXaxis: boolean;
  showYaxis: boolean;
  isStacked: boolean;
  isHorizontal: boolean;
  colors: string[];
  palette?: string;
  showStroke: boolean;
  stroke: number;
  strokeCurve: "smooth" | "straight" | "stepline";
  fillType: "solid" | "gradient" | "pattern";
  fillOpacity: number;
  onDataPointSelection?: () => void;
  onDataPointMouseEnter?: () => void;
  onDataPointMouseLeave?: () => void;
}

export const Charting = function(props) {
  const {
    width,
    height,
    chartType,
    isHorizontal,
    points,
    seriesCount,
    fillType,
    fillOpacity,
    showStroke,
    stroke,
    strokeCurve,
    palette,
    showToolbar,
    showLegend,
    showXaxis,
    showYaxis,
    isStacked,
    colors
  } = props;
  const [series, setSeries] = React.useState(makeSeries(seriesCount, points));
  const [mounted, setMounted] = React.useState(false);

  const options = {
    colors:
      colors.length > 0 && palette == "custom"
        ? colors
            .map(item => {
              if (item.startsWith("var("))
                // this is needed for handling Shared Colors in Framer X
                return item.match(/rgba?\(.*\d\)/).pop();
              return item;
            })
            .map(d => Color.toHexString(Color(d)))
        : undefined,
    theme: {
      palette: palette
    },
    chart: {
      id: "dogchart",
      type: chartType,
      stacked: isStacked,
      toolbar: {
        show: showToolbar
      },
      events: {
        mounted: function(chartContext, config) {
          setMounted(true);
        },
        dataPointSelection: props.onDataPointSelection,
        dataPointMouseEnter: props.onDataPointMouseEnter,
        dataPointMouseLeave: props.onDataPointMouseLeave
      }
    },
    plotOptions: {
      bar: {
        horizontal: isHorizontal
      }
    },
    fill: {
      opacity: fillOpacity,
      type: fillType
    },
    stroke: {
      show: showStroke,
      curve: strokeCurve,
      width: stroke
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: showXaxis
      }
    },
    yaxis: {
      show: showYaxis
    },
    dataLabels: {
      enabled: false
    },
    noData: {
      text: "No Data"
    },
    legend: {
      show: showLegend
    }
  };

  React.useEffect(() => {
    setSeries(makeSeries(seriesCount, points));
  }, [seriesCount, points]);

  return (
    <>
      <Frame visible={!mounted} width="100%" height="100%" background="white">
        <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="13">
            🐶📊
          </text>
        </svg>
      </Frame>
      <Frame width={width} height={height} background="none">
        <Chart
          options={options}
          series={series}
          type={chartType}
          width={width}
          height={height}
        />
      </Frame>
    </>
  );
};

function makeSeries(seriesCount: number, points: number) {
  function genDateValue(n: number) {
    return Array(n)
      .fill(1)
      .map((d, i) => {
        return {
          date: new Date(Date.now() - i * 3600000),
          value: Math.max(250, (Math.random() * 3000) | 0)
        };
      });
  }
  return Array(seriesCount)
    .fill({
      data: []
    })
    .map(s => {
      return {
        data: genDateValue(points).map(v => [v.date, v.value])
      };
    });
}

Charting.defaultProps = {
  width: 800,
  height: 600,
  chartType: ChartTypes.Area,
  isHorizontal: false,
  points: 5,
  seriesCount: 1,
  fillType: "gradient",
  fillOpacity: 0.8,
  stroke: 5,
  showStroke: true,
  strokeCurve: "smooth",
  palette: "palette1",
  showToolbar: true,
  showLegend: true,
  showXaxis: true,
  showYaxis: false,
  isStacked: false,
  colors: []
} as Props;
