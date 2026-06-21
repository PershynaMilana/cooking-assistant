import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

import { flushMacrotasks } from "test/flush";

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

    it("should call the first download handler when the first button is clicked", async () => {
        const onDownload1 = jest.fn().mockResolvedValue(undefined);

        render(
            <ReportDownloadButtons
                label1="Report 1"
                label2="Report 2"
                onDownload1={onDownload1}
                onDownload2={jest.fn().mockResolvedValue(undefined)}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Report 1" }));

        expect(onDownload1).toHaveBeenCalledTimes(1);
    });

    it("should call the second download handler when the second button is clicked", async () => {
        const onDownload2 = jest.fn().mockResolvedValue(undefined);

        render(
            <ReportDownloadButtons
                label1="Report 1"
                label2="Report 2"
                onDownload1={jest.fn().mockResolvedValue(undefined)}
                onDownload2={onDownload2}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Report 2" }));

        expect(onDownload2).toHaveBeenCalledTimes(1);
    });

    it("should disable both buttons while a download is in progress", async () => {
        let resolveDownload: () => void = () => undefined;
        const onDownload1 = jest.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveDownload = resolve;
                }),
        );

        render(
            <ReportDownloadButtons
                label1="Report 1"
                label2="Report 2"
                onDownload1={onDownload1}
                onDownload2={jest.fn().mockResolvedValue(undefined)}
            />,
        );

        const button1 = screen.getByRole("button", { name: "Report 1" });
        const button2 = screen.getByRole("button", { name: "Report 2" });

        await userEvent.click(button1);

        expect(button1).toBeDisabled();
        expect(button2).toBeDisabled();

        resolveDownload();
        await flushMacrotasks();

        expect(button1).not.toBeDisabled();
        expect(button2).not.toBeDisabled();
    });
});
