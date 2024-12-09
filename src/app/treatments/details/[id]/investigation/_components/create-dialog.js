import InvestigationForm from "@/components/forms/investigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DentalNoteCreateDialog({ isOpen, setIsOpen, treatmentId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create dental note.</DialogTitle>
            <DialogDescription>You can create a dental note.</DialogDescription>
          </DialogHeader>
          <InvestigationForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
