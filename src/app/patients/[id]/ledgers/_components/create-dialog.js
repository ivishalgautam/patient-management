import LedgerForm from "@/components/forms/ledger";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateDialog({ isOpen, setIsOpen, patientId }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create payment.</DialogTitle>
            <DialogDescription>You can create a payment.</DialogDescription>
          </DialogHeader>
          <LedgerForm patientId={patientId} closeDialog={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
