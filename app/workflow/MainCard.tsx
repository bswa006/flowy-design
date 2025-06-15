import * as React from "react";
import { CircleCheck, Clock, FileText, Mic, User } from "lucide-react";
import { Context } from "@/lib/contextMockData";

interface MainCardProps {
  context: Context;
  onToggleInsights: () => void;
}

export function MainCard({ context, onToggleInsights }: MainCardProps) {
  return (
    <div onClick={onToggleInsights}>
      <div className="text-lg font-bold text-gray-900 mb-1 truncate">
        {context.upload.file_name}
      </div>
      <div className="text-base text-gray-700 mb-2 truncate">
        {context.upload.description}
      </div>
      <div className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-4">
        {context.upload.summary}
      </div>
      <div className="flex flex-row gap-8 my-2 text-gray-600 text-sm">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-200 rounded-full px-2">
            <Mic className="w-4 h-4" />
            <span>Audio</span>
          </div>
          <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-200 rounded-full px-2">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(context.upload.recorded_on).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-200 rounded-full px-2">
            <FileText className="w-4 h-4" />
            <span className="font-medium truncate max-w-[140px]">
              {context.upload.file_name}
            </span>
          </div>
          <div className="flex items-center gap-1 w-fit bg-gray-50 border border-gray-200 rounded-full px-2">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[140px]">
              {context.upload.participants?.[0] ||
                "afsheenamroliwala@gmail.com"}
            </span>
          </div>
        </div>
      </div>
      {context.upload.is_checkpoint && (
        <div className="flex items-center gap-2 mt-2">
          <CircleCheck className="w-5 h-5 text-emerald-700" />
          <span className="text-emerald-700 font-semibold text-sm">
            Checkpoint
          </span>
        </div>
      )}
    </div>
  );
}
