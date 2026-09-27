import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function ShowMoreDefault21B111CBExample() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
