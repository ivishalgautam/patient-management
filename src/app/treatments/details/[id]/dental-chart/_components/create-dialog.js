import DentalNoteForm from "@/components/forms/dental-note";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DentalNoteCreateDialog({
  isOpen,
  setIsOpen,
  treatmentId,
  affectedTooth,
  id,
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create dental note.</DialogTitle>
            <DialogDescription>You can create a dental note.</DialogDescription>
          </DialogHeader>
          <DentalNoteForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
            affectedTooth={affectedTooth}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
