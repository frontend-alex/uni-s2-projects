import { memo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { TriggerWrapper } from "@/components/TriggerWrapper";

interface GlobalDialogProps {
  icon?: any;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  buttonText?: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  content?: ReactNode; // ← You can pass any JSX here
  hideFooter?: boolean; // optional if you don't want confirm/cancel buttons
}

const GlobalDialog = ({
  onConfirm,
  icon: Icon = Trash,
  title = "Confirmation Required",
  description = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  buttonText = "Open Dialog",
  isLoading = false,
  children,
  content,
  hideFooter = false,
}: GlobalDialogProps) => {
  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex-start font-normal hover:text-primary -ml-[2px] group cursor-pointer"
        >
          <Icon className="mr-[1px] h-4 w-4 text-stone-400 group-hover:text-primary" />
          {buttonText}
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>

            {/* Dynamic content slot */}
            {content && <div className="py-2">{content}</div>}

            {!hideFooter && (
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                {onConfirm && (
                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirm();
                      setOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : confirmText}
                  </Button>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </TriggerWrapper>
  );
};

export default memo(GlobalDialog);
