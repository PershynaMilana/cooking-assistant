import { Document, Page, Text, View } from "@react-pdf/renderer";
import React from "react";

import { formatDateTime } from "utils/dateUtils";

import { reportStyles } from "./reportStyles";

interface PdfReportLayoutProps {
    reportTime: Date;
    language: string;
    // already-translated error message; the error block is omitted when empty
    error?: string | null;
    children: React.ReactNode;
}

// shared shell for the statistics PDF reports: a single A4 page with an optional
// error block, the report body, and a timestamped footer. Both StatsReport and
// StatsReportSecond fill the body; the page/footer/error structure lives here once.
export const PdfReportLayout: React.FC<PdfReportLayoutProps> = ({
    reportTime,
    language,
    error,
    children,
}) => (
    <Document>
        <Page size="A4" style={reportStyles.page}>
            {error && (
                <View style={reportStyles.section}>
                    <Text style={reportStyles.errorText}>{error}</Text>
                </View>
            )}

            {children}

            <View style={reportStyles.line} />
            <View style={reportStyles.section}>
                <Text style={reportStyles.date}>
                    {formatDateTime(reportTime, language)}
                </Text>
            </View>
        </Page>
    </Document>
);
