import { render, screen } from "@testing-library/react";

import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

describe("ReportDownloadButtons", () => {
    it("should render both download buttons", () => {
        render(
            <ReportDownloadButtons
                label1="Report 1"
                label2="Report 2"
                onDownload1={jest.fn()}
                onDownload2={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Report 1" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Report 2" }),
        ).toBeInTheDocument();
    });
});
