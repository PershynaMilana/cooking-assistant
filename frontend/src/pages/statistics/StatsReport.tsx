import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import montserrat from "../../assets/fonts/Montserrat/Montserrat-Regular.ttf";
import axios from "axios";

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
    line: {
        borderBottom: "1px solid black",
        marginTop: 20,
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        textAlign: "right",
        marginTop: 5,
        marginRight: 20,
    },
    listItem: {
        fontFamily: "Montserrat",
        marginLeft: 10,
        fontSize: 12,
    },
});

interface StatsReportProps {
    reportTime: Date;
    stats: any[];
}

interface Stat {
    typeName: string;
    count: number;
}

interface Recipe {
    id: number;
    title: string;
    cooking_time: number;
    type_name: string;
    ingredients: string[];
}

const StatsReport: React.FC<StatsReportProps> = ({ reportTime }) => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [fastestRecipes, setFastestRecipes] = useState<Recipe[]>([]);
    const [slowestRecipes, setSlowestRecipes] = useState<Recipe[]>([]);
    const [mostIngredientsRecipes, setMostIngredientsRecipes] = useState<Recipe[]>([]);
    const [leastIngredientsRecipes, setLeastIngredientsRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:8080/api/recipes", {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });
                const recipes: Recipe[] = response.data;

                // Count recipes per type
                const typeCounts: { [key: string]: number } = {};
                recipes.forEach((recipe) => {
                    typeCounts[recipe.type_name] = (typeCounts[recipe.type_name] || 0) + 1;
                });

                const formattedStats = Object.keys(typeCounts).map((typeName) => ({
                    typeName,
                    count: typeCounts[typeName],
                }));
                setStats(formattedStats);

                // Find recipes by cooking time
                if (recipes.length > 0) {
                    const minTime = Math.min(...recipes.map((recipe) => recipe.cooking_time));
                    const maxTime = Math.max(...recipes.map((recipe) => recipe.cooking_time));

                    setFastestRecipes(recipes.filter((recipe) => recipe.cooking_time === minTime));
                    setSlowestRecipes(recipes.filter((recipe) => recipe.cooking_time === maxTime));

                    // Find recipes by number of ingredients
                    const maxIngredients = Math.max(...recipes.map((recipe) => recipe.ingredients.length));
                    const minIngredients = Math.min(...recipes.map((recipe) => recipe.ingredients.length));

                    setMostIngredientsRecipes(recipes.filter((recipe) => recipe.ingredients.length === maxIngredients));
                    setLeastIngredientsRecipes(recipes.filter((recipe) => recipe.ingredients.length === minIngredients));
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Recipe Types:</Text>
                    {stats.map((stat) => (
                        <Text key={stat.typeName} style={styles.text}>
                            {stat.typeName}: {stat.count}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Fastest Recipes:</Text>
                    {fastestRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.cooking_time} min)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Slowest Recipes:</Text>
                    {slowestRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.cooking_time} min)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Recipes with Most Ingredients:</Text>
                    {mostIngredientsRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.ingredients.length} ingredients)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Recipes with Least Ingredients:</Text>
                    {leastIngredientsRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.ingredients.length} ingredients)
                        </Text>
                    ))}
                </View>

                {/* Line before the date */}
                <View style={styles.line} />

                <View style={styles.section}>
                    <Text style={styles.date}>{formatDate(reportTime)}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default StatsReport;
