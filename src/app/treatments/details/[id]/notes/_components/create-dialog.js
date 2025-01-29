import NoteForm from "@/components/forms/note";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DentalNoteCreateDialog({ isOpen, setIsOpen, treatmentId }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create note.</DialogTitle>
          <DialogDescription>You can create a note.</DialogDescription>
        </DialogHeader>
        <NoteForm treatmentId={treatmentId} closeDialog={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
