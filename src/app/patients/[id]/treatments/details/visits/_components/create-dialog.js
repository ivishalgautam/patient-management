import TreatmentVisitForm from "@/components/forms/treatment-visit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateDialog({ isOpen, setIsOpen, patientId, treatmentId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create payment.</DialogTitle>
            <DialogDescription>You can create a payment.</DialogDescription>
          </DialogHeader>
          <TreatmentVisitForm
            patientId={patientId}
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
