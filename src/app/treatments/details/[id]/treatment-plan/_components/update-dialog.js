import TreatmentPlanForm from "@/components/forms/treatment-plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TreatmentPlanUpdateDialog({
  isOpen,
  setIsOpen,
  treatmentId,
  planId,
  updateMutation,
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update treatment plan.</DialogTitle>
            <DialogDescription>Update treatment plan.</DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            treatmentId={treatmentId}
            closeDialog={setIsOpen}
            planId={planId}
            type="edit"
            updateMutation={updateMutation}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
