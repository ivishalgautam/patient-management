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
          <DialogTitle>Create document.</DialogTitle>
          <DialogDescription>You can create a document.</DialogDescription>
        </DialogHeader>
        <DocumentForm patientId={patientId} closeDialog={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
