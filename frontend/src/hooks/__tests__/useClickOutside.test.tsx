import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";

import { useClickOutside } from "hooks/useClickOutside";

const Probe = ({ onOutside }: { onOutside: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, onOutside);

    return (
        <div>
            <div ref={ref}>
                <button>inside</button>
            </div>
            <button>outside</button>
        </div>
    );
};

describe("useClickOutside", () => {
    it("should call the handler when a click lands outside the element", async () => {
        const onOutside = jest.fn();

        render(<Probe onOutside={onOutside} />);

        await userEvent.click(screen.getByRole("button", { name: "outside" }));

        expect(onOutside).toHaveBeenCalledTimes(1);
    });

    it("should not call the handler when the click is inside the element", async () => {
        const onOutside = jest.fn();

        render(<Probe onOutside={onOutside} />);

        await userEvent.click(screen.getByRole("button", { name: "inside" }));

        expect(onOutside).not.toHaveBeenCalled();
    });
});
