import { TopBar } from "@/components/TopBar";
import { describe, expect, it } from "@/setupTests";
import { render } from "@testing-library/react";


describe("TopBar", () => {
  it('TopBar', () => {
    render(<TopBar/>);
    const topBar = document.querySelector('div');
    expect(topBar).toBeInTheDocument();
    
  })
});