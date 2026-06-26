import { triggerDownload } from "utils/triggerDownload";

describe("triggerDownload", () => {
    it("should create an object url, click an anchor and revoke the url", () => {
        const createObjectURL = jest.fn(() => "blob:url");
        const revokeObjectURL = jest.fn();

        URL.createObjectURL = createObjectURL;
        URL.revokeObjectURL = revokeObjectURL;

        const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click");
        const blob = new Blob(["report"]);

        triggerDownload(blob, "Report.pdf");

        expect(createObjectURL).toHaveBeenCalledWith(blob);
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");
    });
});
