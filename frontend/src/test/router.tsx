import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

// shared navigate spy for tests that partially mock react-router-dom's
// useNavigate (the jest.mock call itself stays in each file due to hoisting)
export const mockNavigate = jest.fn();

export const renderWithRouter = (
    ui: ReactElement,
    // neutral non-root default: SearchComponent infinite-loops at pathname "/"
    initialEntries: string[] = ["/test"],
) => render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
