import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import React, { useCallback, useEffect, useState } from "react";

import type { AverageCookingTime } from "types/stats";

import { getApiErrorMessage } from "api/httpError";
import { getMenus } from "api/menusApi";
import { getRecipes } from "api/recipesApi";
import { getRecipesStats } from "api/statsApi";

import montserrat from "assets/fonts/Montserrat/Montserrat-Regular.ttf";

Font.register({ family: "Montserrat", src: montserrat });

const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    return date.toLocaleString("en-GB", options);
};

const styles = StyleSheet.create({
    page: {
        fontFamily: "Montserrat",
        flexDirection: "column",
        padding: 20,
    },
    section: {
        fontFamily: "Montserrat",
        marginBottom: 10,
    },
    title: {
        fontFamily: "Montserrat",
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
    },
    subtitle: {
        fontFamily: "Montserrat",
        fontSize: 14,
        marginBottom: 5,
        fontWeight: "semibold",
        marginTop: 20,
    },
    text: {
        fontFamily: "Montserrat",
        fontSize: 12,
        marginBottom: 3,
    },
    listItem: {
        fontFamily: "Montserrat",
        marginLeft: 10,
        fontSize: 12,
    },
    date: {
        fontSize: 12,
        textAlign: "right",
        marginTop: 10,
        marginRight: 20,
    },
    horizontalLine: {
        borderBottom: "1px solid black",
        marginVertical: 10,
    },
    errorText: {
        fontFamily: "Montserrat",
        fontSize: 12,
        color: "red",
        marginBottom: 10,
    },
});

interface Menu {
    categoryname: string;
    menuCount: number;
}

interface StatsReportSecondProps {
    reportTime: Date;
}

const StatsReportSecond: React.FC<StatsReportSecondProps> = ({
    reportTime,
}) => {
    const token = localStorage.getItem("authToken");
    const [menusCount, setMenusCount] = useState(0);
    const [recipesCount, setRecipesCount] = useState(0);
    const [averageCookingTimes, setAverageCookingTimes] = useState<
        AverageCookingTime[]
    >([]);
    const [menuCountByCategory, setMenuCountByCategory] = useState<Menu[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setError(null);
        if (!token) {
            setError("No auth token found.");

            return;
        }

        try {
            const allMenus = await getMenus({});

            setMenusCount(allMenus.length);

            const categoryCounts: Record<string, number> = {};

            allMenus.forEach((menu: { categoryname: string }) => {
                categoryCounts[menu.categoryname] =
                    (categoryCounts[menu.categoryname] || 0) + 1;
            });

            const categoryStats = Object.entries(categoryCounts).map(
                ([categoryname, menuCount]) => ({
                    categoryname,
                    menuCount,
                }),
            );

            setMenuCountByCategory(categoryStats);

            const allRecipes = await getRecipes();

            setRecipesCount(allRecipes.length);

            const avgCookingTimes = await getRecipesStats();

            if (Array.isArray(avgCookingTimes.averageCookingTimes)) {
                const formattedTimes = avgCookingTimes.averageCookingTimes.map(
                    (item: {
                        averageCookingTime: string;
                        typeName: string;
                    }) => {
                        const averageCookingTime = parseFloat(
                            item.averageCookingTime,
                        );
                        const hours = Math.floor(averageCookingTime / 60);
                        const minutes = Math.round(averageCookingTime % 60);

                        return {
                            typeName: item.typeName,
                            averageCookingTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
                        };
                    },
                );

                setAverageCookingTimes(formattedTimes);
            } else {
                setAverageCookingTimes([]);
            }
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            void fetchStats();
        }
    }, [token, fetchStats]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Statistics Report</Text>
                </View>

                {error && (
                    <View style={styles.section}>
                        <Text style={styles.errorText}>Error: {error}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Total number of menus: {menusCount}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Total number of recipes: {recipesCount}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Average cooking time by recipe types:
                    </Text>
                    {averageCookingTimes.map((item) => (
                        <Text key={item.typeName} style={styles.text}>
                            {item.typeName}: {item.averageCookingTime} min
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Number of menus per category:
                    </Text>
                    {menuCountByCategory.map((category) => (
                        <Text key={category.categoryname} style={styles.text}>
                            {category.categoryname}: {category.menuCount}
                        </Text>
                    ))}
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.section}>
                    <Text style={styles.date}>{formatDate(reportTime)}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default StatsReportSecond;
