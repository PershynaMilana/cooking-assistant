export const CHART_COLORS: string[] = [
    "#7E60BF",
    "#B692C2",
    "#8E72CC",
    "#C9A8DA",
    "#6B4FA8",
    "#E0A33E",
];

export const getChartColor = (index: number): string =>
    CHART_COLORS[index % CHART_COLORS.length];
