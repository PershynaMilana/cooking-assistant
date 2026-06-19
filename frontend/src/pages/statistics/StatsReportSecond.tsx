import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { useTranslation } from "react-i18next";

import type { AverageCookingTime, MenuCategoryStat } from "types/stats";

import { PdfReportLayout } from "./PdfReportLayout";
import { PdfStatList } from "./PdfStatList";
import { reportStyles } from "./reportStyles";

interface StatsReportSecondProps {
    reportTime: Date;
    menusCount: number;
    recipesCount: number;
    averageCookingTimes: AverageCookingTime[];
    menuCountByCategory: MenuCategoryStat[];
    error: string | null;
}

export const StatsReportSecond: React.FC<StatsReportSecondProps> = ({
    reportTime,
    menusCount,
    recipesCount,
    averageCookingTimes,
    menuCountByCategory,
    error,
}) => {
    const { t, i18n } = useTranslation("stats");

    return (
        <PdfReportLayout
            reportTime={reportTime}
            language={i18n.language}
            error={
                error ? t("statsReportSecond.error", { message: error }) : null
            }
        >
            <View style={reportStyles.section}>
                <Text style={reportStyles.title}>
                    {t("statsReportSecond.title")}
                </Text>
            </View>

            <View style={reportStyles.section}>
                <Text style={reportStyles.subtitle}>
                    {t("statsReportSecond.totalMenus", { count: menusCount })}
                </Text>
            </View>

            <View style={reportStyles.section}>
                <Text style={reportStyles.subtitle}>
                    {t("statsReportSecond.totalRecipes", {
                        count: recipesCount,
                    })}
                </Text>
            </View>

            <PdfStatList
                title={t("statsReportSecond.avgCookingTime")}
                items={averageCookingTimes.map((item) => ({
                    label: item.typeName,
                    value: `${item.averageCookingTime}${t("statsReportSecond.timeUnit")}`,
                }))}
            />

            <PdfStatList
                title={t("statsReportSecond.menusByCategory")}
                items={menuCountByCategory.map((cat) => ({
                    label: cat.categoryname,
                    value: cat.menuCount,
                }))}
            />
        </PdfReportLayout>
    );
};
