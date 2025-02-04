import DocumentForm from "@/components/forms/document";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateDialog({ isOpen, setIsOpen, patientId }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create note.</DialogTitle>
          <DialogDescription>You can create a note.</DialogDescription>
        </DialogHeader>
        <DocumentForm patientId={patientId} closeDialog={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
