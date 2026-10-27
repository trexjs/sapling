import { useState } from "react";
import { Tabs, Tab } from "../../src/components/Tabs";
import { JwtDecoder } from "./JwtDecoder";
import { ArrayConverter } from "./ArrayConverter";

export function DevToolsShowcase() {
  const [selectedTool, setSelectedTool] = useState(0);

  return (
    <Tabs value={selectedTool} onChange={setSelectedTool}>
      <Tab label="JWT Decoder">
        <div style={{ marginTop: 24 }}>
          <JwtDecoder />
        </div>
      </Tab>
      <Tab label="thisArray">
        <div style={{ marginTop: 24 }}>
          <ArrayConverter />
        </div>
      </Tab>
    </Tabs>
  );
}
