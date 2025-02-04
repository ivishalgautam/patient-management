import TreatmentPlanForm from "@/components/forms/treatment-plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ViewDialog({
  isOpen,
  setIsOpen,
  patientId,
  id,
  updateMutation,
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Update treatment plan.</DialogTitle>
            <DialogDescription>Update treatment plan.</DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            patientId={patientId}
            closeDialog={setIsOpen}
            id={id}
            type="view"
            updateMutation={updateMutation}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
