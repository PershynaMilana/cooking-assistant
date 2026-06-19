import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";

interface ReportDownloadButtonsProps {
    document1: React.ReactElement;
    document2: React.ReactElement;
    label1: string;
    label2: string;
    onGenerate: () => void;
}

const BUTTON_CLASS =
    "bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full";

export const ReportDownloadButtons: React.FC<ReportDownloadButtonsProps> = ({
    document1,
    document2,
    label1,
    label2,
    onGenerate,
}) => (
    <div className="flex my-5 flex-col space-y-4">
        <PDFDownloadLink
            document={document1}
            fileName="Statistics_Report.pdf"
            onClick={onGenerate}
            className={BUTTON_CLASS}
        >
            {label1}
        </PDFDownloadLink>
        <PDFDownloadLink
            document={document2}
            fileName="Statistics_Second_Report.pdf"
            onClick={onGenerate}
            className={BUTTON_CLASS}
        >
            {label2}
        </PDFDownloadLink>
    </div>
);
