import { render } from "@testing-library/react";

import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

jest.mock("@react-pdf/renderer", () => ({
    PDFDownloadLink: () => null,
    Document: () => null,
    Page: () => null,
    Text: () => null,
    View: () => null,
    StyleSheet: { create: (styles: unknown) => styles },
    Font: { register: () => undefined },
}));

describe("ReportDownloadButtons", () => {
    it("should render without errors", () => {
        const { container } = render(
            <ReportDownloadButtons
                document1={<div />}
                document2={<div />}
                label1="Report 1"
                label2="Report 2"
                onGenerate={jest.fn()}
            />,
        );

        expect(container).toBeInTheDocument();
    });
});
