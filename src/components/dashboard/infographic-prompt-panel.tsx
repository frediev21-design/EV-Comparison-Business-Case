"use client";

import { useMemo, useState } from "react";
import { useCaseStore } from "@/store/case-store";
import {
  generateInfographicPrompt,
  isInfographicPromptReady,
  copyInfographicPrompt,
  chatGptUrl,
} from "@/lib/infographic-prompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Copy, ExternalLink, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface InfographicPromptPanelProps {
  className?: string;
  defaultOpen?: boolean;
  /** Inline button only — panel controlled externally */
  buttonOnly?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InfographicPromptPanel({
  className,
  defaultOpen = false,
  buttonOnly = false,
  open: controlledOpen,
  onOpenChange,
}: InfographicPromptPanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const caseName = useCaseStore((s) => s.caseName);

  const ready = isInfographicPromptReady(input);
  const prompt = useMemo(
    () => generateInfographicPrompt(input, result, caseName),
    [input, result, caseName]
  );

  const handleCopy = async () => {
    try {
      await copyInfographicPrompt(prompt);
      showToast("Infographic prompt copied — paste into ChatGPT", "success");
    } catch {
      showToast("Could not copy to clipboard", "error");
    }
  };

  const handleOpenChatGpt = async () => {
    try {
      await copyInfographicPrompt(prompt);
      showToast("Prompt copied — paste into ChatGPT to generate your infographic", "success");
      window.open(chatGptUrl(), "_blank", "noopener,noreferrer");
    } catch {
      showToast("Could not copy to clipboard", "error");
    }
  };

  const toggle = () => setOpen(!open);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!ready}
          onClick={() => {
            if (buttonOnly) {
              void handleCopy();
              return;
            }
            toggle();
          }}
          title={
            ready
              ? "Generate a ChatGPT prompt to create an infographic from your analysis"
              : "Complete Current Vehicle, New Vehicle, and Trade-In first"
          }
        >
          <Sparkles className="mr-2 h-4 w-4" />
          AI infographic prompt
          {!buttonOnly && (open ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          ))}
        </Button>
        {ready && (
          <>
            <Button variant="ghost" size="sm" onClick={() => void handleCopy()}>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void handleOpenChatGpt()}>
              <ExternalLink className="mr-1 h-3 w-3" />
              Open ChatGPT
            </Button>
          </>
        )}
      </div>

      {!ready && (
        <p className="text-xs text-muted-foreground">
          Complete the Current Vehicle, New Vehicle, and Trade-In steps to unlock the
          infographic prompt.
        </p>
      )}

      {!buttonOnly && open && ready && (
        <Card className="border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ChatGPT infographic prompt</CardTitle>
            <p className="text-xs text-muted-foreground">
              Copy this prompt into ChatGPT (or Claude) and ask it to generate an infographic
              image. Includes your KPIs, comparison, trade-in flow, and recommendation.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              readOnly
              value={prompt}
              rows={16}
              className="w-full resize-y rounded-md border border-input bg-muted/30 p-3 font-mono text-xs leading-relaxed"
              onFocus={(e) => e.target.select()}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => void handleCopy()}>
                <Copy className="mr-2 h-4 w-4" />
                Copy prompt
              </Button>
              <Button size="sm" variant="outline" onClick={() => void handleOpenChatGpt()}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Copy & open ChatGPT
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
