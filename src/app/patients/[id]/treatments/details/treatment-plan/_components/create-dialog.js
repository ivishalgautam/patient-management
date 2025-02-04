import TreatmentPlanForm from "@/components/forms/treatment-plan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateDialog({ isOpen, setIsOpen, patientId }) {
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

          <TreatmentPlanForm patientId={patientId} closeDialog={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
