import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";

import { useAppRouter } from "hooks/useAppRouter";
import { useUnsavedChangesBlocker } from "hooks/useUnsavedChangesBlocker";

import { Link } from "components/ui/Link";

import { mockNavigate, renderWithRouter } from "test/router";

const LINK_LABEL = "Go to recipes";
const BUTTON_LABEL = "Navigate";
const BLOCKED_LABEL = "Blocked";
const TARGET = "/all-recipes";

interface GuardedFormProps {
    isDirty: boolean;
}

// stands in for a create/edit form: holds dirtiness in a ref exactly as useDirtyRef does
const GuardedForm = ({ isDirty }: GuardedFormProps) => {
    const isDirtyRef = useRef(isDirty);
    const router = useAppRouter();
    const blocker = useUnsavedChangesBlocker(isDirty, isDirtyRef);

    return (
        <>
            <Link href={TARGET}>{LINK_LABEL}</Link>
            <button
                type="button"
                onClick={() => {
                    router.push(TARGET);
                }}
            >
                {BUTTON_LABEL}
            </button>
            {blocker.isBlocked && (
                <div>
                    <span>{BLOCKED_LABEL}</span>
                    <button type="button" onClick={blocker.proceed}>
                        Leave
                    </button>
                    <button type="button" onClick={blocker.reset}>
                        Stay
                    </button>
                </div>
            )}
        </>
    );
};

describe("NavigationBlockerProvider", () => {
    it("should let a link through when the form has no unsaved changes", async () => {
        renderWithRouter(<GuardedForm isDirty={false} />);

        await userEvent.click(screen.getByRole("link", { name: LINK_LABEL }));

        expect(mockNavigate).toHaveBeenCalledWith(TARGET);
        expect(screen.queryByText(BLOCKED_LABEL)).not.toBeInTheDocument();
    });

    it("should block a link click when the form has unsaved changes", async () => {
        renderWithRouter(<GuardedForm isDirty />);

        await userEvent.click(screen.getByRole("link", { name: LINK_LABEL }));

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByText(BLOCKED_LABEL)).toBeInTheDocument();
    });

    it("should block a programmatic navigation when the form has unsaved changes", async () => {
        renderWithRouter(<GuardedForm isDirty />);

        await userEvent.click(
            screen.getByRole("button", { name: BUTTON_LABEL }),
        );

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByText(BLOCKED_LABEL)).toBeInTheDocument();
    });

    it("should run the blocked navigation once the user confirms leaving", async () => {
        renderWithRouter(<GuardedForm isDirty />);

        await userEvent.click(screen.getByRole("link", { name: LINK_LABEL }));
        await userEvent.click(screen.getByRole("button", { name: "Leave" }));

        expect(mockNavigate).toHaveBeenCalledWith(TARGET);
    });

    it("should drop the blocked navigation when the user chooses to stay", async () => {
        renderWithRouter(<GuardedForm isDirty />);

        await userEvent.click(screen.getByRole("link", { name: LINK_LABEL }));
        await userEvent.click(screen.getByRole("button", { name: "Stay" }));

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.queryByText(BLOCKED_LABEL)).not.toBeInTheDocument();
    });

    it("should ask the browser to confirm a reload while there are unsaved changes", () => {
        renderWithRouter(<GuardedForm isDirty />);

        const event = new Event("beforeunload", { cancelable: true });

        act(() => {
            window.dispatchEvent(event);
        });

        expect(event.defaultPrevented).toBe(true);
    });

    it("should let a reload through when there are no unsaved changes", () => {
        renderWithRouter(<GuardedForm isDirty={false} />);

        const event = new Event("beforeunload", { cancelable: true });

        act(() => {
            window.dispatchEvent(event);
        });

        expect(event.defaultPrevented).toBe(false);
    });

    it("should re-arm the guard and ask when the back button leaves a dirty form", () => {
        renderWithRouter(<GuardedForm isDirty />);

        act(() => {
            window.dispatchEvent(
                new PopStateEvent("popstate", { state: null }),
            );
        });

        expect(screen.getByText(BLOCKED_LABEL)).toBeInTheDocument();
    });

    it("should leave the back button alone for a form with nothing to lose", () => {
        renderWithRouter(<GuardedForm isDirty={false} />);

        act(() => {
            window.dispatchEvent(
                new PopStateEvent("popstate", { state: null }),
            );
        });

        expect(screen.queryByText(BLOCKED_LABEL)).not.toBeInTheDocument();
    });

    it("should not add a history entry until the form has something to lose", () => {
        const before = window.history.length;

        renderWithRouter(<GuardedForm isDirty={false} />);

        expect(window.history).toHaveLength(before);
    });

    it("should stay put when a history step lands on the duplicate entry itself", () => {
        renderWithRouter(<GuardedForm isDirty />);

        const back = jest.spyOn(window.history, "back");

        act(() => {
            window.dispatchEvent(
                new PopStateEvent("popstate", {
                    state: { unsavedChangesGuard: true },
                }),
            );
        });

        expect(back).not.toHaveBeenCalled();
        expect(screen.queryByText(BLOCKED_LABEL)).not.toBeInTheDocument();
    });
});
