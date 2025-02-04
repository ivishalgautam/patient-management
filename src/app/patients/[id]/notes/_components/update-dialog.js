import DentalNoteForm from "@/components/forms/treatment-plan";
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
  patientId,
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
          <DentalNoteForm
            patientId={patientId}
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
