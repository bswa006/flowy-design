import * as React from "react";

import {
  Calendar,
  CircleCheck,
  Clock,
  Edit,
  FileText,
  Mic,
  User,
} from "lucide-react";

import { DraggableTextCard } from "@/components/DraggableTextCard";
import { MercuryButton } from "@/components/mercury/MercuryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Context } from "@/lib/contextMockData";

interface MainCardProps {
  context: Context;
  onToggleInsights: () => void;
  onPriorityChange?: (priority: string) => void;
  contextNumber: number;
  handleEdit: () => void;
}

export function MainCard({
  context,
  onToggleInsights,
  onPriorityChange,
  handleEdit,
  contextNumber,
}: MainCardProps) {
  const [priority, setPriority] = React.useState(context.upload.priority);

  React.useEffect(() => {
    setPriority(context.upload.priority);
  }, [context.upload.priority]);

  function handlePriorityChange(value: string) {
    setPriority(value);
    onPriorityChange?.(value);
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger insights if clicking on DraggableTextCard or its children
    if ((e.target as HTMLElement).closest('.draggable-text-card, .mercury-module')) {
      return;
    }
    onToggleInsights();
  };

  return (
    <div onClick={handleCardClick} className="space-y-4">
      <div className="text-md font-medium text-gray-900 truncate flex items-center gap-2">
        {contextNumber}. {context.upload.file_name}
      </div>
      <div className="space-y-1">
        <span className="text-xs text-gray-800 font-medium ml-2">
          Description
        </span>
        <DraggableTextCard
          description={context.upload.description}
          onCreateInsight={() => console.log('Create insight for description')}
          handleEdit={handleEdit}
        />
      </div>

      <div className="space-y-1">
        <span className="text-xs text-gray-800 font-medium ml-2">Summary</span>
        <DraggableTextCard
          description={context.upload.summary}
          onCreateInsight={() => console.log('Create insight for summary')}
          handleEdit={handleEdit}
        />
      </div>

      {context.upload.is_checkpoint && (
        <div className="flex items-center gap-2">
          <CircleCheck className="w-5 h-5 text-emerald-700" />
          <span className="text-emerald-700 font-semibold text-xs">
            Checkpoint
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 text-xs">
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          <Mic className="w-4 h-4" />
          <span>Audio</span>
        </div>
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(context.upload.recorded_on).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          <FileText className="w-4 h-4" />
          <span className="font-medium truncate max-w-[140px]">
            {context.upload.content_type}
          </span>
        </div>
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          <User className="w-4 h-4" />
          <span className="truncate max-w-[140px]">
            {context.upload.participants?.[0] || "afsheenamroliwala@gmail.com"}
          </span>
        </div>
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          {/* <DollarSign className="w-4 h-4" /> */}
          <span className="font-medium truncate max-w-[140px]">
            {String(context?.extracted_metadata?.pricing_expectation ?? "")}
          </span>
        </div>
        <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
          <Clock className="w-4 h-4" />
          <span className="truncate max-w-[140px]">
            {String(context?.extracted_metadata?.expected_time_savings ?? "")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-800 font-medium">Priority:</label>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger
              className="px-2 py-1.5 w-fit text-xs bg-gray-50 border-gray-200"
              aria-label="Priority"
            >
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white text-xs">
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MercuryButton
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="flex-1 rounded-md flex items-center justify-center bg-black gap-2 px-3 py-1.5 text-sm"
          title="Edit"
          intent="edit-context"
          focusLevel="ambient"
          type="button"
        >
          <Edit className="w-4 h-4" />
          Edit Context
        </MercuryButton>
      </div>
    </div>
  );
}
