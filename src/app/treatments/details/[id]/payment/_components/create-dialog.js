import InvestigationForm from "@/components/forms/investigation";
import PaymentForm from "@/components/forms/payment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateDialog({ isOpen, setIsOpen, treatmentId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create payment.</DialogTitle>
            <DialogDescription>You can create a payment.</DialogDescription>
          </DialogHeader>
          <PaymentForm treatmentId={treatmentId} closeDialog={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
