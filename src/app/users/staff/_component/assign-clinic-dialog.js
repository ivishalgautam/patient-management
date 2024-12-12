import AssignClinicForm from "@/components/forms/assign-clinic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AssignClinicDialog({ isOpen, setIsOpen, staffId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign clinic.</DialogTitle>
            <DialogDescription>You can assign clinic.</DialogDescription>
          </DialogHeader>
          <AssignClinicForm closeDialog={setIsOpen} staffId={staffId} />
        </DialogContent>
      </Dialog>
    </>
  );
}
