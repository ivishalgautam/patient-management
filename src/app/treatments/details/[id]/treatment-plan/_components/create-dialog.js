import TreatmentPlanForm from "@/components/forms/treatment-plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TreatmentPlanCreateDialog({ isOpen, setIsOpen, treatmentId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create treatment plan.</DialogTitle>
            <DialogDescription>
              You can create a treatment plan.
            </DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
