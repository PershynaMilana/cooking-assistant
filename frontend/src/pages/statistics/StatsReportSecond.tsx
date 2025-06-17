import React, { useState, useEffect, useCallback } from "react";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import axios from "axios";
import montserrat from "../../assets/fonts/Montserrat/Montserrat-Regular.ttf";

Font.register({ family: "Montserrat", src: montserrat });

const formatDate = (date: Date) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    // @ts-ignore
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
});

interface Menu {
    categoryname: string;
    menuCount: number;
}

interface Recipe {
    id: number;
    title: string;
    averageCookingTime: number;
    typeName: string;
    ingredients: string[];
}

interface StatsReportSecondProps {
    reportTime: Date;
}

const StatsReportSecond: React.FC<StatsReportSecondProps> = ({ reportTime }) => {
    const token = localStorage.getItem("authToken");
    const [menusCount, setMenusCount] = useState(0);
    const [recipesCount, setRecipesCount] = useState(0);
    const [averageCookingTimes, setAverageCookingTimes] = useState<Recipe[]>([]);
    const [menuCountByCategory, setMenuCountByCategory] = useState<Menu[]>([]);
    const [error, setError] = useState("");
    const [noMenus, setNoMenus] = useState(false);

    const fetchStats = useCallback(async () => {
        setError("");
        setNoMenus(false);

        if (!token) {
            setError("Token not found");
            return;
        }

        try {
            const { data: allMenus } = await axios.get("http://localhost:8080/api/menu", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMenusCount(allMenus.length);

            const categoryCounts: Record<string, number> = {};
            allMenus.forEach((menu: { categoryname: string }) => {
                categoryCounts[menu.categoryname] = (categoryCounts[menu.categoryname] || 0) + 1;
            });

            const categoryStats = Object.entries(categoryCounts).map(([categoryname, menuCount]) => ({
                categoryname,
                menuCount,
            }));
            setMenuCountByCategory(categoryStats);

            const { data: allRecipes } = await axios.get("http://localhost:8080/api/recipes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecipesCount(allRecipes.length);

            const { data: avgCookingTimes } = await axios.get("http://localhost:8080/api/recipes-stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(avgCookingTimes.averageCookingTimes)) {
                const formattedTimes = avgCookingTimes.averageCookingTimes.map((item: { averageCookingTime: string; typeName: any; }) => {
                    const averageCookingTime = parseFloat(item.averageCookingTime);
                    const hours = Math.floor(averageCookingTime / 60);
                    const minutes = Math.round(averageCookingTime % 60);

                    return {
                        typeName: item.typeName,
                        averageCookingTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
                    };
                });
                setAverageCookingTimes(formattedTimes);
            } else {
                setAverageCookingTimes([]);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || error.message);
            } else {
                setError("Unknown error");
            }
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token, fetchStats]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Statistics Report</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Total number of menus: {menusCount}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Total number of recipes: {recipesCount}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Average cooking time by recipe types:</Text>
                    {averageCookingTimes.map((item) => (
                        <Text key={item.typeName} style={styles.text}>
                            {item.typeName}: {item.averageCookingTime} min
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Number of menus per category:</Text>
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
