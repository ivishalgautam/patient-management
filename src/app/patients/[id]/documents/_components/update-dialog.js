import DocumentForm from "@/components/forms/document";
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
  patientId,
  id,
  updateMutation,
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update dental note.</DialogTitle>
            <DialogDescription>Update dental note.</DialogDescription>
          </DialogHeader>
          <DocumentForm
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
