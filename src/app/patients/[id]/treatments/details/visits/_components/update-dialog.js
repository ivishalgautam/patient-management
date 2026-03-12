import TreatmentVisitForm from "@/components/forms/treatment-visit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
            <DialogTitle>Update visit.</DialogTitle>
            <DialogDescription>Update visit.</DialogDescription>
          </DialogHeader>
          <TreatmentVisitForm
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
