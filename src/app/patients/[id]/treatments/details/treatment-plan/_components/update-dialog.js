import TreatmentPlanForm from "@/components/forms/treatment-plan";
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
            <DialogTitle>Update treatment plan.</DialogTitle>
            <DialogDescription>Update treatment plan.</DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
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
