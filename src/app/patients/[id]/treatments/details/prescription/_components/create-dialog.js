import InvestigationForm from "@/components/forms/investigation";
import PrescriptionForm from "@/components/forms/prescription";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DentalNoteCreateDialog({ isOpen, setIsOpen, treatmentId }) {
  return (
    <>
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full">
          <DialogHeader>
            <DialogTitle>Create prescriptions.</DialogTitle>
            <DialogDescription>
              You can create a prescriptions.
            </DialogDescription>
          </DialogHeader>
          <PrescriptionForm treatmentId={treatmentId} closeDialog={setIsOpen} />
        </DialogContent>
      </Dialog> */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create prescriptions.</DrawerTitle>
            <DrawerDescription>
              You can create a prescriptions.
            </DrawerDescription>
            <PrescriptionForm
              treatmentId={treatmentId}
              closeDialog={setIsOpen}
            />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}
