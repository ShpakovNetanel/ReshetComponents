export const relevantReportTypes = (reportType: number, materialType: string) =>
    materialType === 'tool'
        ? [1]
        : [reportType];
