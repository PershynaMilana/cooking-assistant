import { Font, StyleSheet } from "@react-pdf/renderer";

import montserratMedium from "assets/fonts/Montserrat/Montserrat-Medium.ttf";
import montserratRegular from "assets/fonts/Montserrat/Montserrat-Regular.ttf";

// Montserrat ships Cyrillic glyphs, so reports render ru/uk text correctly. The
// Medium weight backs bold/semibold headings (otherwise they fall back to Regular).
Font.register({
    family: "Montserrat",
    fonts: [
        { src: montserratRegular },
        { src: montserratMedium, fontWeight: 600 },
    ],
});

export const reportStyles = StyleSheet.create({
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
    line: {
        borderBottom: "1px solid black",
        marginTop: 20,
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        textAlign: "right",
        marginTop: 10,
        marginRight: 20,
    },
    errorText: {
        fontFamily: "Montserrat",
        fontSize: 12,
        color: "red",
        marginBottom: 10,
    },
});
