import InvestigationForm from "@/components/forms/investigation";
import PaymentForm from "@/components/forms/payment";
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
            <DialogTitle>Update payment.</DialogTitle>
            <DialogDescription>Update payment.</DialogDescription>
          </DialogHeader>
          <PaymentForm
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
