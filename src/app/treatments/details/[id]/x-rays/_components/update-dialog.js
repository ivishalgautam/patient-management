import DentalNoteForm from "@/components/forms/dental-note";
import XrayForm from "@/components/forms/xray";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UpdateDialog({
  isOpen,
  setIsOpen,
  treatmentId,
  id,
  updateMutation,
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update dental note.</DialogTitle>
            <DialogDescription>Update dental note.</DialogDescription>
          </DialogHeader>
          <XrayForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
            id={id}
            type="edit"
            updateMutation={updateMutation}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
