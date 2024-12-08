import React, {useEffect, useState} from "react";
import {Document, Page, Text, View, StyleSheet, Font} from "@react-pdf/renderer";
import montserrat from "../../assets/fonts/Montserrat/Montserrat-Regular.ttf";
import axios from "axios";

Font.register({ family: 'Montserrat', src: montserrat });

const formatDate = (date: Date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    // @ts-ignore
    return date.toLocaleString('uk-UA', options);
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Montserrat',
        flexDirection: "column",
        padding: 20,
    },
    section: {
        fontFamily: 'Montserrat',
        marginBottom: 10,
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'semibold',
        marginTop: 20,
    },
    text: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        marginBottom: 3,
    },
    date: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: -30,
        marginRight: 20,
    },
    listItem: {
        fontFamily: 'Montserrat',
        marginLeft: 10,
        fontSize: 12,
    },
});

interface StatsReportProps {
    reportTime: Date;
    stats: any[];
}
interface Stat {
    typeName: string; // Название типа рецепта
    count: number; // Количество рецептов этого типа
}

interface Recipe {
    id: number; // Уникальный идентификатор рецепта
    title: string; // Название рецепта
    cooking_time: number; // Время приготовления в минутах
    type_name: string; // Название типа рецепта
    ingredients: string[]; // Список ингредиентов
}

const StatsReport: React.FC<StatsReportProps> = ({ reportTime }) => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [fastestRecipes, setFastestRecipes] = useState<Recipe[]>([]);
    const [slowestRecipes, setSlowestRecipes] = useState<Recipe[]>([]);
    const [mostIngredientsRecipes, setMostIngredientsRecipes] = useState<
        Recipe[]
    >([]);
    const [leastIngredientsRecipes, setLeastIngredientsRecipes] = useState<
        Recipe[]
    >([]);

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

                // Подсчёт количества рецептов по типам
                const typeCounts: { [key: string]: number } = {};
                recipes.forEach((recipe) => {
                    typeCounts[recipe.type_name] =
                        (typeCounts[recipe.type_name] || 0) + 1;
                });

                const formattedStats = Object.keys(typeCounts).map((typeName) => ({
                    typeName,
                    count: typeCounts[typeName],
                }));
                setStats(formattedStats);

                // Поиск рецептов по времени приготовления
                if (recipes.length > 0) {
                    const minTime = Math.min(
                        ...recipes.map((recipe) => recipe.cooking_time)
                    );
                    const maxTime = Math.max(
                        ...recipes.map((recipe) => recipe.cooking_time)
                    );

                    setFastestRecipes(
                        recipes.filter((recipe) => recipe.cooking_time === minTime)
                    );
                    setSlowestRecipes(
                        recipes.filter((recipe) => recipe.cooking_time === maxTime)
                    );

                    // Поиск рецептов по количеству ингредиентов
                    const maxIngredients = Math.max(
                        ...recipes.map((recipe) => recipe.ingredients.length)
                    );
                    const minIngredients = Math.min(
                        ...recipes.map((recipe) => recipe.ingredients.length)
                    );

                    setMostIngredientsRecipes(
                        recipes.filter(
                            (recipe) => recipe.ingredients.length === maxIngredients
                        )
                    );
                    setLeastIngredientsRecipes(
                        recipes.filter(
                            (recipe) => recipe.ingredients.length === minIngredients
                        )
                    );
                }
            } catch (error) {
                console.error("Ошибка получения статистики:", error);
            }
        };

        fetchStats();
    }, []);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Звіт по статистиці</Text>
                    <Text style={styles.date}>{formatDate(reportTime)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Типи рецептів:</Text>
                    {stats.map((stat) => (
                        <Text key={stat.typeName} style={styles.text}>
                            {stat.typeName}: {stat.count}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Найшвидші рецепти:</Text>
                    {fastestRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.cooking_time} хв.)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Найдовші рецепти:</Text>
                    {slowestRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.cooking_time} хв.)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Рецепти з найбільшою кількістю інгредієнтів:
                    </Text>
                    {mostIngredientsRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.ingredients.length} інг.)
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        Рецепти з найменшою кількістю інгредієнтів:
                    </Text>
                    {leastIngredientsRecipes.map((recipe) => (
                        <Text key={recipe.id} style={styles.listItem}>
                            {recipe.title} ({recipe.ingredients.length} інг.)
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default StatsReport;
