import React from "react";

interface ReportDownloadButtonsProps {
    label1: string;
    label2: string;
    onDownload1: () => Promise<void>;
    onDownload2: () => Promise<void>;
}

const BUTTON_CLASS =
    "bg-perfect-purple my-1 font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full disabled:opacity-50";

export const ReportDownloadButtons: React.FC<ReportDownloadButtonsProps> = ({
    label1,
    label2,
    onDownload1,
    onDownload2,
}) => {
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleDownload = async (download: () => Promise<void>) => {
        setIsGenerating(true);
        try {
            await download();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex my-5 flex-col space-y-4">
            <button
                className={BUTTON_CLASS}
                disabled={isGenerating}
                onClick={() => {
                    void handleDownload(onDownload1);
                }}
            >
                {label1}
            </button>
            <button
                className={BUTTON_CLASS}
                disabled={isGenerating}
                onClick={() => {
                    void handleDownload(onDownload2);
                }}
            >
                {label2}
            </button>
        </div>
    );
};
