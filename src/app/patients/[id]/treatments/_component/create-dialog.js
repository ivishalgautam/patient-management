import InvestigationForm from "@/components/forms/investigation";
import PaymentForm from "@/components/forms/payment";
import TreatmentForm from "@/components/forms/treatment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateDialog({ isOpen, setIsOpen, treatmentId, patientId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create treatment.</DialogTitle>
            <DialogDescription>You can create a treatment.</DialogDescription>
          </DialogHeader>
          <TreatmentForm
            patientId={patientId}
            closeDialog={setIsOpen}
            setIsOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
