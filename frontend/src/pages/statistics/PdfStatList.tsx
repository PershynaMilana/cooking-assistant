import { Text, View } from "@react-pdf/renderer";
import React from "react";

import { reportStyles } from "./reportStyles";

interface PdfStatItem {
    label: string;
    value: string | number;
}

interface PdfStatListProps {
    title: string;
    items: PdfStatItem[];
}

export const PdfStatList: React.FC<PdfStatListProps> = ({ title, items }) => (
    <View style={reportStyles.section}>
        <Text style={reportStyles.subtitle}>{title}</Text>
        {items.map((item) => (
            <Text key={item.label} style={reportStyles.text}>
                {item.label}: {String(item.value)}
            </Text>
        ))}
    </View>
);
